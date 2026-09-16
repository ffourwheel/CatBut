import { CAT_STATES } from '../game/constants.js';

export const MOOD_CUE_FRAME_SIZE = 627;

export const MOOD_CUE_FRAMES = Object.freeze({
  sleepy: 0,
  curious: 1,
  annoyed: 2,
  angry: 3,
});

export const MOOD_CUE_LABELS = Object.freeze({
  sleepy: 'ง่วง',
  curious: 'สนใจ',
  annoyed: 'หงุดหงิด',
  angry: 'โมโห',
});

export const MOOD_CUE_ICONS = Object.freeze({
  sleepy: 'Z',
  curious: '?',
  annoyed: '!',
  angry: '怒',
});

export const MOOD_CUE_PRESENTATION = Object.freeze({
  sleepy: Object.freeze({
    frame: MOOD_CUE_FRAMES.sleepy,
    label: MOOD_CUE_LABELS.sleepy,
    icon: MOOD_CUE_ICONS.sleepy,
  }),
  curious: Object.freeze({
    frame: MOOD_CUE_FRAMES.curious,
    label: MOOD_CUE_LABELS.curious,
    icon: MOOD_CUE_ICONS.curious,
  }),
  annoyed: Object.freeze({
    frame: MOOD_CUE_FRAMES.annoyed,
    label: MOOD_CUE_LABELS.annoyed,
    icon: MOOD_CUE_ICONS.annoyed,
  }),
  angry: Object.freeze({
    frame: MOOD_CUE_FRAMES.angry,
    label: MOOD_CUE_LABELS.angry,
    icon: MOOD_CUE_ICONS.angry,
  }),
});

const HIDDEN_MOOD_CUE_STATES = new Set([
  CAT_STATES.SABOTAGE,
  CAT_STATES.HIDE,
]);

export function getMoodCue(level = 'sleepy') {
  const safeLevel = Object.hasOwn(MOOD_CUE_PRESENTATION, level) ? level : 'sleepy';
  const { frame, label } = MOOD_CUE_PRESENTATION[safeLevel];
  return { frame, label };
}

export function isMoodCueVisibleForCatState(state) {
  return !HIDDEN_MOOD_CUE_STATES.has(state);
}

export function shouldAnimateMoodCue(snapshot, currentLevel) {
  return Boolean(
    snapshot?.levelChanged
    && snapshot.level
    && snapshot.level !== currentLevel,
  );
}
