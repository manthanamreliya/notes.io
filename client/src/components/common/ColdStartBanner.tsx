import React, { useState, useEffect } from 'react';
import { subscribeColdStart } from '../../api/apiClient';

export const ColdStartBanner: React.FC = () => {
  const [isWaking, setIsWaking] = useState<boolean>(false);

  useEffect(() => {
    let autoHideTimer: ReturnType<typeof setTimeout> | null = null;

    const unsubscribe = subscribeColdStart((waking) => {
      setIsWaking(waking);

      if (waking) {
        if (autoHideTimer) clearTimeout(autoHideTimer);
        // Safety cap: Automatically hide after 10s max regardless of request state
        autoHideTimer = setTimeout(() => {
          setIsWaking(false);
        }, 10000);
      } else {
        if (autoHideTimer) {
          clearTimeout(autoHideTimer);
          autoHideTimer = null;
        }
      }
    });

    return () => {
      unsubscribe();
      if (autoHideTimer) clearTimeout(autoHideTimer);
    };
  }, []);

  if (!isWaking) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#4f7cff] to-[#60a5fa] text-white px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-lg animate-fade-in">
      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
      <span>Waking up the server, this may take a moment...</span>
    </div>
  );
};
