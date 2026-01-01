export const autoplayTiming = {
  desktop: 5000,
  mobile: 6000,
};

export const breakpoints = {
  md: 768,
};

export const slideVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 40 : -40,
  }),
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -40 : 40,
  }),
};

export const animationConfig = {
  duration: 0.7,
  ease: [0.4, 0, 0.2, 1] as const,
};
