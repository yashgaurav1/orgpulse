import { enterpriseTokens } from './design-tokens';

/**
 * Enterprise Motion Config (Framer Motion)
 * Fast, functional, never decorative.
 */

export const enterpriseTransition = {
  ui: {
    duration: 0.18,
    ease: enterpriseTokens.motion.easing,
  },
  panel: {
    duration: 0.28,
    ease: enterpriseTokens.motion.easing,
  },
  toast: {
    type: 'spring',
    stiffness: 400,
    damping: 28,
  },
  fadeShift: {
    duration: 0.18,
    ease: enterpriseTokens.motion.easing,
  },
};

export const drawerVariants = {
  closed: {
    x: '100%',
    opacity: 0,
    transition: enterpriseTransition.panel,
  },
  open: {
    x: 0,
    opacity: 1,
    transition: enterpriseTransition.panel,
  },
};

export const modalVariants = {
  closed: {
    opacity: 0,
    scale: 0.98,
    transition: enterpriseTransition.ui,
  },
  open: {
    opacity: 1,
    scale: 1,
    transition: enterpriseTransition.ui,
  },
};

export const backdropVariants = {
  closed: {
    opacity: 0,
    transition: enterpriseTransition.ui,
  },
  open: {
    opacity: 1,
    transition: enterpriseTransition.ui,
  },
};

export const tableRowVariants = {
  hidden: {
    opacity: 0,
    y: 4,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * enterpriseTokens.motion.staggerRow,
      duration: 0.15,
      ease: enterpriseTokens.motion.easing,
    },
  }),
};

export const sidebarVariants = {
  expanded: {
    width: 240,
    transition: enterpriseTransition.ui,
  },
  collapsed: {
    width: 60,
    transition: enterpriseTransition.ui,
  },
};

export const routeFadeShiftVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: enterpriseTransition.fadeShift,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: enterpriseTransition.fadeShift,
  },
};
