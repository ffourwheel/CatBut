import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CAT_DIRECTION_POSE_NAMES,
  getDirectionPoseDefinition,
  getDirectionPoseForAngle,
  getDirectionPoseForSlot,
} from '../src/game/CatDirectionPose.js';
import { createCatAnimation } from '../src/game/CatAnimation.js';
import { createCatRigBlockoutPose } from '../src/game/CatRig.js';

test('eight Button Slots map to stable Direction Poses', () => {
  assert.deepEqual(CAT_DIRECTION_POSE_NAMES, [
    'right',
    'downRight',
    'down',
    'downLeft',
    'left',
    'upLeft',
    'up',
    'upRight',
  ]);

  assert.deepEqual(
    ['slot-1', 'slot-2', 'slot-3', 'slot-4', 'slot-5', 'slot-6', 'slot-7', 'slot-8']
      .map(getDirectionPoseForSlot),
    ['upLeft', 'upRight', 'left', 'right', 'downLeft', 'downRight', 'up', 'down'],
  );
});

test('Direction Pose angle mapping normalizes to the nearest 45-degree direction', () => {
  assert.equal(getDirectionPoseForAngle(360), 'right');
  assert.equal(getDirectionPoseForAngle(-45), 'upRight');
  assert.equal(getDirectionPoseForAngle(91), 'down');
  assert.equal(getDirectionPoseForAngle(224), 'upLeft');
});

test('Direction Pose avoids a full 180-degree flip and exposes face offsets', () => {
  const left = getDirectionPoseDefinition('left');
  const right = getDirectionPoseDefinition('right');

  assert.ok(Math.abs(left.offsets.head.rotation) < Math.PI / 2);
  assert.ok(Math.abs(right.offsets.head.rotation) < Math.PI / 2);
  assert.ok(left.offsets.eyes.x < 0);
  assert.ok(right.offsets.eyes.x > 0);
});

test('Cat Animation blends between Direction Poses without a pose pop', () => {
  const rig = createCatRigBlockoutPose();
  const animation = createCatAnimation({ rig });

  animation.faceTo('right', { blendMs: 0 });
  assert.equal(rig.getPart('head').local.rotation, 0.08);

  const state = animation.faceTo('left', { blendMs: 100 });
  assert.equal(state.directionPose, 'left');
  assert.equal(state.directionTransitioning, true);

  animation.update(50);
  assert.ok(Math.abs(rig.getPart('head').local.rotation) < 0.001);
  animation.update(50);
  assert.equal(animation.getState().directionTransitioning, false);
  assert.equal(rig.getPart('head').local.rotation, -0.08);
});

test('Cat Animation can face a Button Slot while a Motion Clip is active', () => {
  const rig = createCatRigBlockoutPose();
  const animation = createCatAnimation({ rig });

  animation.play('watch', { blendMs: 0 });
  animation.faceTo('slot-1', { blendMs: 0 });
  animation.update(350);

  assert.equal(animation.getState().directionPose, 'upLeft');
  assert.notEqual(rig.getPart('head').local.rotation, 0);
  assert.ok(rig.getPart('eyes').local.x < 0);
});
