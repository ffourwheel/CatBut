function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function createSabotageReachPlan({
  origin = { x: 0, y: 0 },
  target = { x: 0, y: 0 },
  pawReach,
  minScale = 0.3,
  maxScale = 0.58,
  defaultAngle = 0,
} = {}) {
  const targetX = target.x - origin.x;
  const targetY = target.y - origin.y;
  const distance = Math.hypot(targetX, targetY);
  const targetAngle = Math.atan2(targetY, targetX);
  const targetScale = clamp(distance / Math.max(1, pawReach), minScale, maxScale);

  return Object.freeze({
    targetX,
    targetY,
    distance,
    targetAngle,
    rotation: targetAngle - defaultAngle,
    targetScale,
  });
}

export function sampleReachSquash(progress, {
  start = 0.72,
  maxScaleX = 1.05,
  minScaleY = 0.92,
} = {}) {
  const normalized = clamp((progress - start) / Math.max(0.0001, 1 - start), 0, 1);
  const impulse = Math.sin(normalized * Math.PI);

  return {
    scaleX: 1 + (maxScaleX - 1) * impulse,
    scaleY: 1 - (1 - minScaleY) * impulse,
  };
}
