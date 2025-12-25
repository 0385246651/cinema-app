"use client";

// Animation configurations
export const ANIMATION_DURATION = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  verySlow: 1.2,
};

export const ANIMATION_EASE = {
  smooth: "ease-out",
  elastic: "ease-in-out",
  bounce: "bounce",
  back: "back",
  expo: "expo",
};

// Dummy implementations to prevent errors and disable GSAP
export const fadeIn = (element: Element, delay = 0) => {};
export const fadeInUp = (element: Element, delay = 0) => {};
export const fadeInDown = (element: Element, delay = 0) => {};
export const fadeInLeft = (element: Element, delay = 0) => {};
export const fadeInRight = (element: Element, delay = 0) => {};
export const scaleIn = (element: Element, delay = 0) => {};
export const popIn = (element: Element, delay = 0) => {};

export const staggerFadeIn = (
  elements: Element[] | NodeListOf<Element>,
  staggerDelay = 0.1
) => {};
export const staggerScaleIn = (
  elements: Element[] | NodeListOf<Element>,
  staggerDelay = 0.08
) => {};

export const hoverScale = (element: Element, scale = 1.05) => {};
export const hoverReset = (element: Element) => {};
export const glassGlow = (element: Element) => {};
export const glassGlowReset = (element: Element) => {};

export const setupScrollAnimations = () => {};
export const createParallax = (element: Element, speed = 0.5) => {};
export const textReveal = (element: Element, delay = 0) => {};

export const createMagneticEffect = (element: HTMLElement) => {
  return () => {}; // Cleanup function
};

export const createCursorFollower = () => {
  return () => {}; // Cleanup function
};

export const pageTransitionIn = () => {
  return { then: (cb: any) => cb && cb() }; // Fake promise
};

export const pageTransitionOut = () => {
  return { then: (cb: any) => cb && cb() }; // Fake promise
};

export const liquidGlassMorph = (element: Element) => {};
export const animateCounter = (
  element: HTMLElement,
  endValue: number,
  duration = 2
) => {
  element.textContent = endValue.toLocaleString();
};
export const createShimmer = (element: Element) => {};
