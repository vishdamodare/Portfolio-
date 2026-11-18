// Motion tokens. Every animation in the app pulls from here.
export const ease = {
  reveal: [0.22, 1, 0.36, 1] as const,
  page: [0.7, 0, 0.2, 1] as const,
};

export const springCfg = { stiffness: 120, damping: 20 };
export const spring = { type: "spring", ...springCfg } as const;

export const dur = {
  micro: 0.2,
  ui: 0.5,
  reveal: 0.9,
  hero: 1.6,
};

export const stagger = {
  char: 0.04,
  block: 0.08,
};

