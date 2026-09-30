'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Logo from '@/components/brand/Logo';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sun,
  Moon,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const {
    login,
    loginWithGoogle,
    loginAsGuest,
    handleGoogleSuccess,
    handleGoogleError,
    googleClientId,
    isLoading
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const res = await login(email, password);
    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMessage(res.error || 'Invalid email or password. Please check your credentials.');
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    setErrorMessage('');
    setIsGuestLoading(true);
    const res = await loginAsGuest();
    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMessage(res.error || 'Unable to launch guest workspace.');
      setIsGuestLoading(false);
    }
  };

  const handleGoogleSignInFallback = async () => {
    setErrorMessage('');
    setIsSubmitting(true);
    const res = await loginWithGoogle();
    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMessage(res.error || 'Google sign-in failed.');
      setIsSubmitting(false);
    }
  };

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then((res) => res.json());

        if (userInfo && userInfo.email) {
          await handleGoogleSuccess({ profile: userInfo });
          router.push('/dashboard');
          return;
        }
      } catch (err) {
        console.warn('Google profile fetch notice:', err);
      }
      handleGoogleSignInFallback();
    },
    onError: () => {
      handleGoogleSignInFallback();
    },
  });

  const onGoogleLoginClick = () => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      triggerGoogleLogin();
    } catch {
      handleGoogleSignInFallback();
    }
  };

  return (
    <div className="min-h-dvh w-full max-w-[100vw] flex flex-col justify-between bg-[var(--bg-canvas)] text-[var(--text-primary)] relative overflow-hidden transition-colors duration-300 select-none p-3.5 sm:p-6 lg:p-8">
      {/* Background Google AI Studio & Relay Grid Mesh Layers */}
      <div className="absolute inset-0 bg-studio-grid pointer-events-none opacity-70 dark:opacity-40 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black_70%,transparent_100%)]" />
      <div className="absolute inset-0 bg-studio-dots pointer-events-none opacity-35 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black_70%,transparent_100%)]" />
      <div className="absolute inset-0 bg-studio-beam pointer-events-none" />

      {/* Floating Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-600/10 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Brand & Controls */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between z-10 pt-1 gap-2">
        <Link href="/" className="hover:opacity-90 transition-opacity flex-shrink-0">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-black/5 dark:hover:border-white/10 transition-all font-medium flex items-center gap-1.5 touch-target"
            title="Return to Home"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Back to Home</span>
          </Link>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-full text-[#1E3A2B] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-black/10 dark:border-white/10 flex items-center justify-center transition-all shadow-xs touch-target cursor-pointer flex-shrink-0"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#1E3A2B]" />}
          </button>
        </div>
      </header>

      {/* Main Centered Sign-In Card */}
      <main className="max-w-md w-full mx-auto my-auto py-6 sm:py-8 z-10">
        <div className="card-glass bg-white/90 dark:bg-[#0A0E0C]/90 backdrop-blur-2xl rounded-3xl p-5 sm:p-9 border border-black/10 dark:border-emerald-500/20 shadow-2xl shadow-emerald-950/20 space-y-5 relative overflow-hidden">
          {/* Top Subtle Specular Light Highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00FF85]/60 to-transparent" />

          {/* Header */}
          <div className="space-y-1.5 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-mono font-bold uppercase tracking-wider mx-auto">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Option Access</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] dark:text-[#F2F4F3] tracking-tight">
              Sign in to Agent One
            </h1>
            <p className="text-xs sm:text-sm text-[#2E503B] dark:text-[#8E9690] leading-relaxed">
              Enter your credentials or test instantly with 1-click guest mode
            </p>
          </div>

          {/* Option 1: 1-Click Instant Guest Demo Button (Hero High-Priority Option) */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 dark:border-emerald-500/30">
            <button
              type="button"
              disabled={isGuestLoading || isSubmitting || isLoading}
              onClick={handleGuestLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00FF85] to-[#10B981] hover:from-[#10B981] hover:to-[#059669] text-[#052e16] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50 group"
            >
              {isGuestLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#052e16]" />
                  <span>Launching Workspace...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-[#052e16] text-[#052e16] group-hover:scale-110 transition-transform" />
                  <span>Explore as Guest / 1-Click Instant Demo</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ml-auto" />
                </>
              )}
            </button>
            <div className="flex items-center justify-between text-[10px] text-emerald-800 dark:text-emerald-400 font-mono mt-1.5 px-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                No registration required
              </span>
              <span>All 4 demo docs loaded</span>
            </div>
          </div>

          {/* Clean Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
            <span className="text-[10px] text-slate-500 dark:text-[#8E9690] font-mono uppercase tracking-wider font-semibold">
              Or sign in with account
            </span>
            <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
          </div>

          {/* Option 2: Unified Google OAuth Login Bar */}
          <button
            type="button"
            disabled={isSubmitting || isLoading || isGuestLoading}
            onClick={onGoogleLoginClick}
            className="w-full py-2.5 px-4 rounded-xl bg-white/90 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-black/15 dark:border-white/15 text-[#0F172A] dark:text-[#F2F4F3] text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-[#00FF85]" />
                <span>Authenticating with Google...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Option 3: Email & Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
            <div>
              <label className="text-xs font-bold text-[#0F172A] dark:text-[#F2F4F3] block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-[#8E9690] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-xs sm:text-sm text-[#0F172A] dark:text-[#F2F4F3] placeholder:text-slate-400 dark:placeholder:text-[#8E9690] focus:bg-white dark:focus:bg-[#141a18] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#0F172A] dark:text-[#F2F4F3]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-[#8E9690] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-xs sm:text-sm text-[#0F172A] dark:text-[#F2F4F3] placeholder:text-slate-400 dark:placeholder:text-[#8E9690] focus:bg-white dark:focus:bg-[#141a18] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8E9690] hover:text-[#0F172A] dark:hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-[#8E9690]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-black/20 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading || isGuestLoading}
              className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#0c3822] hover:bg-[#14532d] text-white border border-emerald-500/40 text-xs sm:text-sm font-bold shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In with Email</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="text-center pt-2 border-t border-black/[0.06] dark:border-white/10">
            <p className="text-xs text-slate-600 dark:text-[#8E9690]">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline ml-1"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Security Trust Badge */}
        <div className="flex items-center justify-center gap-2 mt-4 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>SOC-2 Type II Certified • 256-Bit SSL • Neo4j & Supabase Connected</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md w-full mx-auto text-center text-[11px] text-slate-500 dark:text-slate-400 pb-2 z-10">
        <Link href="/" className="hover:underline">← Back to Homepage</Link>
      </footer>
    </div>
  );
}
