'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthCard from '@/components/auth/AuthCard';
import { Mail, ArrowRight, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSent(true);
      setIsSubmitting(false);
    }, 700);
  };

  return (
    <AuthCard
      title="Reset Agent One Password"
      subtitle="Enter your work email address and we'll dispatch a secure recovery link."
      badgeText="Account Recovery"
      footerLink={{
        text: 'Remembered your password?',
        label: 'Back to sign in',
        href: '/login'
      }}
    >
      {isSent ? (
        <div className="text-center py-4 space-y-4 animate-in fade-in">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-[#0F172A] dark:text-white">
            Recovery Email Dispatched
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8E9690] leading-relaxed max-w-xs mx-auto">
            We sent a password reset link to <strong className="text-[#0F172A] dark:text-white">{email}</strong>. Please check your inbox or spam folder.
          </p>
          <div className="pt-2">
            <Link
              href="/reset-password"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              <span>Proceed to Password Reset</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-[#0F172A] dark:text-[#F2F4F3] block mb-1.5">
              Account Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 dark:text-[#8E9690] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-full text-xs sm:text-sm text-[#0F172A] dark:text-[#F2F4F3] placeholder:text-slate-400 dark:placeholder:text-[#8E9690] focus:bg-white dark:focus:bg-[#141a18] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-2xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-3 sm:py-3.5 px-4 rounded-full bg-[#288E4F] dark:bg-[#4CAF6B] text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Dispatching instructions...</span>
              </>
            ) : (
              <>
                <span>Send Recovery Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
