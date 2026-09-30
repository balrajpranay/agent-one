import Link from 'next/link';
import { FileQuestion, ArrowLeft, LayoutDashboard, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[var(--bg-canvas)] text-[var(--text-primary)] px-6 py-12">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-[#121722] p-8 sm:p-10 rounded-3xl border border-[#DCE5F0] dark:border-white/10 shadow-xl">
        <div className="w-16 h-16 rounded-3xl bg-blue-500/10 dark:bg-blue-500/20 text-[#2563EB] dark:text-blue-400 flex items-center justify-center mx-auto shadow-xs">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#2563EB] uppercase">
            404 • Resource Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#101828] dark:text-white">
            Page Not Located
          </h1>
          <p className="text-xs text-[#53627A] dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            The document analysis route or page you requested does not exist or has been relocated in the active session.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Open Dashboard</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#F4F7FC] hover:bg-[#EBF2FE] dark:bg-white/5 dark:hover:bg-white/10 text-[#101828] dark:text-white text-xs font-semibold transition-all border border-[#DCE5F0] dark:border-white/10 flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
