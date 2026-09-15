import { BUTTON_SLOT_LAYOUT } from './constants.js';
import { getDirectionPoseForAngle } from './CatDirectionPose.js';

const EPSILON = 0.000001;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function pointOnRay(origin, angle, distance) {
  return {
    x: origin.x + Math.cos(angle) * distance,
    y: origin.y + Math.sin(angle) * distance,
  };
}

function copyPoint(point) {
  return { x: point.x, y: point.y };
}

/**
 * Solves a planar two-bone chain using the shoulder and target as the public
 * seam. Angles use the screen coordinate convention: +x is right and +y is
 * down. The elbow bend is selected with bendDirection (+1 or -1).
 */
export function solveTwoBoneIK({
  shoulder,
  target,
  upperLength,
  lowerLength,
  bendDirection = 1,
  minReach = Math.abs(upperLength - lowerLength),
  maxReach = upperLength + lowerLength,
}) {
  const upper = Math.max(EPSILON, Number(upperLength) || 0);
  const lower = Math.max(EPSILON, Number(lowerLength) || 0);
  const safeMinReach = clamp(Math.max(0, Number(minReach) || 0), 0, upper + lower);
  const safeMaxReach = clamp(Number(maxReach) || upper + lower, safeMinReach, upper + lower);
  const dx = target.x - shoulder.x;
  const dy = target.y - shoulder.y;
  const rawDistance = Math.hypot(dx, dy);
  const distance = clamp(rawDistance, safeMinReach, safeMaxReach);
  const targetAngle = rawDistance > EPSILON ? Math.atan2(dy, dx) : 0;
  const clampedTarget = pointOnRay(shoulder, targetAngle, distance);
  const side = bendDirection < 0 ? -1 : 1;
  const shoulderCosine = clamp(
    (upper * upper + distance * distance - lower * lower) / (2 * upper * Math.max(distance, EPSILON)),
    -1,
    1,
  );
  const shoulderAngle = targetAngle + side * Math.acos(shoulderCosine);
  const elbow = pointOnRay(shoulder, shoulderAngle, upper);
  const forearmAngle = Math.atan2(clampedTarget.y - elbow.y, clampedTarget.x - elbow.x);

  return {
    shoulder: copyPoint(shoulder),
    elbow,
    paw: clampedTarget,
    target: copyPoint(target),
    distance,
    upperAngle: shoulderAngle,
    forearmAngle,
    clamped: Math.abs(rawDistance - distance) > EPSILON,
  };
}

const ANIMATION_TARGETS = BUTTON_SLOT_LAYOUT.map((slot) => Object.freeze({
  slotId: slot.id,
  position: Object.freeze({ x: slot.x, y: slot.y }),
  angle: slot.angle,
  directionPose: getDirectionPoseForAngle(slot.angle),
}));

const ANIMATION_TARGET_BY_SLOT = new Map(
  ANIMATION_TARGETS.map((target) => [target.slotId, target]),
);

export const CAT_ANIMATION_TARGETS = Object.freeze(ANIMATION_TARGETS);

export function getAnimationTargetForSlot(slotId) {
  const target = ANIMATION_TARGET_BY_SLOT.get(slotId);
  if (!target) return null;
  return {
    slotId: target.slotId,
    position: { ...target.position },
    angle: target.angle,
    directionPose: target.directionPose,
  };
}
