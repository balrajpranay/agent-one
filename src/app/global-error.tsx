'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen w-screen flex items-center justify-center bg-[#07090e] text-white p-6 font-sans antialiased">
        <div className="max-w-md w-full text-center space-y-6 bg-[#121722] p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-rose-400 uppercase">
              500 • Critical Exception
            </span>
            <h1 className="text-xl font-bold">Application Error</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              A critical unhandled error occurred at the application root level.
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
