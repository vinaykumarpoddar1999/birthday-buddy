export const DURATION = {
  micro: 200,
  fast: 300,
  normal: 400,
  entrance: 600,
  slow: 800,
  entranceLong: 1200,
} as const;

export const SPRING = {
  micro: { damping: 18, stiffness: 400, mass: 0.6 },
  default: { damping: 16, stiffness: 280, mass: 0.8 },
  gentle: { damping: 14, stiffness: 200, mass: 1 },
  bouncy: { damping: 12, stiffness: 320, mass: 0.7 },
} as const;

export const SCALE = {
  press: 0.97,
  pressSubtle: 0.98,
  entrance: 0.92,
} as const;
