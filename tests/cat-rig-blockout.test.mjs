import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CAT_RIG_BLOCKOUT_PARTS,
  createCatRigBlockoutPose,
} from '../src/game/CatRig.js';

test('Cat Rig blockout exposes the hole anchor and stable parent pivots', () => {
  const rig = createCatRigBlockoutPose();

  assert.deepEqual(rig.anchor, { x: 512, y: 452 });
  assert.deepEqual(
    CAT_RIG_BLOCKOUT_PARTS.map(({ id }) => id),
    ['catRoot', 'shadow', 'body', 'head', 'leftEar', 'rightEar', 'leftUpperArm', 'leftForearm', 'leftPaw', 'rightUpperArm', 'rightForearm', 'rightPaw', 'eyes'],
  );
  assert.equal(rig.getPart('head').parentId, 'body');
  assert.equal(rig.getPart('leftForearm').parentId, 'leftUpperArm');
  assert.equal(rig.getPart('leftPaw').parentId, 'leftForearm');
  assert.deepEqual(rig.getPart('head').pivot, { x: 0, y: 0 });
});

test('Cat Rig blockout resetPose returns every part to its authored pose', () => {
  const rig = createCatRigBlockoutPose();
  const initial = rig.snapshot();

  rig.setLocalTransform('head', { rotation: 0.35, x: 18 });
  rig.setLocalTransform('leftPaw', { rotation: -0.4, y: 24 });
  assert.notDeepEqual(rig.snapshot(), initial);

  rig.resetPose();
  assert.deepEqual(rig.snapshot(), initial);
});
