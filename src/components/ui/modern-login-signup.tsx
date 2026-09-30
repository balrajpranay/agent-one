'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Logo from '@/components/brand/Logo';
import { Loader2, AlertCircle, X, CheckCircle2 } from 'lucide-react';

interface ModernLoginSignupProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialMode?: 'login' | 'signup';
}

export default function ModernLoginSignup({
  isOpen = true,
  onClose,
  initialMode = 'login'
}: ModernLoginSignupProps) {
  const router = useRouter();
  const { login, signup, loginWithGoogle, handleGoogleSuccess } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [isLogin, setIsLogin] = useState<boolean>(initialMode === 'login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync mode with prop changes
  useEffect(() => {
    setIsLogin(initialMode === 'login');
    setErrorMessage('');
    setSuccessMessage('');
  }, [initialMode, isOpen]);

  // Handle escape key to close if modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Animated Dot-Matrix Background Canvas (Theme-Aware)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const spacing = 28;
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = isLight ? '#f1f5f9' : '#050505';
      ctx.fillRect(0, 0, width, height);

      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          const dist = Math.sin(i * 0.2 + time) * Math.cos(j * 0.2 + time);
          const alpha = Math.max(0.04, (dist + 1) * 0.12);

          ctx.fillStyle = isLight
            ? `rgba(15, 23, 42, ${alpha * 0.4})`
            : `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isOpen, isLight]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (!isLogin && !fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.success) {
          setSuccessMessage('Welcome back to Agent One.');
          setTimeout(() => {
            if (onClose) onClose();
            router.push('/dashboard');
          }, 400);
        } else {
          setErrorMessage(res.error || 'Invalid credentials. Please verify your email and password.');
        }
      } else {
        const res = await signup(fullName, email, password);
        if (res.success) {
          setSuccessMessage('Account created successfully.');
          setTimeout(() => {
            if (onClose) onClose();
            router.push('/dashboard');
          }, 400);
        } else {
          setErrorMessage(res.error || 'Failed to create account. Please try again.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Real Google OAuth Login Hook
  const googleLoginTrigger = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        }).then((res) => res.json());

        if (userInfo && userInfo.email) {
          await handleGoogleSuccess({ profile: userInfo });
          setSuccessMessage(`Signed in as ${userInfo.email}`);
          setTimeout(() => {
            if (onClose) onClose();
            router.push('/dashboard');
          }, 400);
          return;
        }
      } catch (err: any) {
        console.warn('Google profile fetch notice:', err);
        setErrorMessage('Failed to retrieve Google profile. Please try again.');
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      setIsGoogleLoading(false);
      setErrorMessage('Google Authentication was cancelled or failed.');
    }
  });

  const handleGoogleClick = async () => {
    setErrorMessage('');
    try {
      googleLoginTrigger();
    } catch {
      // Fallback to Supabase Google Auth redirect
      setIsGoogleLoading(true);
      const res = await loginWithGoogle();
      if (res.success) {
        if (onClose) onClose();
        router.push('/dashboard');
      } else {
        setErrorMessage(res.error || 'Google sign-in unavailable.');
        setIsGoogleLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 dark:bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      {/* Background Interactive Dot Matrix Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-40 z-0"
      />

      {/* Main Centered Authentication Card */}
      <div className="relative z-10 w-full max-w-[420px] rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#080808]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl transition-all my-auto">
        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-white/50 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-3">
            <Logo size="md" variant="auto" />
          </div>
          <h2 id="auth-modal-title" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isLogin ? 'Sign in to Agent One' : 'Create your Agent One account'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-white/50 mt-1 max-w-[280px]">
            {isLogin
              ? 'Autonomous AI Document Intelligence & Enterprise Knowledge Extraction'
              : 'Start analyzing, verifying, and reasoning across documents instantly'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-5">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setErrorMessage('');
            }}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isLogin
                ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black'
                : 'text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setErrorMessage('');
            }}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              !isLogin
                ? 'bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black'
                : 'text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-2 p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-xs animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs animate-in fade-in"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Real Google OAuth Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={isGoogleLoading || isLoading}
            className="w-full h-10 px-4 rounded-xl border border-slate-300 dark:border-[#333] bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 text-slate-800 dark:text-white font-medium text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50 shadow-sm dark:shadow-none"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-900 dark:text-white" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>{isLogin ? 'Continue with Google' : 'Sign up with Google'}</span>
          </button>
        </div>

        {/* Separator Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-[#222]" />
          </div>
          <span className="relative px-2 bg-white dark:bg-[#080808] text-[10px] uppercase font-mono tracking-widest text-slate-400 dark:text-white/40">
            or with email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <div>
              <label
                htmlFor="auth-fullname"
                className="block text-[11px] font-medium text-slate-700 dark:text-white/70 mb-1"
              >
                Full Name
              </label>
              <input
                id="auth-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                disabled={isLoading}
                required={!isLogin}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#333] bg-slate-50 dark:bg-black text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-white/30 focus:border-emerald-500 dark:focus:border-white/60 focus:outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email"
              className="block text-[11px] font-medium text-slate-700 dark:text-white/70 mb-1"
            >
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@enterprise.com"
              disabled={isLoading}
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#333] bg-slate-50 dark:bg-black text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-white/30 focus:border-emerald-500 dark:focus:border-white/60 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="auth-password"
                className="text-[11px] font-medium text-slate-700 dark:text-white/70"
              >
                Password
              </label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => router.push('/forgot-password')}
                  className="text-[10px] text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Forgot?
                </button>
              )}
            </div>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={isLoading}
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#333] bg-slate-50 dark:bg-black text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-white/30 focus:border-emerald-500 dark:focus:border-white/60 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full h-10 mt-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 dark:bg-[#00FF85] dark:hover:bg-[#00f57e] text-white dark:text-[#050811] font-semibold text-xs tracking-tight flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md dark:shadow-[0_0_20px_rgba(0,255,133,0.3)] disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-white dark:text-black" />}
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>

        {/* Terms Footer */}
        <p className="text-[10px] text-center text-slate-400 dark:text-white/40 mt-5 leading-relaxed">
          By signing in, you agree to Agent One{' '}
          <a href="#terms" className="underline hover:text-slate-700 dark:hover:text-white/70">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#privacy" className="underline hover:text-slate-700 dark:hover:text-white/70">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
