import assert from 'node:assert/strict';
import test from 'node:test';

import { BUTTON_SLOT_LAYOUT } from '../src/game/constants.js';
import {
  getAnimationTargetForSlot,
  solveTwoBoneIK,
} from '../src/game/CatRigIK.js';

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

test('2-Bone IK places the paw on a reachable target', () => {
  const solution = solveTwoBoneIK({
    shoulder: { x: 0, y: 0 },
    target: { x: 120, y: 80 },
    upperLength: 100,
    lowerLength: 100,
    bendDirection: 1,
  });

  assert.equal(solution.clamped, false);
  assert.ok(Math.abs(distance(solution.shoulder, solution.elbow) - 100) < 0.001);
  assert.ok(Math.abs(distance(solution.elbow, solution.paw) - 100) < 0.001);
  assert.ok(distance(solution.paw, { x: 120, y: 80 }) < 0.001);
});

test('2-Bone IK clamps a target beyond maximum reach', () => {
  const solution = solveTwoBoneIK({
    shoulder: { x: 0, y: 0 },
    target: { x: 400, y: 0 },
    upperLength: 100,
    lowerLength: 100,
  });

  assert.equal(solution.clamped, true);
  assert.ok(Math.abs(distance(solution.shoulder, solution.paw) - 200) < 0.001);
  assert.ok(Math.abs(solution.paw.x - 200) < 0.001);
  assert.ok(Math.abs(solution.paw.y) < 0.001);
});

test('2-Bone IK clamps a target inside minimum reach', () => {
  const solution = solveTwoBoneIK({
    shoulder: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    upperLength: 120,
    lowerLength: 80,
    bendDirection: -1,
  });

  assert.equal(solution.clamped, true);
  assert.ok(Math.abs(distance(solution.shoulder, solution.paw) - 40) < 0.001);
});

test('every Button Slot resolves to one Animation Target and Direction Pose', () => {
  BUTTON_SLOT_LAYOUT.forEach((slot) => {
    const target = getAnimationTargetForSlot(slot.id);
    assert.deepEqual(target.position, { x: slot.x, y: slot.y });
    assert.equal(target.angle, slot.angle);
    assert.equal(typeof target.directionPose, 'string');
  });
});
