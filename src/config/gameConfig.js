import { BUTTON_SLOT_PRESETS } from '../game/constants.js';

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
  // Keep the code-drawn Cat Rig as the visual default while motion is tuned.
  // Set false to preview the production raster rig when it is ready.
  useVectorCat: true,

  // Player interaction
  startingHealth: 3,
  // Every stage uses the complete ring so the player can learn one stable layout.
  buttonCount: 8,
  buttonSetPresets: BUTTON_SLOT_PRESETS,
  resumeSafeWindow: 500,

  // Cat timing and behaviour
  catIntervalMin: 500,
  catIntervalMax: 850,
  warningDuration: 350,
  peekDuration: 400,
  watchDuration: 1000,
  hideDuration: 220,
  sabotagePreviewDuration: 160,
  sabotageDuration: 500,
  sabotageReachDuration: 120,
  sabotageHitDuration: 80,
  sabotageCooldown: 800,
  attackRecovery: 500,
  watchProbability: 0.6,
  tapReactionProbability: 0.4,
  rapidTapThreshold: 2,
  rapidTapWindow: 500,
  catWatchProbabilityAtMaxProgress: 0.35,
  catIntervalProgressScaleMin: 0.45,
  catEventMinimumGap: 500,

  // Cat Mood: only Rapid Tap raises the cat's mood. Pausing lets it calm down in steps.
  moodMax: 100,
  moodRapidTapGain: 50,
  moodDecayDelay: 2000,
  moodLevelDecayInterval: 1500,
  moodIntervalScaleByLevel: Object.freeze({
    sleepy: 1,
    curious: 0.85,
    annoyed: 0.7,
    angry: 0.55,
  }),

  // Score and combo
  comboDuration: 2000,
  comboStart: 1,
  comboMax: 4,
  newActivationScore: 10,
  reactivationBaseScore: 5,
  reactivationStep: 1,
  reactivationFloor: 1,
  stageClearBonus: 0,

  // Development-only switches
  debug: Object.freeze({
    forceCatEvent: null,
    disableRandomness: false,
    forceHealth: null,
    forceButtonCount: null,
    forceButtonSet: null,
    forceSabotageSlot: null,
  }),
});

/**
 * Presets only contain values that differ from DEFAULT_CONFIG.
 * Add another preset here when a stage needs a different difficulty curve.
 */
export const GAME_PRESETS = Object.freeze({
  normal: Object.freeze({}),
  easy: Object.freeze({
    catIntervalMin: 2200,
    catIntervalMax: 3800,
    warningDuration: 900,
    peekDuration: 1100,
    watchDuration: 700,
    watchProbability: 0.45,
    catWatchProbabilityAtMaxProgress: 0.2,
  }),
  hard: Object.freeze({
    catIntervalMin: 500,
    catIntervalMax: 700,
    warningDuration: 300,
    peekDuration: 350,
    watchDuration: 1000,
    watchProbability: 0.7,
    catWatchProbabilityAtMaxProgress: 0.55,
    buttonCount: 8,
    sabotageCooldown: 900,
    sabotagePreviewDuration: 120,
    sabotageReachDuration: 100,
    sabotageHitDuration: 70,
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
  config.sabotagePreviewDuration = clampInt(
    config.sabotagePreviewDuration,
    50,
    10000,
    DEFAULT_CONFIG.sabotagePreviewDuration,
  );
  config.sabotageDuration = clampInt(config.sabotageDuration, 100, 10000, DEFAULT_CONFIG.sabotageDuration);
  config.sabotageReachDuration = clampInt(
    config.sabotageReachDuration,
    100,
    10000,
    DEFAULT_CONFIG.sabotageReachDuration,
  );
  config.sabotageHitDuration = clampInt(
    config.sabotageHitDuration,
    50,
    Math.min(config.sabotageReachDuration, Math.max(50, config.sabotageDuration - 10)),
    DEFAULT_CONFIG.sabotageHitDuration,
  );
  config.sabotageCooldown = clampInt(config.sabotageCooldown, 0, 60000, DEFAULT_CONFIG.sabotageCooldown);
  config.attackRecovery = clampInt(config.attackRecovery, 0, 10000, DEFAULT_CONFIG.attackRecovery);
  config.resumeSafeWindow = clampInt(config.resumeSafeWindow, 0, 10000, DEFAULT_CONFIG.resumeSafeWindow);
  config.comboDuration = clampInt(config.comboDuration, 500, 60000, DEFAULT_CONFIG.comboDuration);
  config.comboStart = clampInt(config.comboStart, 1, 4, DEFAULT_CONFIG.comboStart);
  config.comboMax = clampInt(config.comboMax, config.comboStart, 4, DEFAULT_CONFIG.comboMax);
  config.watchProbability = clamp(config.watchProbability, 0, 1, DEFAULT_CONFIG.watchProbability);
  config.tapReactionProbability = clamp(
    config.tapReactionProbability,
    0,
    1,
    DEFAULT_CONFIG.tapReactionProbability,
  );
  config.rapidTapThreshold = clampInt(config.rapidTapThreshold, 2, 8, DEFAULT_CONFIG.rapidTapThreshold);
  config.rapidTapWindow = clampInt(config.rapidTapWindow, 150, 2000, DEFAULT_CONFIG.rapidTapWindow);
  config.catEventMinimumGap = clampInt(
    config.catEventMinimumGap,
    0,
    10000,
    DEFAULT_CONFIG.catEventMinimumGap,
  );
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
  config.moodMax = clampInt(config.moodMax, 100, 100, DEFAULT_CONFIG.moodMax);
  config.moodRapidTapGain = clamp(config.moodRapidTapGain, 0, config.moodMax, DEFAULT_CONFIG.moodRapidTapGain);
  config.moodDecayDelay = clampInt(config.moodDecayDelay, 0, 10000, DEFAULT_CONFIG.moodDecayDelay);
  config.moodLevelDecayInterval = clampInt(
    config.moodLevelDecayInterval,
    100,
    10000,
    DEFAULT_CONFIG.moodLevelDecayInterval,
  );
  const moodScales = config.moodIntervalScaleByLevel ?? {};
  config.moodIntervalScaleByLevel = Object.freeze({
    sleepy: clamp(moodScales.sleepy, 0.25, 1, DEFAULT_CONFIG.moodIntervalScaleByLevel.sleepy),
    curious: clamp(moodScales.curious, 0.25, 1, DEFAULT_CONFIG.moodIntervalScaleByLevel.curious),
    annoyed: clamp(moodScales.annoyed, 0.25, 1, DEFAULT_CONFIG.moodIntervalScaleByLevel.annoyed),
    angry: clamp(moodScales.angry, 0.25, 1, DEFAULT_CONFIG.moodIntervalScaleByLevel.angry),
  });
  config.buttonCount = clampInt(config.buttonCount, 1, 8, DEFAULT_CONFIG.buttonCount);
  config.newActivationScore = clampInt(config.newActivationScore, 0, 100000, DEFAULT_CONFIG.newActivationScore);
  config.reactivationBaseScore = clampInt(config.reactivationBaseScore, 0, 100000, DEFAULT_CONFIG.reactivationBaseScore);
  config.reactivationStep = clampInt(config.reactivationStep, 0, 100000, DEFAULT_CONFIG.reactivationStep);
  config.reactivationFloor = clampInt(config.reactivationFloor, 0, config.reactivationBaseScore, DEFAULT_CONFIG.reactivationFloor);
  config.stageClearBonus = clampInt(config.stageClearBonus, 0, 1000000, DEFAULT_CONFIG.stageClearBonus);
  config.useRealAssets = config.useRealAssets !== false;
  config.useVectorCat = config.useVectorCat !== false;

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
