import assert from 'node:assert/strict';
import test from 'node:test';
import { CatAnimationController } from '../src/game/CatAnimationController.js';
import { CAT_RIG_GEOMETRY } from '../src/game/CatRigConstants.js';
import { CAT_STATES } from '../src/game/constants.js';

function makePart(baseX = 0, baseY = 0, baseScale = 0.24) {
  return {
    baseScale,
    baseX,
    baseY,
    alpha: 0,
    x: baseX,
    y: baseY,
    setPosition(x, y) { this.x = x; this.y = y; return this; },
    setAlpha(alpha) { this.alpha = alpha; return this; },
    setScale() { return this; },
    setRotation(rotation) { this.rotation = rotation; return this; },
  };
}

function makeHarness() {
  const tweens = {
    added: [],
    add(config) {
      const tween = {
        config,
        pause() {},
        resume() {},
        remove() {},
      };
      this.added.push(tween);
      return tween;
    },
    killTweensOf() {},
  };
  const body = makePart();
  const head = makePart();
  const sleepHead = makePart();
  const backHead = makePart();
  const gaze = makePart();
  const leftArm = makePart(
    -CAT_RIG_GEOMETRY.shoulder.x,
    CAT_RIG_GEOMETRY.shoulder.y,
    CAT_RIG_GEOMETRY.armScale,
  );
  const rightArm = makePart(
    CAT_RIG_GEOMETRY.shoulder.x,
    CAT_RIG_GEOMETRY.shoulder.y,
    CAT_RIG_GEOMETRY.armScale,
  );
  const assembly = {
    hasCatRig: true,
    container: { x: 512, y: 512 },
    catRig: { setVisible() {} },
    catReachBody: body,
    catReachHead: head,
    catReachSleepHead: sleepHead,
    catReachBackHead: backHead,
    catReachGaze: gaze,
    catReachArmLeft: leftArm,
    catReachArmRight: rightArm,
  };
  return {
    controller: new CatAnimationController({ tweens }, assembly),
    tweens,
    parts: { body, head, sleepHead, backHead, gaze, leftArm, rightArm },
  };
}

test('hidden gameplay state renders a visible sleeping idle pose', () => {
  const { controller, parts } = makeHarness();
  controller.transitionTo(CAT_STATES.HIDDEN, { immediate: true });

  assert.equal(parts.body.alpha, 1);
  assert.equal(parts.sleepHead.alpha, 1);
  assert.equal(parts.head.alpha, 0);
  assert.equal(parts.gaze.alpha, 0);
  assert.equal(parts.leftArm.alpha, 0);
  assert.equal(parts.rightArm.alpha, 0);
  assert.equal(parts.backHead.alpha, 0);
});

test('sabotage preview fades the cat in with its selected arm, never arm-first', () => {
  const { controller, tweens, parts } = makeHarness();
  controller.transitionTo(CAT_STATES.SABOTAGE, { immediate: true });
  tweens.added.length = 0;

  controller.setTarget({ x: 177, y: 512 });

  const bodyTween = tweens.added.find((tween) => tween.config.targets === controller.body);
  const headTween = tweens.added.find((tween) => tween.config.targets === controller.head);
  const gazeTween = tweens.added.find((tween) => tween.config.targets === controller.gaze);
  const armTween = tweens.added.find((tween) => tween.config.targets === controller.arms.left.part);
  assert.equal(bodyTween?.config.alpha, 1);
  assert.equal(headTween?.config.alpha, 1);
  assert.equal(gazeTween?.config.alpha, 1);
  assert.equal(armTween?.config.alpha, 0.9);
  const inactiveArmTween = tweens.added.find(
    (tween) => tween.config.targets === controller.arms.right.part,
  );
  assert.equal(inactiveArmTween?.config.alpha, 0);
  assert.equal(parts.sleepHead.alpha, 0);
});

test('rear-zone targets turn the face away and still use only the selected arm', () => {
  const { controller, tweens } = makeHarness();
  controller.transitionTo(CAT_STATES.SABOTAGE, { immediate: true });
  tweens.added.length = 0;

  controller.setTarget({ x: 512, y: 202 });

  assert.equal(controller.targetPose.facingBack, true);
  assert.equal(controller.targetPose.armSide, 'right');
  const frontHeadTween = tweens.added.find((tween) => tween.config.targets === controller.head);
  const backHeadTween = tweens.added.find((tween) => tween.config.targets === controller.backHead);
  const gazeTween = tweens.added.find((tween) => tween.config.targets === controller.gaze);
  assert.equal(frontHeadTween?.config.alpha, 0);
  assert.equal(backHeadTween?.config.alpha, 1);
  assert.equal(gazeTween?.config.alpha, 0);
});

test('front-zone targets keep the cat facing the player', () => {
  const { controller, tweens } = makeHarness();
  controller.transitionTo(CAT_STATES.SABOTAGE, { immediate: true });
  tweens.added.length = 0;

  controller.setTarget({ x: 512, y: 822 });

  assert.equal(controller.targetPose.facingBack, false);
  const frontHeadTween = tweens.added.find((tween) => tween.config.targets === controller.head);
  const backHeadTween = tweens.added.find((tween) => tween.config.targets === controller.backHead);
  assert.equal(frontHeadTween?.config.alpha, 1);
  assert.equal(backHeadTween?.config.alpha, 0);
});

test('side targets turn the body with a compact reach', () => {
  const { controller } = makeHarness();
  controller.transitionTo(CAT_STATES.SABOTAGE, { immediate: true });

  controller.setTarget({ x: 847, y: 512 });

  assert.equal(CAT_RIG_GEOMETRY.armScale, 0.24);
  assert.equal(controller.targetPose.bodyRotation, 0.42);
  assert.ok(controller.targetPose.headRotation > controller.targetPose.bodyRotation);
  assert.equal(controller.targetPose.armSide, 'right');
});

// The paw is the art-space paw position scaled by the rig and rotated to the
// solved arm angle. It must land on the button whatever side of the ring the
// button occupies.
function pawPosition(controller, pose) {
  const rest = CAT_RIG_GEOMETRY.arms[pose.armSide].restVector;
  const scale = pose.armScale;
  const rotation = pose.bodyRotation + pose.armRotation;
  const arm = pose.armSide === 'left' ? controller.arms.left.part : controller.arms.right.part;
  const shoulder = {
    x: arm.baseX * Math.cos(pose.bodyRotation) - arm.baseY * Math.sin(pose.bodyRotation) + pose.bodyX,
    y: arm.baseX * Math.sin(pose.bodyRotation) + arm.baseY * Math.cos(pose.bodyRotation) + pose.bodyY,
  };
  return {
    x: shoulder.x + (rest.x * Math.cos(rotation) - rest.y * Math.sin(rotation)) * scale,
    y: shoulder.y + (rest.x * Math.sin(rotation) + rest.y * Math.cos(rotation)) * scale,
  };
}

test('the paw lands on near and far ring buttons', () => {
  const { controller } = makeHarness();
  controller.transitionTo(CAT_STATES.SABOTAGE, { immediate: true });

  [
    { x: 512, y: 202 }, // slot-1, top of the ring
    { x: 847, y: 512 }, // slot-3, right of the ring
    { x: 749, y: 731 }, // slot-4, bottom-right diagonal
    { x: 512, y: 822 }, // slot-5, bottom of the ring (furthest from the shoulder)
    { x: 177, y: 512 }, // slot-7, left of the ring
  ].forEach((button) => {
    controller.setTarget(button);
    const paw = pawPosition(controller, controller.targetPose);
    const distance = Math.hypot(button.x - 512 - paw.x, button.y - 512 - paw.y);
    assert.ok(
      distance <= 12,
      `paw misses the button by ${distance.toFixed(1)}px for ${JSON.stringify(button)}`,
    );
    assert.ok(controller.targetPose.armScale <= 1.3);
  });
});

test('the cat visibly turns its head and eyes toward the target button', () => {
  const { controller } = makeHarness();
  controller.transitionTo(CAT_STATES.SABOTAGE, { immediate: true });

  controller.setTarget({ x: 847, y: 512 });
  const rightPose = { ...controller.targetPose };

  controller.setTarget({ x: 177, y: 512 });
  const leftPose = { ...controller.targetPose };

  assert.ok(rightPose.headX > 40 && leftPose.headX < -40);
  assert.ok(rightPose.headRotation > 0.5 && leftPose.headRotation < -0.5);
  assert.ok(rightPose.gazeX > 10 && leftPose.gazeX < -10);
  assert.ok(Math.abs(rightPose.gazeX) <= 17 && Math.abs(rightPose.gazeY) <= 13);
});

test('attack motion starts with a readable wind-up before the lunge', () => {
  const { controller, tweens } = makeHarness();
  controller.transitionTo(CAT_STATES.ATTACK);

  const bodyWindUp = tweens.added.find((tween) => tween.config.targets === controller.body);
  assert.equal(bodyWindUp?.config.y, 9);
  assert.equal(bodyWindUp?.config.scaleX, controller.body.baseScale * 1.07);
  assert.equal(bodyWindUp?.config.scaleY, controller.body.baseScale * 0.92);
  assert.equal(bodyWindUp?.config.duration, 85);
});

test('watch gaze follows the same head tilt as the face layer', () => {
  const { controller, parts } = makeHarness();
  controller.transitionTo(CAT_STATES.WATCH, { immediate: true });

  assert.equal(parts.gaze.rotation, parts.head.rotation);
  assert.equal(parts.head.rotation, -0.04);
});
