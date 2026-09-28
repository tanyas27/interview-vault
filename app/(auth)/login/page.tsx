'use client';

import { useState, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login, register, type AuthState } from '@/actions/auth';
import { Lock, Mail, User, ShieldCheck, ArrowRight, Sparkles, KeyRound } from 'lucide-react';

const initialState: AuthState = {};

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [loginState, loginAction, isLoginPending] = useActionState(login, initialState);
  const [registerState, registerAction, isRegisterPending] = useActionState(register, initialState);

  const activeError = mode === 'login' ? loginState?.error : registerState?.error;
  const isPending = mode === 'login' ? isLoginPending : isRegisterPending;

  return (
    <div className="w-full">
      <Card className="rounded-[28px] sm:rounded-[32px] bg-[#fcfbf7] border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden">
        {/* Top Header */}
        <CardHeader className="space-y-3 text-center pb-3 pt-6 sm:pt-8 px-4 sm:px-6">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#1c2024] flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 text-[#ffcf36]" />
          </div>
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-[#1c2024]">
              InterviewVault
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-[#5d636f] mt-1 max-w-xs mx-auto leading-relaxed">
              {mode === 'login'
                ? 'Sign in to access your private interview pipeline'
                : 'Create your private account to start tracking'}
            </CardDescription>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="p-1 bg-black/5 rounded-full grid grid-cols-2 w-full max-w-[280px] mx-auto mt-2">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-2 px-3 text-xs font-bold rounded-full transition-all text-center whitespace-nowrap ${
                mode === 'login'
                  ? 'bg-white text-[#1c2024] shadow-xs'
                  : 'text-[#5d636f] hover:text-[#1c2024]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-2 px-3 text-xs font-bold rounded-full transition-all text-center whitespace-nowrap ${
                mode === 'register'
                  ? 'bg-white text-[#1c2024] shadow-xs'
                  : 'text-[#5d636f] hover:text-[#1c2024]'
              }`}
            >
              Create Account
            </button>
          </div>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8 space-y-4">
          {/* Privacy Note */}
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#ffcf36]/15 border border-[#ffcf36]/30 text-xs text-[#1c2024]">
            <ShieldCheck className="w-4 h-4 text-[#8a6b00] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {mode === 'login'
                ? <><strong>Private Vault:</strong> Your data is 100% isolated — only you can see your pipeline and notes.</>
                : <><strong>Invite Only:</strong> Registration requires an invite code from the vault owner.</>}
            </p>
          </div>

          {/* Error Alert */}
          {activeError && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
              {activeError}
            </div>
          )}

          {/* Form */}
          <form action={mode === 'login' ? loginAction : registerAction} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-[#1c2024]">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e939f]" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    className="pl-10"
                    disabled={isPending}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-[#1c2024]">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e939f]" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@domain.com"
                  className="pl-10"
                  disabled={isPending}
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="space-y-1.5">
                <Label htmlFor="inviteCode" className="text-xs font-semibold text-[#1c2024]">
                  Invite Code
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e939f]" />
                  <Input
                    id="inviteCode"
                    name="inviteCode"
                    type="password"
                    required
                    placeholder="Enter your invite code"
                    className="pl-10"
                    disabled={isPending}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-[#1c2024]">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e939f]" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder={mode === 'register' ? 'Minimum 8 characters' : 'Enter your password'}
                  className="pl-10"
                  disabled={isPending}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 rounded-full bg-[#1c2024] hover:bg-black text-white font-medium text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{isPending ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create My Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Footer toggle note */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-xs text-[#5d636f] hover:text-[#1c2024] underline transition-colors"
            >
              {mode === 'login'
                ? "Don't have an account yet? Create one"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
