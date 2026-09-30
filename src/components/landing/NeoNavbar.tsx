'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Logo from '@/components/brand/Logo';
import {
  Sun,
  Moon,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  HelpCircle,
  Database,
  Search,
  Layers,
  CreditCard,
  Scale,
  BookOpen,
  ShieldCheck,
  Mic,
  LogOut
} from 'lucide-react';

interface NeoNavbarProps {
  onOpenTour?: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export default function NeoNavbar({ onOpenTour, onOpenAuth }: NeoNavbarProps) {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignInClick = () => {
    if (onOpenAuth) {
      onOpenAuth('login');
    }
  };

  const handleGetStartedClick = () => {
    if (onOpenAuth) {
      onOpenAuth('signup');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 select-none">
      <nav
        ref={navRef}
        aria-label="Main Navigation"
        className={`w-full transition-all duration-300 px-4 sm:px-6 lg:px-8 border-b ${
          isScrolled
            ? 'bg-white/90 dark:bg-[#050811]/90 backdrop-blur-2xl border-slate-200/80 dark:border-white/[0.08] shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] py-3'
            : 'bg-white/75 dark:bg-[#050811]/75 backdrop-blur-xl border-slate-200/50 dark:border-white/[0.05] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-[1.02] shrink-0">
            <Logo size="sm" variant="auto" />
          </Link>

          {/* Center: Neo4j-Style Mega Dropdown Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            {/* 1. Capabilities Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'capabilities' ? null : 'capabilities')}
                onMouseEnter={() => setActiveDropdown('capabilities')}
                className={`h-9 px-3.5 rounded-full inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeDropdown === 'capabilities'
                    ? 'text-slate-950 dark:text-white bg-slate-100 dark:bg-white/10'
                    : 'hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                }`}
              >
                <span>Capabilities</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'capabilities' ? 'rotate-180 text-emerald-600 dark:text-[#00FF85]' : 'text-slate-400'}`} />
              </button>

              {activeDropdown === 'capabilities' && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-2 w-80 p-3 rounded-2xl bg-white/95 dark:bg-[#090e1a]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50 text-left"
                >
                  <a
                    href="#graphrag"
                    onClick={() => setActiveDropdown(null)}
                    className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.06] flex items-start gap-3 transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs block group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        GraphRAG Engine
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug">
                        Knowledge graph indexing with spatial citations
                      </span>
                    </div>
                  </a>

                  <a
                    href="#graphrag"
                    onClick={() => setActiveDropdown(null)}
                    className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.06] flex items-start gap-3 transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs block group-hover:text-cyan-600 dark:group-hover:text-cyan-300">
                        Hybrid Vector Search
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug">
                        Dense embeddings fused with BM25 keyword recall
                      </span>
                    </div>
                  </a>

                  <a
                    href="#testbench"
                    onClick={() => setActiveDropdown(null)}
                    className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.06] flex items-start gap-3 transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs block group-hover:text-purple-600 dark:group-hover:text-purple-300">
                        Multimodal Document Ingestion
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug">
                        Native Word (.docx), PDF, spreadsheets, and code
                      </span>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* 2. Solutions / Domain Lenses Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'solutions' ? null : 'solutions')}
                onMouseEnter={() => setActiveDropdown('solutions')}
                className={`h-9 px-3.5 rounded-full inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeDropdown === 'solutions'
                    ? 'text-slate-950 dark:text-white bg-slate-100 dark:bg-white/10'
                    : 'hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                }`}
              >
                <span>Solutions</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'solutions' ? 'rotate-180 text-emerald-600 dark:text-[#00FF85]' : 'text-slate-400'}`} />
              </button>

              {activeDropdown === 'solutions' && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-2 w-84 p-3 rounded-2xl bg-white/95 dark:bg-[#090e1a]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50 text-left"
                >
                  <a
                    href="#testbench"
                    onClick={() => setActiveDropdown(null)}
                    className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.06] flex items-start gap-3 transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs block group-hover:text-amber-600 dark:group-hover:text-amber-300">
                        Legal Counsel & Risk Redline
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug">
                        Automated clause comparison, uncapped liability detection
                      </span>
                    </div>
                  </a>

                  <a
                    href="#testbench"
                    onClick={() => setActiveDropdown(null)}
                    className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.06] flex items-start gap-3 transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs block group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        DocFin Quantitative Ledgers
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug">
                        Bank statement reconciliation & hidden fee radar
                      </span>
                    </div>
                  </a>

                  <a
                    href="#testbench"
                    onClick={() => setActiveDropdown(null)}
                    className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.06] flex items-start gap-3 transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs block group-hover:text-blue-600 dark:group-hover:text-blue-300">
                        Academic & Research Papers
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug">
                        ArXiv synthesis, statistical tables, and benchmark matrices
                      </span>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* 3. Architecture Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'architecture' ? null : 'architecture')}
                onMouseEnter={() => setActiveDropdown('architecture')}
                className={`h-9 px-3.5 rounded-full inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeDropdown === 'architecture'
                    ? 'text-slate-950 dark:text-white bg-slate-100 dark:bg-white/10'
                    : 'hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                }`}
              >
                <span>Architecture</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'architecture' ? 'rotate-180 text-emerald-600 dark:text-[#00FF85]' : 'text-slate-400'}`} />
              </button>

              {activeDropdown === 'architecture' && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-2 w-80 p-3 rounded-2xl bg-white/95 dark:bg-[#090e1a]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50 text-left"
                >
                  <div className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.06] flex items-start gap-3 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-[#00FF85] border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs block">
                        In-Browser Vosk Voice
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug">
                        100% private local speech recognition with zero audio retention
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.06] flex items-start gap-3 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs block">
                        Zero Document Retention
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug">
                        Ephemerally processed memory in client isolation
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Links */}
            <a
              href="#why-agent-one"
              className="h-9 px-3.5 rounded-full inline-flex items-center hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors whitespace-nowrap"
            >
              Why Agent One
            </a>

            {onOpenTour && (
              <button
                type="button"
                onClick={onOpenTour}
                className="h-9 px-3.5 rounded-full inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors cursor-pointer font-bold whitespace-nowrap"
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF85]" />
                <span>Quick Tour</span>
              </button>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle (Smooth White / Dark Switcher) */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to White Theme' : 'Switch to Dark Theme'}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-sm"
              title={theme === 'dark' ? 'Switch to White Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Sign in / Dashboard Links */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={logout}
                  className="h-9 px-3.5 rounded-full border border-slate-200 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-500/30 bg-slate-100/80 dark:bg-white/[0.06] hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  title="Log out of Agent One"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Log out</span>
                </button>
                <Link
                  href="/dashboard"
                  className="h-9 px-5 rounded-full bg-emerald-500 hover:bg-emerald-400 dark:bg-[#00FF85] dark:hover:bg-[#00f57e] text-white dark:text-[#050811] text-xs font-bold font-sans inline-flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(16,185,129,0.25)] dark:shadow-[0_0_20px_rgba(0,255,133,0.3)] transition-all cursor-pointer"
                >
                  <span>Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSignInClick}
                  className="hidden sm:inline-flex text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white px-3 py-1.5 transition-colors cursor-pointer"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={handleGetStartedClick}
                  className="h-9 px-5 rounded-full bg-emerald-500 hover:bg-emerald-400 dark:bg-[#00FF85] dark:hover:bg-[#00f57e] text-white dark:text-[#050811] text-xs font-bold font-sans inline-flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(16,185,129,0.25)] dark:shadow-[0_0_20px_rgba(0,255,133,0.3)] transition-all cursor-pointer"
                >
                  <span>Get started free</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-full bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Out Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 p-5 rounded-3xl bg-white/98 dark:bg-[#070b14]/98 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-200 text-left max-h-[85vh] overflow-y-auto">
            <div className="flex flex-col gap-2 pb-3 border-b border-slate-200/80 dark:border-white/10">
              <a
                href="#graphrag"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                GraphRAG Engine
              </a>
              <a
                href="#ecosystem"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                Enterprise Integrations
              </a>
              <a
                href="#testbench"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                Live Testbench
              </a>
              <a
                href="#why-agent-one"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                Why Agent One
              </a>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Appearance</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-semibold text-slate-800 dark:text-white inline-flex items-center gap-1.5"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
                <span>{theme === 'dark' ? 'Dark Theme' : 'White Theme'}</span>
              </button>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 dark:bg-[#00FF85] text-white dark:text-black font-bold text-center text-xs"
                  >
                    Go to Workspace
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full py-2.5 rounded-full border border-slate-200 dark:border-white/10 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-semibold text-xs text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignInClick();
                    }}
                    className="w-full py-2.5 rounded-full border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white font-semibold text-xs text-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleGetStartedClick();
                    }}
                    className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 dark:bg-[#00FF85] text-white dark:text-black font-bold text-center text-xs shadow-lg cursor-pointer"
                  >
                    Get started free
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
