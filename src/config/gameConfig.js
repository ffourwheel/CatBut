/**
 * Central game-tuning seam.
 *
 * Edit ACTIVE_GAME_PRESET or pass overrides through CATKUB_CONFIG to tune a
 * stage without changing CatController, ButtonManager, or ScoreManager.
 * Durations are milliseconds; probabilities use the 0..1 range.
 */

export const ACTIVE_GAME_PRESET = 'normal';

export const DEFAULT_CONFIG = Object.freeze({
  // World
  canvasSize: 1024,
  useRealAssets: true,

  // Player interaction
  holdDuration: 800,
  decayDuration: 1000,
  startingHealth: 3,
  buttonCount: 4,
  buttonCountMin: 4,
  buttonCountMax: 8,
  resumeSafeWindow: 500,

  // Cat timing and behaviour
  catIntervalMin: 5000,
  catIntervalMax: 5000,
  warningDuration: 700,
  peekDuration: 900,
  watchDuration: 1000,
  hideDuration: 200,
  sabotageDuration: 500,
  sabotageCooldown: 3000,
  attackRecovery: 500,
  watchProbability: 0.6,
  catWatchProbabilityAtMaxProgress: 0.35,
  catIntervalProgressScaleMin: 0.55,

  // Score and combo
  comboDuration: 5000,
  comboStart: 1,
  comboMax: 4,
  newActivationScore: 100,
  reactivationBaseScore: 50,
  reactivationStep: 10,
  reactivationFloor: 10,
  stageClearBonus: 0,

  // Development-only switches
  debug: Object.freeze({
    forceCatEvent: null,
    disableRandomness: false,
    forceHealth: null,
    forceButtonCount: null,
  }),
});

/**
 * Presets only contain values that differ from DEFAULT_CONFIG.
 * Add another preset here when a stage needs a different difficulty curve.
 */
export const GAME_PRESETS = Object.freeze({
  normal: Object.freeze({}),
  easy: Object.freeze({
    holdDuration: 650,
    decayDuration: 1400,
    catIntervalMin: 6500,
    catIntervalMax: 8000,
    warningDuration: 900,
    peekDuration: 1100,
    watchDuration: 700,
    watchProbability: 0.45,
    catWatchProbabilityAtMaxProgress: 0.2,
  }),
  hard: Object.freeze({
    holdDuration: 1000,
    decayDuration: 700,
    catIntervalMin: 3200,
    catIntervalMax: 4300,
    warningDuration: 500,
    peekDuration: 600,
    watchDuration: 1200,
    watchProbability: 0.72,
    catWatchProbabilityAtMaxProgress: 0.5,
    sabotageCooldown: 2200,
  }),
});

function numberOr(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, min, max, fallback) {
  return Math.min(max, Math.max(min, numberOr(value, fallback)));
}

function clampInt(value, min, max, fallback) {
  return Math.round(clamp(value, min, max, fallback));
}

function normalizeConfig(rawConfig) {
  const config = { ...rawConfig };

  config.canvasSize = clampInt(config.canvasSize, 512, 4096, DEFAULT_CONFIG.canvasSize);
  config.holdDuration = clampInt(config.holdDuration, 100, 10000, DEFAULT_CONFIG.holdDuration);
  config.decayDuration = clampInt(config.decayDuration, 100, 10000, DEFAULT_CONFIG.decayDuration);
  config.startingHealth = clampInt(config.startingHealth, 1, 3, DEFAULT_CONFIG.startingHealth);
  config.catIntervalMin = clampInt(config.catIntervalMin, 500, 60000, DEFAULT_CONFIG.catIntervalMin);
  config.catIntervalMax = Math.max(
    config.catIntervalMin,
    clampInt(config.catIntervalMax, config.catIntervalMin, 60000, DEFAULT_CONFIG.catIntervalMax),
  );
  config.warningDuration = clampInt(config.warningDuration, 100, 10000, DEFAULT_CONFIG.warningDuration);
  config.peekDuration = clampInt(config.peekDuration, 100, 10000, DEFAULT_CONFIG.peekDuration);
  config.watchDuration = clampInt(config.watchDuration, 100, 10000, DEFAULT_CONFIG.watchDuration);
  config.hideDuration = clampInt(config.hideDuration, 50, 10000, DEFAULT_CONFIG.hideDuration);
  config.sabotageDuration = clampInt(config.sabotageDuration, 100, 10000, DEFAULT_CONFIG.sabotageDuration);
  config.sabotageCooldown = clampInt(config.sabotageCooldown, 0, 60000, DEFAULT_CONFIG.sabotageCooldown);
  config.attackRecovery = clampInt(config.attackRecovery, 0, 10000, DEFAULT_CONFIG.attackRecovery);
  config.resumeSafeWindow = clampInt(config.resumeSafeWindow, 0, 10000, DEFAULT_CONFIG.resumeSafeWindow);
  config.comboDuration = clampInt(config.comboDuration, 500, 60000, DEFAULT_CONFIG.comboDuration);
  config.comboStart = clampInt(config.comboStart, 1, 4, DEFAULT_CONFIG.comboStart);
  config.comboMax = clampInt(config.comboMax, config.comboStart, 4, DEFAULT_CONFIG.comboMax);
  config.watchProbability = clamp(config.watchProbability, 0, 1, DEFAULT_CONFIG.watchProbability);
  config.catWatchProbabilityAtMaxProgress = clamp(
    config.catWatchProbabilityAtMaxProgress,
    0,
    config.watchProbability,
    DEFAULT_CONFIG.catWatchProbabilityAtMaxProgress,
  );
  config.catIntervalProgressScaleMin = clamp(
    config.catIntervalProgressScaleMin,
    0.1,
    1,
    DEFAULT_CONFIG.catIntervalProgressScaleMin,
  );
  config.buttonCountMin = clampInt(config.buttonCountMin, 1, 8, DEFAULT_CONFIG.buttonCountMin);
  config.buttonCountMax = clampInt(
    config.buttonCountMax,
    config.buttonCountMin,
    8,
    DEFAULT_CONFIG.buttonCountMax,
  );
  config.buttonCount = clampInt(
    config.buttonCount,
    config.buttonCountMin,
    config.buttonCountMax,
    DEFAULT_CONFIG.buttonCount,
  );
  config.newActivationScore = clampInt(config.newActivationScore, 0, 100000, DEFAULT_CONFIG.newActivationScore);
  config.reactivationBaseScore = clampInt(config.reactivationBaseScore, 0, 100000, DEFAULT_CONFIG.reactivationBaseScore);
  config.reactivationStep = clampInt(config.reactivationStep, 0, 100000, DEFAULT_CONFIG.reactivationStep);
  config.reactivationFloor = clampInt(config.reactivationFloor, 0, config.reactivationBaseScore, DEFAULT_CONFIG.reactivationFloor);
  config.stageClearBonus = clampInt(config.stageClearBonus, 0, 1000000, DEFAULT_CONFIG.stageClearBonus);
  config.useRealAssets = config.useRealAssets !== false;

  config.debug = Object.freeze({
    ...DEFAULT_CONFIG.debug,
    ...(config.debug ?? {}),
  });

  return Object.freeze(config);
}

export function createGameConfig(overrides = {}) {
  const safeOverrides = overrides && typeof overrides === 'object' ? overrides : {};
  const requestedPreset = safeOverrides.preset ?? ACTIVE_GAME_PRESET;
  const presetName = Object.hasOwn(GAME_PRESETS, requestedPreset)
    ? requestedPreset
    : ACTIVE_GAME_PRESET;
  const { preset: _preset, debug = {}, ...directOverrides } = safeOverrides;

  return normalizeConfig({
    ...DEFAULT_CONFIG,
    ...GAME_PRESETS[presetName],
    ...directOverrides,
    debug: {
      ...DEFAULT_CONFIG.debug,
      ...(GAME_PRESETS[presetName].debug ?? {}),
      ...(debug ?? {}),
    },
  });
}

/**
 * Reads the optional runtime override without making the game depend on a
 * browser-only global. Examples:
 *   window.CATKUB_CONFIG = { preset: 'easy', watchDuration: 500 };
 *   /?preset=hard
 */
export function getRuntimeGameConfig(fallbackOverrides = {}) {
  const queryPreset = typeof globalThis.location?.search === 'string'
    ? new URLSearchParams(globalThis.location.search).get('preset')
    : null;
  const runtimeOverrides = globalThis.CATKUB_CONFIG && typeof globalThis.CATKUB_CONFIG === 'object'
    ? globalThis.CATKUB_CONFIG
    : {};

  return createGameConfig({
    ...fallbackOverrides,
    ...(queryPreset ? { preset: queryPreset } : {}),
    ...runtimeOverrides,
  });
}
