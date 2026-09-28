import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL must be set'),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters — generate one with: openssl rand -hex 32'),
  INVITE_CODE: z.string().min(8, 'INVITE_CODE must be at least 8 characters').optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const messages = result.error.issues
      .map((e) => `  ${String(e.path.join('.'))}: ${e.message}`)
      .join('\n');
    throw new Error(`Missing or invalid environment variables:\n${messages}`);
  }
  return result.data;
}

export const env = validateEnv();
