'use client';

import React, { Suspense } from 'react';
import DashboardPage from '@/app/dashboard/page';

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-[#0b0e14] text-white text-xs font-mono">Loading Agent One Workspace...</div>}>
      <DashboardPage />
    </Suspense>
  );
}
