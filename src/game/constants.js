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
  { x: -280, y: -175 }, // Top-Left
  { x: 280, y: -175 },  // Top-Right
  { x: -345, y: -35 },  // Mid-Left
  { x: 345, y: -35 },   // Mid-Right
  { x: -310, y: 110 },  // Lower-Left
  { x: 310, y: 110 },   // Lower-Right
  { x: -225, y: 205 },  // Bottom-Left
  { x: 225, y: 205 },   // Bottom-Right
]);

export const BUTTON_POSITIONS = BUTTON_OFFSETS.map(({ x, y }) => ({
  x: TABLE_ANCHOR.x + x,
  y: TABLE_ANCHOR.y + y,
}));

export const BUTTON_SLOT_IDS = Object.freeze(
  BUTTON_POSITIONS.map((_, index) => `slot-${index + 1}`),
);

export const BUTTON_SLOT_LAYOUT = Object.freeze(
  BUTTON_POSITIONS.map((position, index) => ({
    id: BUTTON_SLOT_IDS[index],
    ...position,
  })),
);

// Presets keep mirrored pairs together for even counts. Odd counts are
// authored explicitly so a stage never changes button positions unexpectedly.
export const BUTTON_SLOT_PRESETS = Object.freeze({
  4: Object.freeze(['slot-1', 'slot-2', 'slot-3', 'slot-4']),
  5: Object.freeze(['slot-1', 'slot-2', 'slot-3', 'slot-4', 'slot-7']),
  6: Object.freeze(['slot-1', 'slot-2', 'slot-3', 'slot-4', 'slot-7', 'slot-8']),
  7: Object.freeze(['slot-1', 'slot-2', 'slot-3', 'slot-4', 'slot-5', 'slot-7', 'slot-8']),
  8: BUTTON_SLOT_IDS,
});

// The generated sabotage paw points down-right by default. The runtime
// rotates only this overlay; the table, hole, and cat body stay anchored.
export const SABOTAGE_PAW_DEFAULT_ANGLE = 0.64;
// Measured from the generated 1254px paw asset's attachment point
// (368, 424) to the paw tip (1084, 1032).
export const SABOTAGE_PAW_REACH = Math.hypot(1084 - 368, 1032 - 424);
export const SABOTAGE_PAW_ORIGIN = Object.freeze({ x: 368 / 1254, y: 424 / 1254 });
