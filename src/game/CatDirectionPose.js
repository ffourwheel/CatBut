import { BUTTON_SLOT_LAYOUT } from './constants.js';

const ANGLE_TO_POSE = Object.freeze({
  0: 'right',
  45: 'downRight',
  90: 'down',
  135: 'downLeft',
  180: 'left',
  225: 'upLeft',
  270: 'up',
  315: 'upRight',
});

const pose = (name, angle, offsets) => Object.freeze({
  name,
  angle,
  offsets: Object.freeze(
    Object.fromEntries(
      Object.entries(offsets).map(([partId, transform]) => [partId, Object.freeze({ ...transform })]),
    ),
  ),
});

export const CAT_DIRECTION_POSES = Object.freeze({
  right: pose('right', 0, {
    head: { rotation: 0.08 },
    eyes: { x: 8 },
    leftEar: { rotation: -0.03 },
    rightEar: { rotation: 0.03 },
  }),
  downRight: pose('downRight', 45, {
    head: { x: 3, y: 4, rotation: 0.12 },
    eyes: { x: 7, y: 4 },
    leftEar: { rotation: -0.04 },
    rightEar: { rotation: 0.06 },
  }),
  down: pose('down', 90, {}),
  downLeft: pose('downLeft', 135, {
    head: { x: -3, y: 4, rotation: -0.12 },
    eyes: { x: -7, y: 4 },
    leftEar: { rotation: -0.06 },
    rightEar: { rotation: 0.04 },
  }),
  left: pose('left', 180, {
    head: { rotation: -0.08 },
    eyes: { x: -8 },
    leftEar: { rotation: -0.03 },
    rightEar: { rotation: 0.03 },
  }),
  upLeft: pose('upLeft', 225, {
    head: { x: -3, y: -4, rotation: -0.12 },
    eyes: { x: -7, y: -4 },
    leftEar: { rotation: -0.04 },
    rightEar: { rotation: 0.06 },
  }),
  up: pose('up', 270, {
    head: { y: -5 },
    eyes: { y: -5 },
    leftEar: { rotation: 0.02 },
    rightEar: { rotation: -0.02 },
  }),
  upRight: pose('upRight', 315, {
    head: { x: 3, y: -4, rotation: 0.12 },
    eyes: { x: 7, y: -4 },
    leftEar: { rotation: -0.06 },
    rightEar: { rotation: 0.04 },
  }),
});

export const CAT_DIRECTION_POSE_NAMES = Object.freeze(Object.keys(CAT_DIRECTION_POSES));

function normalizeAngle(angle) {
  const normalized = ((Number(angle) || 0) % 360 + 360) % 360;
  return Math.round(normalized / 45) * 45 % 360;
}

export function getDirectionPoseForAngle(angle) {
  return ANGLE_TO_POSE[normalizeAngle(angle)];
}

const POSE_BY_SLOT = new Map(
  BUTTON_SLOT_LAYOUT.map((slot) => [slot.id, getDirectionPoseForAngle(slot.angle)]),
);

export function getDirectionPoseForSlot(slotId) {
  return POSE_BY_SLOT.get(slotId) ?? null;
}

export function getDirectionPoseDefinition(name) {
  const definition = CAT_DIRECTION_POSES[name];
  if (!definition) return null;
  return {
    name: definition.name,
    angle: definition.angle,
    offsets: Object.fromEntries(
      Object.entries(definition.offsets).map(([partId, transform]) => [partId, { ...transform }]),
    ),
  };
}
