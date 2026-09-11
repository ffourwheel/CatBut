export const CANVAS_SIZE = 1024;
export const TABLE_ANCHOR = { x: 512, y: 512 };

export const ASSEMBLY_DEPTH = {
  BACK: 10,
  FRONT: 30,
  MIDDLE: 20,
};

export const CAT_STATES = Object.freeze({
  HIDDEN: 'hidden',
  WARNING: 'warning',
  PEEK: 'peek',
  WATCH: 'watch',
  ATTACK: 'attack',
  SABOTAGE: 'sabotage',
  HIDE: 'hide',
});

export const CAT_EVENTS = Object.freeze({
  WATCH: 'watch',
  SABOTAGE: 'sabotage',
});

export const GAME_SCREENS = Object.freeze({
  START: 'start',
  TUTORIAL: 'tutorial',
  GAMEPLAY: 'gameplay',
  PAUSE: 'pause',
  STAGE_CLEAR: 'stage-clear',
  GAME_OVER: 'game-over',
});

// Mobile-first button slots are offsets from the cat/table center (512, 512).
// The three bands mirror the reference: top, side, and lower tabletop.
// All eight slots stay safely on the tabletop and avoid both outer rims and the center hole.
const BUTTON_OFFSETS = [
  { x: -255, y: -160 }, // Top-Left
  { x:  255, y: -160 }, // Top-Right
  { x: -325, y:    0 }, // Mid-Left
  { x:  325, y:    0 }, // Mid-Right
  { x: -285, y:  128 }, // Lower-Left
  { x:  285, y:  128 }, // Lower-Right
  { x: -175, y:  220 }, // Bottom-Left
  { x:  175, y:  220 }, // Bottom-Right
];

export const BUTTON_POSITIONS = BUTTON_OFFSETS.map(({ x, y }) => ({
  x: TABLE_ANCHOR.x + x,
  y: TABLE_ANCHOR.y + y,
}));
