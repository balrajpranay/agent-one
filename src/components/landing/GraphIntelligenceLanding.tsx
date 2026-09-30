'use client';

import React, { useState } from 'react';
import AnnouncementBar from './AnnouncementBar';
import NeoNavbar from './NeoNavbar';
import NeoHero from './NeoHero';
import CustomerProofBar from './CustomerProofBar';
import GraphRagSection from './GraphRagSection';
import EcosystemSection from './EcosystemSection';
import WhatsNewSection from './WhatsNewSection';
import LiveTestbenchSection from './LiveTestbenchSection';
import ComparisonSection from './ComparisonSection';
import FinalCallToAction from './FinalCallToAction';
import NeoFooter from './NeoFooter';
import ModernLoginSignup from '@/components/ui/modern-login-signup';

interface GraphIntelligenceLandingProps {
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export default function GraphIntelligenceLanding({ onOpenAuth: externalOpenAuth }: GraphIntelligenceLandingProps) {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'login'
  });

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    if (externalOpenAuth) {
      externalOpenAuth(mode);
    } else {
      setAuthModal({ isOpen: true, mode });
    }
  };

  const handleCloseAuth = () => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050811] text-slate-900 dark:text-white selection:bg-emerald-500/20 dark:selection:bg-[#00FF85]/20 selection:text-emerald-900 dark:selection:text-[#00FF85] overflow-x-hidden font-sans transition-colors duration-300 antialiased">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Neo Navbar with Theme Switcher and Auth Triggers */}
      <NeoNavbar onOpenAuth={handleOpenAuth} />

      {/* 3. Main Landing Content Stream */}
      <main className="relative flex flex-col w-full overflow-hidden">
        {/* Hero Section with Reactive Constellation Neural Canvas */}
        <NeoHero onOpenAuth={handleOpenAuth} />

        {/* Customer Social Proof / Case Studies */}
        <CustomerProofBar />

        {/* GraphRAG 3-Tier Lobe Architecture */}
        <GraphRagSection />

        {/* Enterprise Partner & Integration Nexus Map */}
        <EcosystemSection />

        {/* What's New Feature Highlights */}
        <WhatsNewSection />

        {/* Interactive Live Reasoning Testbench */}
        <LiveTestbenchSection />

        {/* Head-to-Head Comparison Matrix */}
        <ComparisonSection />

        {/* Final Conversion Call To Action */}
        <FinalCallToAction onOpenAuth={handleOpenAuth} />
      </main>

      {/* 4. Comprehensive Enterprise Footer */}
      <NeoFooter />

      {/* 5. Modern Sign In / Sign Up Modal with Real Google OAuth */}
      <ModernLoginSignup
        isOpen={authModal.isOpen}
        onClose={handleCloseAuth}
        initialMode={authModal.mode}
      />
    </div>
  );
}
