export const CANVAS_SIZE = 1024;
export const TABLE_ASSEMBLY_ANCHOR = Object.freeze({ x: 512, y: 512 });
export const TABLE_HOLE_OFFSET_Y = -60;
export const HOLE_CAT_OFFSET_Y = -20;
export const HOLE_CAT_SCALE = 1.15;
export const TABLE_LAYER_GAP_Y = 185;
export const TABLE_BACK_OFFSET_Y = -155;
export const TABLE_FRONT_OFFSET_Y = TABLE_LAYER_GAP_Y;
export const TABLE_ANCHOR = Object.freeze({
  x: TABLE_ASSEMBLY_ANCHOR.x,
  y: TABLE_ASSEMBLY_ANCHOR.y + TABLE_HOLE_OFFSET_Y,
});

export const ASSEMBLY_DEPTH = {
  BACK: 10,
  MIDDLE: 20,
  FRONT: 30,
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

// Button Slots form one fixed ring around the hole. The order preserves the
// existing mirrored preset pairs while the geometry uses all eight 45-degree
// directions required by the Cat Rig and Direction Pose mapping.
export const BUTTON_RING_RADIUS = 300;
export const BUTTON_SLOT_ANGLES_DEGREES = Object.freeze([
  225, // slot-1: upper-left
  315, // slot-2: upper-right
  180, // slot-3: left
  0,   // slot-4: right
  135, // slot-5: lower-left
  45,  // slot-6: lower-right
  270, // slot-7: top
  90,  // slot-8: bottom
]);

const BUTTON_OFFSETS = Object.freeze(
  BUTTON_SLOT_ANGLES_DEGREES.map((angle) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: Math.round(Math.cos(radians) * BUTTON_RING_RADIUS * 1000) / 1000,
      y: Math.round(Math.sin(radians) * BUTTON_RING_RADIUS * 1000) / 1000,
      angle,
    };
  }),
);

export const BUTTON_POSITIONS = BUTTON_OFFSETS.map(({ x, y, angle }) => ({
  x: TABLE_ANCHOR.x + x,
  y: TABLE_ANCHOR.y + y,
  angle,
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
