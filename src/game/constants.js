export const CANVAS_SIZE = 1024;
export const TABLE_ANCHOR = { x: 512, y: 512 };

export const ASSEMBLY_DEPTH = {
  BACK: 10,
  MIDDLE: 20,
  FRONT: 30,
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

export const BUTTON_POSITIONS = [
  { x: 300, y: 300 },
  { x: 724, y: 300 },
  { x: 300, y: 724 },
  { x: 724, y: 724 },
];
