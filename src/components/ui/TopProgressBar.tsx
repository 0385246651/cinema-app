'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function TopProgressBar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timeout = setTimeout(() => setIsVisible(false), 400);
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 z-[99999]">
      <div
        className="h-full bg-gradient-to-r from-violet-600 to-pink-600 animate-[progress_0.4s_ease-out_forwards]"
      />
    </div>
  );
}
