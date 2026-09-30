'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function ImpeccableLiveClient() {
  const pathname = usePathname();
  const loadedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') return;

    let isMounted = true;
    let pollInterval: NodeJS.Timeout | null = null;

    // Inject CSS to ensure the Impeccable floating bar stays visible at all times
    const ensureStyles = () => {
      const styleId = 'impeccable-always-visible-styles';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          #impeccable-live-global-bar {
            display: flex !important;
            opacity: 1 !important;
            visibility: visible !important;
            transform: translateX(-50%) translateY(0) !important;
            z-index: 100010 !important;
            pointer-events: auto !important;
          }
        `;
        document.head.appendChild(style);
      }
    };

    const loadLiveScript = async () => {
      try {
        const res = await fetch('/api/impeccable');
        if (!res.ok) return;
        const data = await res.json();

        if (!data.active || !data.token) return;

        // If already loaded with the same token, verify bar is present
        if (loadedTokenRef.current === data.token) {
          ensureStyles();
          return;
        }

        // Remove any old/stale live.js script
        const existingScripts = document.querySelectorAll('script[src*="8400/live.js"]');
        existingScripts.forEach((s) => s.remove());

        const script = document.createElement('script');
        script.id = 'impeccable-live-script';
        script.src = `http://localhost:${data.port}/live.js?token=${data.token}`;
        script.async = true;

        script.onload = () => {
          if (!isMounted) return;
          loadedTokenRef.current = data.token;
          ensureStyles();
          console.log('✨ Impeccable Live UI loaded & visible');
        };

        script.onerror = () => {
          console.warn('Impeccable Live helper failed to load script, retrying...');
          loadedTokenRef.current = null;
        };

        document.body.appendChild(script);
      } catch {
        // Retry silently on next interval
      }
    };

    ensureStyles();
    loadLiveScript();

    // Check periodically to ensure live server connection & bar visibility persist
    pollInterval = setInterval(() => {
      if (!isMounted) return;
      ensureStyles();
      const existingBar = document.getElementById('impeccable-live-global-bar');
      if (!existingBar || !loadedTokenRef.current) {
        loadLiveScript();
      }
    }, 4000);

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [pathname]);

  return null;
}
