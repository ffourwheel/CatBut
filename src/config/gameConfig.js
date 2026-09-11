export const DEFAULT_CONFIG = {
  canvasSize: 1024,
  holdDuration: 800,
  decayDuration: 1000,
  catIntervalMin: 4500,
  catIntervalMax: 6500,
  warningDuration: 700,
  peekDuration: 500,
  watchDuration: 800,
  hideDuration: 200,
  sabotageDuration: 500,
  sabotageCooldown: 3000,
  attackRecovery: 500,
  resumeSafeWindow: 500,
  startingHealth: 3,
  buttonCount: 4,
  buttonCountMin: 4,
  buttonCountMax: 8,
  watchProbability: 0.6,
  comboStart: 1,
  comboMax: 4,
  newActivationScore: 100,
  reactivationBaseScore: 50,
  reactivationStep: 10,
  reactivationFloor: 10,
  stageClearBonus: 1000,
  useRealAssets: true,
  debug: {
    forceCatEvent: null,
    disableRandomness: false,
    forceHealth: null,
    forceButtonCount: null,
  },
};

export function createGameConfig(overrides = {}) {
  return {
    ...DEFAULT_CONFIG,
    ...overrides,
    debug: {
      ...DEFAULT_CONFIG.debug,
      ...(overrides.debug ?? {}),
    },
  };
}
