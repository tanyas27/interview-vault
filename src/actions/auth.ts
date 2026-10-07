'use server';

import { cookies, headers } from 'next/headers';
import { redirect, unstable_rethrow } from 'next/navigation';
import { db } from '@/lib/db';
import { hashPassword, verifyPassword, signToken, verifyToken } from '@/lib/auth';
import { loginSchema, registerSchema, profileSchema } from '@/lib/schemas';
import { loginLimiter, registerLimiter } from '@/lib/ratelimit';

export type AuthState = {
  error?: string;
  success?: boolean;
};

async function getClientIp(): Promise<string> {
  const headerStore = await headers();
  return (
    headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerStore.get('x-real-ip') ||
    'unknown'
  );
}

export async function login(prevState: AuthState | undefined, formData: FormData): Promise<AuthState> {
  const ip = await getClientIp();
  const rateLimit = await loginLimiter.check(`login:${ip}`);
  if (!rateLimit.allowed) {
    return { error: 'Too many login attempts. Please try again in a minute.' };
  }

  const raw = {
    email: (formData.get('email') as string || '').trim().toLowerCase(),
    password: formData.get('password') as string || '',
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const { email, password } = parsed.data;

  try {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, passwordHash: true, tokenVersion: true },
    });

    // Constant-time: always run bcrypt even when user not found to prevent timing attacks
    const dummyHash = '$2a$12$invalidhashfortimingnormalization.......';
    const isValid = user
      ? await verifyPassword(password, user.passwordHash)
      : await verifyPassword(password, dummyHash).then(() => false);

    if (!user || !isValid) {
      return { error: 'Invalid email or password.' };
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      tokenVersion: user.tokenVersion,
    });

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 14,
    });
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Something went wrong during sign in. Please try again.' };
  }

  redirect('/dashboard');
}

export async function register(prevState: AuthState | undefined, formData: FormData): Promise<AuthState> {
  const ip = await getClientIp();
  const rateLimit = await registerLimiter.check(`register:${ip}`);
  if (!rateLimit.allowed) {
    return { error: 'Too many registration attempts. Please try again in a minute.' };
  }

  const raw = {
    name: (formData.get('name') as string || '').trim(),
    email: (formData.get('email') as string || '').trim().toLowerCase(),
    password: formData.get('password') as string || '',
    inviteCode: (formData.get('inviteCode') as string || '').trim(),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const { name, email, password, inviteCode } = parsed.data;

  // ── Invite-code gate ────────────────────────────────────────────────────────
  const expectedCode = process.env.INVITE_CODE;
  if (!expectedCode) {
    return { error: 'Registration is currently disabled. Contact the owner for access.' };
  }

  // Timing-safe comparison to prevent brute-force timing oracle attacks
  const inviteBuffer = Buffer.from(inviteCode.padEnd(expectedCode.length, '\0'));
  const expectedBuffer = Buffer.from(expectedCode.padEnd(inviteCode.length, '\0'));
  const codeMatch =
    inviteCode.length === expectedCode.length &&
    require('crypto').timingSafeEqual(inviteBuffer, expectedBuffer);

  if (!codeMatch) {
    return { error: 'Invalid invite code. Please check with the owner and try again.' };
  }
  // ─────────────────────────────────────────────────────────────────────────────

  try {
    const existing = await db.user.findUnique({ where: { email } });

    if (existing) {
      return { error: 'Unable to create account. Check your details and try again.' };
    }

    const passwordHash = await hashPassword(password);

    const newUser = await db.user.create({
      data: { name, email, passwordHash },
    });

    const token = await signToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      tokenVersion: 0,
    });

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 14,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Failed to create account. Please try again.' };
  }

  redirect('/dashboard');
}

export async function logout() {
  const user = await getCurrentUser();

  if (user) {
    // Increment tokenVersion to invalidate all existing tokens for this account
    await db.user.update({
      where: { id: user.userId },
      data: { tokenVersion: { increment: 1 } },
    });
  }

  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  redirect('/login');
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload?.userId) return null;

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        tokenVersion: true,
        currentRole: true,
        currentCompany: true,
        targetRole: true,
        currentSalary: true,
        expectedSalary: true,
        phone: true,
        location: true,
      },
    });

    if (!user) return null;

    // Reject tokens that predate a logout or password change
    if ((payload.tokenVersion ?? 0) !== user.tokenVersion) return null;

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      currentRole: user.currentRole || '',
      currentCompany: user.currentCompany || '',
      targetRole: user.targetRole || '',
      currentSalary: user.currentSalary,
      expectedSalary: user.expectedSalary,
      phone: user.phone || '',
      location: user.location || '',
    };
  } catch (error) {
    unstable_rethrow(error);
    console.error('Failed to get current user:', error);
    return null;
  }
}

function parseSalaryInput(val: string | null | undefined): number | null {
  if (!val) return null;
  const cleaned = val.replace(/[₹,\s]/g, '').toLowerCase();
  if (!cleaned) return null;
  if (cleaned.endsWith('lpa') || cleaned.endsWith('l')) {
    const num = parseFloat(cleaned.replace(/lpa|l/, ''));
    if (!isNaN(num)) return Math.round(num * 100_000);
  }
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? null : parsed;
}

export async function updateUserProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const raw = {
    name: (formData.get('name') as string || '').trim(),
    currentRole: (formData.get('currentRole') as string || '').trim(),
    currentCompany: (formData.get('currentCompany') as string || '').trim(),
    targetRole: (formData.get('targetRole') as string || '').trim(),
    location: (formData.get('location') as string || '').trim(),
    currentSalary: formData.get('currentSalary') as string,
    expectedSalary: formData.get('expectedSalary') as string,
  };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Invalid profile data.');
  }

  const currentSalary = parseSalaryInput(raw.currentSalary);
  const expectedSalary = parseSalaryInput(raw.expectedSalary);

  await db.user.update({
    where: { id: user.userId },
    data: {
      ...(raw.name ? { name: raw.name } : {}),
      currentRole: raw.currentRole || null,
      currentCompany: raw.currentCompany || null,
      targetRole: raw.targetRole || null,
      location: raw.location || null,
      currentSalary,
      expectedSalary,
    },
  });

  const { revalidatePath } = await import('next/cache');
  revalidatePath('/dashboard');
  revalidatePath('/settings');
}
