import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CAT_MOTION_CLIPS,
  CAT_MOTION_CLIP_NAMES,
} from '../src/game/CatAnimationConfig.js';
import { createCatAnimation } from '../src/game/CatAnimation.js';
import { createCatRigBlockoutPose } from '../src/game/CatRig.js';

function createAnimation() {
  const rig = createCatRigBlockoutPose();
  return { rig, animation: createCatAnimation({ rig }) };
}

test('Motion Clip config exposes the five foundational clips', () => {
  assert.deepEqual(CAT_MOTION_CLIP_NAMES, ['idle', 'peek', 'watch', 'hide', 'attack']);
  CAT_MOTION_CLIP_NAMES.forEach((name) => {
    assert.ok(CAT_MOTION_CLIPS[name].duration > 0);
    assert.ok(Object.keys(CAT_MOTION_CLIPS[name].tracks).length > 0);
  });
});

test('Idle loops with continuous motion and does not accumulate offsets', () => {
  const { rig, animation } = createAnimation();
  const initial = rig.snapshot();

  animation.play('idle', { blendMs: 0 });
  animation.update(450);
  assert.notDeepEqual(rig.snapshot(), initial);

  animation.update(1350);
  assert.deepEqual(rig.snapshot(), initial);
  assert.equal(animation.getState().activeClip, 'idle');
});

test('Peek and Attack finish at authored pose while Hide finishes below the hole', () => {
  const { rig, animation } = createAnimation();
  const initial = rig.snapshot();

  for (const name of ['peek', 'attack']) {
    animation.play(name, { blendMs: 0 });
    animation.update(CAT_MOTION_CLIPS[name].duration);
    assert.deepEqual(rig.snapshot(), initial, `${name} should return to authored pose`);
    assert.equal(animation.getState().activeClip, null);
  }

  animation.play('hide', { blendMs: 0 });
  animation.update(CAT_MOTION_CLIPS.hide.duration);
  assert.equal(animation.getState().activeClip, null);
  assert.ok(rig.getPart('catRoot').local.y > 0);

  animation.reset();
  assert.deepEqual(rig.snapshot(), initial);
});

test('cancel resets an active clip without retaining transformed offsets', () => {
  const { rig, animation } = createAnimation();
  const initial = rig.snapshot();

  animation.play('attack', { blendMs: 0 });
  animation.update(260);
  assert.notDeepEqual(rig.snapshot(), initial);

  animation.cancel();
  assert.deepEqual(rig.snapshot(), initial);
  assert.equal(animation.getState().activeClip, null);
});

test('switching clips blends from the current pose into the next clip', () => {
  const { animation } = createAnimation();

  animation.play('attack', { blendMs: 0 });
  animation.update(260);
  const state = animation.play('watch');

  assert.equal(state.activeClip, 'watch');
  assert.equal(state.transitioning, true);

  animation.update(60);
  assert.equal(animation.getState().transitioning, true);
  animation.update(60);
  assert.equal(animation.getState().transitioning, false);
});
