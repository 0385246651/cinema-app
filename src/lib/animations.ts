'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Animation configurations
export const ANIMATION_DURATION = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  verySlow: 1.2,
};

export const ANIMATION_EASE = {
  smooth: 'power2.out',
  elastic: 'elastic.out(1, 0.5)',
  bounce: 'bounce.out',
  back: 'back.out(1.7)',
  expo: 'expo.out',
};

// Fade animations
export const fadeIn = (element: Element, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: ANIMATION_DURATION.normal,
      delay,
      ease: ANIMATION_EASE.smooth,
    }
  );
};

export const fadeInUp = (element: Element, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: ANIMATION_DURATION.normal,
      delay,
      ease: ANIMATION_EASE.smooth,
    }
  );
};

export const fadeInDown = (element: Element, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: -50 },
    {
      opacity: 1,
      y: 0,
      duration: ANIMATION_DURATION.normal,
      delay,
      ease: ANIMATION_EASE.smooth,
    }
  );
};

export const fadeInLeft = (element: Element, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: ANIMATION_DURATION.normal,
      delay,
      ease: ANIMATION_EASE.smooth,
    }
  );
};

export const fadeInRight = (element: Element, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, x: 50 },
    {
      opacity: 1,
      x: 0,
      duration: ANIMATION_DURATION.normal,
      delay,
      ease: ANIMATION_EASE.smooth,
    }
  );
};

// Scale animations
export const scaleIn = (element: Element, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, scale: 0.8 },
    {
      opacity: 1,
      scale: 1,
      duration: ANIMATION_DURATION.normal,
      delay,
      ease: ANIMATION_EASE.back,
    }
  );
};

export const popIn = (element: Element, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, scale: 0.5 },
    {
      opacity: 1,
      scale: 1,
      duration: ANIMATION_DURATION.normal,
      delay,
      ease: ANIMATION_EASE.elastic,
    }
  );
};

// Stagger animations for multiple elements
export const staggerFadeIn = (elements: Element[] | NodeListOf<Element>, staggerDelay = 0.1) => {
  gsap.fromTo(
    elements,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: ANIMATION_DURATION.normal,
      stagger: staggerDelay,
      ease: ANIMATION_EASE.smooth,
    }
  );
};

export const staggerScaleIn = (elements: Element[] | NodeListOf<Element>, staggerDelay = 0.08) => {
  gsap.fromTo(
    elements,
    { opacity: 0, scale: 0.8, y: 20 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: ANIMATION_DURATION.normal,
      stagger: staggerDelay,
      ease: ANIMATION_EASE.back,
    }
  );
};

// Hover animations
export const hoverScale = (element: Element, scale = 1.05) => {
  gsap.to(element, {
    scale,
    duration: ANIMATION_DURATION.fast,
    ease: ANIMATION_EASE.smooth,
  });
};

export const hoverReset = (element: Element) => {
  gsap.to(element, {
    scale: 1,
    duration: ANIMATION_DURATION.fast,
    ease: ANIMATION_EASE.smooth,
  });
};

// Glass glow effect
export const glassGlow = (element: Element) => {
  gsap.to(element, {
    boxShadow: '0 0 30px rgba(139, 92, 246, 0.4), inset 0 0 20px rgba(139, 92, 246, 0.1)',
    duration: ANIMATION_DURATION.fast,
    ease: ANIMATION_EASE.smooth,
  });
};

export const glassGlowReset = (element: Element) => {
  gsap.to(element, {
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    duration: ANIMATION_DURATION.fast,
    ease: ANIMATION_EASE.smooth,
  });
};

// Scroll-triggered animations
export const setupScrollAnimations = () => {
  // Animate elements with data-animate attribute
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  animatedElements.forEach((element) => {
    const animationType = element.getAttribute('data-animate');
    const delay = parseFloat(element.getAttribute('data-delay') || '0');
    
    gsap.set(element, { opacity: 0 });
    
    ScrollTrigger.create({
      trigger: element,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        switch (animationType) {
          case 'fade-up':
            fadeInUp(element, delay);
            break;
          case 'fade-down':
            fadeInDown(element, delay);
            break;
          case 'fade-left':
            fadeInLeft(element, delay);
            break;
          case 'fade-right':
            fadeInRight(element, delay);
            break;
          case 'scale':
            scaleIn(element, delay);
            break;
          case 'pop':
            popIn(element, delay);
            break;
          default:
            fadeIn(element, delay);
        }
      },
    });
  });
};

// Parallax effect
export const createParallax = (element: Element, speed = 0.5) => {
  gsap.to(element, {
    yPercent: -30 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};

// Text reveal animation
export const textReveal = (element: Element, delay = 0) => {
  gsap.fromTo(
    element,
    { 
      opacity: 0, 
      y: 100,
      clipPath: 'inset(100% 0% 0% 0%)',
    },
    {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: ANIMATION_DURATION.slow,
      delay,
      ease: ANIMATION_EASE.expo,
    }
  );
};

// Magnetic effect (for buttons/cards)
export const createMagneticEffect = (element: HTMLElement) => {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(element, {
      x: x * 0.3,
      y: y * 0.3,
      duration: ANIMATION_DURATION.fast,
      ease: 'power2.out',
    });
  };
  
  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: ANIMATION_DURATION.normal,
      ease: ANIMATION_EASE.elastic,
    });
  };
  
  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);
  
  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

// Cursor follower
export const createCursorFollower = () => {
  const cursor = document.createElement('div');
  cursor.className = 'cursor-follower';
  cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.5);
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
    transform: translate(-50%, -50%);
  `;
  document.body.appendChild(cursor);
  
  const moveCursor = (e: MouseEvent) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.3,
      ease: 'power2.out',
    });
  };
  
  window.addEventListener('mousemove', moveCursor);
  
  return () => {
    window.removeEventListener('mousemove', moveCursor);
    cursor.remove();
  };
};

// Page transition
export const pageTransitionIn = () => {
  return gsap.fromTo(
    '.page-content',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: ANIMATION_DURATION.normal,
      ease: ANIMATION_EASE.smooth,
    }
  );
};

export const pageTransitionOut = () => {
  return gsap.to('.page-content', {
    opacity: 0,
    y: -30,
    duration: ANIMATION_DURATION.fast,
    ease: ANIMATION_EASE.smooth,
  });
};

// Liquid glass morphing effect
export const liquidGlassMorph = (element: Element) => {
  gsap.to(element, {
    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
};

// Number counter animation
export const animateCounter = (element: HTMLElement, endValue: number, duration = 2) => {
  const counter = { value: 0 };
  
  gsap.to(counter, {
    value: endValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = Math.round(counter.value).toLocaleString();
    },
  });
};

// Shimmer loading effect
export const createShimmer = (element: Element) => {
  gsap.fromTo(
    element,
    { backgroundPosition: '-200% 0' },
    {
      backgroundPosition: '200% 0',
      duration: 1.5,
      repeat: -1,
      ease: 'linear',
    }
  );
};
