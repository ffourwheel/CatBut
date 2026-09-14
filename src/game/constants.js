export const CANVAS_SIZE = 1024;
export const TABLE_ANCHOR = { x: 512, y: 512 };

export const ASSEMBLY_DEPTH = {
  BACK: 10,
  FRONT: 15,
  MIDDLE: 30,
  BUTTONS: 40,
  FOREGROUND: 50,
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

// Slots follow the tabletop curve in four mirrored rows around the cat.
// The inner lower rows keep the buttons visually grouped around the hole
// instead of forcing every slot onto one oversized ellipse.
const BUTTON_OFFSETS = Object.freeze([
  { x: -235, y: -175 }, // Top-Left
  { x: 235, y: -175 },  // Top-Right
  { x: -315, y: -35 },  // Mid-Left
  { x: 315, y: -35 },   // Mid-Right
  { x: -275, y: 110 },  // Lower-Left
  { x: 275, y: 110 },   // Lower-Right
  { x: -190, y: 205 },  // Bottom-Left
  { x: 190, y: 205 },   // Bottom-Right
]);

export const BUTTON_POSITIONS = BUTTON_OFFSETS.map(({ x, y }) => ({
  x: TABLE_ANCHOR.x + x,
  y: TABLE_ANCHOR.y + y,
}));
