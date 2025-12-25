'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface TransitionContextType {
  isTransitioning: boolean;
  navigateTo: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: false,
  navigateTo: () => { },
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

interface PageTransitionProviderProps {
  children: ReactNode;
}

export function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Scroll to top when pathname changes (page loaded)
  useEffect(() => {
    setIsTransitioning(false);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  const navigateTo = useCallback((href: string) => {
    if (href === pathname) return;

    // Navigate immediately without delay - scroll happens after page loads
    startTransition(() => {
      router.push(href);
    });
  }, [pathname, router]);

  return (
    <TransitionContext.Provider value={{ isTransitioning: isTransitioning || isPending, navigateTo }}>
      {/* Page Content - No opacity transition to avoid dim overlay */}
      <div className="opacity-100">
        {children}
      </div>
    </TransitionContext.Provider>
  );
}

// Transition Link Component
interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TransitionLink({ href, children, className, onClick }: TransitionLinkProps) {
  const { navigateTo } = usePageTransition();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.();

    // Check if it's an external link
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }

    navigateTo(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
