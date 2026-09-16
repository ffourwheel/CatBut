import { CAT_STATES } from './constants.js';
import { CAT_RIG_GEOMETRY } from './CatRigConstants.js';

const MOOD_CUE_HEAD_OFFSET_X = 0;
const MOOD_CUE_HEAD_OFFSET_Y = -150;
const MOOD_CUE_X_MIN = 160;
const MOOD_CUE_X_MAX = 864;

const POSES = Object.freeze({
  // HIDDEN is the gameplay rest state. Visually it is a small sleeping cat
  // peeking out of the hole rather than an empty canvas.
  [CAT_STATES.HIDDEN]: Object.freeze({
    bodyY: 54,
    bodyAlpha: 1,
    bodyScale: 0.94,
    headY: -34,
    headAlpha: 0,
    sleepHeadY: -34,
    sleepHeadAlpha: 1,
    gazeAlpha: 0,
    headScale: 0.94,
    headRotation: 0,
    armAlpha: 0,
  }),
  [CAT_STATES.WARNING]: Object.freeze({
    bodyY: 38,
    bodyAlpha: 1,
    bodyScale: 1,
    headY: -30,
    // Warning is anticipation, so keep the same opaque sleep head until the
    // peek begins. Cross-fading two partial-alpha heads made the cat look
    // translucent and smaller even though the torso was moving upward.
    headAlpha: 0,
    sleepHeadY: -30,
    sleepHeadAlpha: 1,
    gazeAlpha: 0,
    headScale: 1,
    headRotation: -0.02,
    armAlpha: 0,
  }),
  [CAT_STATES.PEEK]: Object.freeze({
    bodyY: 16,
    bodyAlpha: 1,
    bodyScale: 1.01,
    headY: -48,
    headAlpha: 1,
    sleepHeadY: -48,
    sleepHeadAlpha: 0,
    gazeAlpha: 1,
    headScale: 1.02,
    headRotation: 0.018,
    armAlpha: 0,
  }),
  [CAT_STATES.WATCH]: Object.freeze({
    bodyY: -2,
    bodyAlpha: 1,
    bodyScale: 0.99,
    headY: -56,
    headAlpha: 1,
    sleepHeadY: -56,
    sleepHeadAlpha: 0,
    gazeAlpha: 1,
    headScale: 1.015,
    headRotation: -0.04,
    armAlpha: 0,
  }),
  [CAT_STATES.ATTACK]: Object.freeze({
    bodyY: -14,
    bodyAlpha: 1,
    bodyScale: 1.03,
    headY: -70,
    headAlpha: 1,
    sleepHeadY: -70,
    sleepHeadAlpha: 0,
    gazeAlpha: 1,
    headScale: 1.06,
    headRotation: 0.045,
    armAlpha: 0,
  }),
  [CAT_STATES.SABOTAGE]: Object.freeze({
    bodyY: -2,
    bodyAlpha: 1,
    bodyScale: 0.99,
    headY: -58,
    headAlpha: 1,
    sleepHeadY: -58,
    sleepHeadAlpha: 0,
    gazeAlpha: 1,
    headScale: 1.01,
    headRotation: 0.02,
    armAlpha: 1,
  }),
  [CAT_STATES.HIDE]: Object.freeze({
    bodyY: 66,
    // The hole rim hides the rig spatially; do not fade the cat while it
    // ducks down because partial alpha reads as a visual glitch.
    bodyAlpha: 1,
    bodyScale: 0.96,
    headY: 26,
    headAlpha: 1,
    sleepHeadY: 26,
    sleepHeadAlpha: 0,
    gazeAlpha: 1,
    headScale: 0.96,
    headRotation: 0,
    armAlpha: 0,
  }),
});

// Exported for the dev rig preview page; the controller owns all motion.
export const CAT_POSES = POSES;

const TRANSITION_DURATION = Object.freeze({
  [CAT_STATES.HIDDEN]: 220,
  [CAT_STATES.WARNING]: 180,
  [CAT_STATES.PEEK]: 280,
  [CAT_STATES.WATCH]: 220,
  [CAT_STATES.ATTACK]: 120,
  [CAT_STATES.SABOTAGE]: 160,
  [CAT_STATES.HIDE]: 220,
});

const ATTACK_ANTICIPATION_DURATION = 85;
const ATTACK_STRIKE_DURATION = 175;

const ARM_SIDE = Object.freeze({
  LEFT: 'left',
  RIGHT: 'right',
});

const LOOK_ARM_ALPHA = 1;
const BACK_ZONE_THRESHOLD = -0.15;
const REACH_SCALE_MIN = 0.72;
// Comfortable stretch for the single-piece arm before the body starts to
// lunge toward far buttons.
const REACH_SCALE_MAX = 1.24;
const REACH_SCALE_ABS_MAX = 1.3;
// Extra torso lean toward far buttons so the paw always lands on its target.
const LUNGE_EXTRA_MAX = 58;
const BODY_TURN_LIMIT = 0.5;

const NEUTRAL_TARGET_POSE = Object.freeze({
  bodyX: 0,
  bodyY: 0,
  bodyRotation: 0,
  bodyScaleX: 1,
  bodyScaleY: 1,
  headX: 0,
  headY: 0,
  headRotation: 0,
  headScaleX: 1,
  headScaleY: 1,
  gazeX: 0,
  gazeY: 0,
  gazeRotation: 0,
  facingBack: false,
  armSide: null,
  armRotation: 0,
  armScale: 1,
  armAlpha: 0,
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function vectorLength(vector) {
  return Math.hypot(vector.x, vector.y);
}

function rotate(vector, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: vector.x * cos - vector.y * sin,
    y: vector.x * sin + vector.y * cos,
  };
}

function solveSingleReach(side, shoulder, target, bodyRotation = 0) {
  const restVector = CAT_RIG_GEOMETRY.arms[side].restVector;
  const restLength = vectorLength(restVector);
  const distance = Math.hypot(target.x - shoulder.x, target.y - shoulder.y);
  const targetAngle = Math.atan2(target.y - shoulder.y, target.x - shoulder.x);
  const restAngle = Math.atan2(restVector.y, restVector.x);

  const rawScale = distance / restLength;
  return {
    rawScale,
    scale: clamp(rawScale, REACH_SCALE_MIN, REACH_SCALE_ABS_MAX),
    armRotation: targetAngle - bodyRotation - restAngle,
    // Unit vector from shoulder to target, reused for the press contact.
    unit: { x: (target.x - shoulder.x) / distance, y: (target.y - shoulder.y) / distance },
  };
}

/**
 * Visual-only state animator for the compact single-piece cat reach.
 * CatController remains authoritative for gameplay timing and state changes.
 */
export class CatAnimationController {  constructor(scene, assembly) {
    this.scene = scene;
    this.assembly = assembly;
    this.body = assembly?.catReachBody ?? null;
    this.head = assembly?.catReachHead ?? null;
    this.sleepHead = assembly?.catReachSleepHead ?? null;
    this.backHead = assembly?.catReachBackHead ?? null;
    this.gaze = assembly?.catReachGaze ?? null;
    this.arms = {
      [ARM_SIDE.LEFT]: { part: assembly?.catReachArmLeft ?? null },
      [ARM_SIDE.RIGHT]: { part: assembly?.catReachArmRight ?? null },
    };
    this.enabled = Boolean(
      assembly?.hasCatRig
      && this.body
      && this.head
      && this.sleepHead
      && this.backHead
      && this.gaze
      && this.arms.left.part
      && this.arms.right.part,
    );
    this.usesConnectedReach = this.enabled;
    this.state = CAT_STATES.HIDDEN;
    this.moodLevel = 'sleepy';
    this.targetPose = NEUTRAL_TARGET_POSE;
    this.reachProgress = 0;
    this.activeTweens = new Set();

    if (this.enabled) {
      this.assembly.catRig.setVisible(true);
      this.applyPose(POSES[CAT_STATES.HIDDEN]);
    }
  }

  transitionTo(state, { immediate = false } = {}) {
    if (!this.enabled || !POSES[state]) return;

    this.state = state;
    if (state !== CAT_STATES.SABOTAGE) this.targetPose = NEUTRAL_TARGET_POSE;
    this.reachProgress = 0;
    this.stopTweens();

    const pose = POSES[state];
    const motion = this.getMotion(pose, state, 0);
    const duration = immediate ? 0 : TRANSITION_DURATION[state];

    if (duration === 0) {
      this.applyMotion(motion);
      this.startIdleLoop();
      return;
    }

    // Visibility is binary. Swap rig layers immediately and animate only
    // transforms so no frame can contain a semi-transparent cat.
    this.applyVisibility(motion);

    if (state === CAT_STATES.ATTACK) {
      this.playAttackMotion();
      return;
    }

    const ease = state === CAT_STATES.HIDE ? 'Cubic.easeIn' : 'Cubic.easeOut';
    this.tween(this.body, {
      x: motion.body.x,
      y: motion.body.y,
      scaleX: this.body.baseScale * motion.body.scaleX,
      scaleY: this.body.baseScale * motion.body.scaleY,
      rotation: motion.body.rotation,
    }, duration, ease, () => {
      if (this.state === state) this.startIdleLoop();
    });
    this.tween(this.head, {
      x: motion.head.x,
      y: motion.head.y,
      scaleX: this.head.baseScale * motion.head.scaleX,
      scaleY: this.head.baseScale * motion.head.scaleY,
      rotation: motion.head.rotation,
    }, duration, ease);
    this.tween(this.sleepHead, {
      x: motion.sleepHead.x,
      y: motion.sleepHead.y,
      scaleX: this.sleepHead.baseScale * motion.sleepHead.scaleX,
      scaleY: this.sleepHead.baseScale * motion.sleepHead.scaleY,
      rotation: motion.sleepHead.rotation,
    }, duration, ease);
    this.tween(this.backHead, {
      x: motion.backHead.x,
      y: motion.backHead.y,
      scaleX: this.backHead.baseScale * motion.backHead.scaleX,
      scaleY: this.backHead.baseScale * motion.backHead.scaleY,
      rotation: motion.backHead.rotation,
    }, duration, ease);
    this.tween(this.gaze, {
      x: motion.gaze.x,
      y: motion.gaze.y,
      scaleX: this.gaze.baseScale * motion.gaze.scaleX,
      scaleY: this.gaze.baseScale * motion.gaze.scaleY,
      rotation: motion.gaze.rotation,
    }, duration, ease);
    Object.values(ARM_SIDE).forEach((side) => {
      this.tweenArm(side, motion.arms[side], duration, ease);
    });
  }

  setMood(level = 'sleepy') {
    this.moodLevel = level;
  }

  getMoodCueAnchor() {
    const head = this.sleepHead?.alpha > 0 ? this.sleepHead : this.head;
    const container = this.assembly?.container;
    const baseX = container?.x ?? 512;
    const baseY = container?.y ?? 512;
    const headX = head?.x ?? 0;
    const headY = head?.y ?? -34;
    return {
      x: clamp(baseX + headX + MOOD_CUE_HEAD_OFFSET_X, MOOD_CUE_X_MIN, MOOD_CUE_X_MAX),
      y: baseY + headY + MOOD_CUE_HEAD_OFFSET_Y,
    };
  }

  playAttackMotion() {
    const strike = this.getMotion(POSES[CAT_STATES.ATTACK], CAT_STATES.ATTACK, 0);
    const windUp = {
      body: {
        x: 0,
        y: 9,
        alpha: 1,
        rotation: 0,
        scaleX: 1.07,
        scaleY: 0.92,
      },
      head: {
        x: 0,
        y: -43,
        alpha: 1,
        rotation: -0.025,
        scaleX: 1.03,
        scaleY: 0.94,
      },
      sleepHead: {
        x: 0,
        y: -43,
        alpha: 0,
        rotation: -0.025,
        scaleX: 1.03,
        scaleY: 0.94,
      },
      backHead: {
        x: 0,
        y: -43,
        alpha: 0,
        rotation: -0.025,
        scaleX: 1.03,
        scaleY: 0.94,
      },
      gaze: {
        x: 0,
        y: -43,
        alpha: 1,
        rotation: -0.025,
        scaleX: 1,
        scaleY: 1,
      },
      arms: {
        left: { ...strike.arms.left, alpha: 0 },
        right: { ...strike.arms.right, alpha: 0 },
      },
    };

    this.tweenMotion(windUp, ATTACK_ANTICIPATION_DURATION, 'Sine.easeIn', () => {
      if (this.state !== CAT_STATES.ATTACK) return;
      this.tweenMotion(strike, ATTACK_STRIKE_DURATION, 'Back.easeOut', () => {
        if (this.state === CAT_STATES.ATTACK) this.startIdleLoop();
      });
    });
  }

  tweenMotion(motion, duration, ease, onComplete) {
    this.applyVisibility(motion);
    this.tween(this.body, {
      x: motion.body.x,
      y: motion.body.y,
      scaleX: this.body.baseScale * motion.body.scaleX,
      scaleY: this.body.baseScale * motion.body.scaleY,
      rotation: motion.body.rotation,
    }, duration, ease, onComplete);
    this.tween(this.head, {
      x: motion.head.x,
      y: motion.head.y,
      scaleX: this.head.baseScale * motion.head.scaleX,
      scaleY: this.head.baseScale * motion.head.scaleY,
      rotation: motion.head.rotation,
    }, duration, ease);
    this.tween(this.sleepHead, {
      x: motion.sleepHead.x,
      y: motion.sleepHead.y,
      scaleX: this.sleepHead.baseScale * motion.sleepHead.scaleX,
      scaleY: this.sleepHead.baseScale * motion.sleepHead.scaleY,
      rotation: motion.sleepHead.rotation,
    }, duration, ease);
    this.tween(this.backHead, {
      x: motion.backHead.x,
      y: motion.backHead.y,
      scaleX: this.backHead.baseScale * motion.backHead.scaleX,
      scaleY: this.backHead.baseScale * motion.backHead.scaleY,
      rotation: motion.backHead.rotation,
    }, duration, ease);
    this.tween(this.gaze, {
      x: motion.gaze.x,
      y: motion.gaze.y,
      scaleX: this.gaze.baseScale * motion.gaze.scaleX,
      scaleY: this.gaze.baseScale * motion.gaze.scaleY,
      rotation: motion.gaze.rotation,
    }, duration, ease);
    Object.values(ARM_SIDE).forEach((side) => {
      this.tweenArm(side, motion.arms[side], duration, ease);
    });
  }

  setTarget(button, { animate = true } = {}) {
    if (!this.enabled || !button || !this.assembly?.container) return;

    const localX = button.x - this.assembly.container.x;
    const localY = button.y - this.assembly.container.y;
    const side = clamp(localX / 335, -1, 1);
    const depth = clamp(localY / 310, -1, 1);
    const facingBack = depth < BACK_ZONE_THRESHOLD;
    const armSide = side < -0.12
      ? ARM_SIDE.LEFT
      : side > 0.12
        ? ARM_SIDE.RIGHT
        : depth < 0
          ? ARM_SIDE.RIGHT
          : ARM_SIDE.LEFT;

    // The whole cat orients toward the button: the torso turns and leans,
    // then the head and eyes lead further in the same direction.
    const bodyRotation = clamp(
      side * 0.42 + (facingBack ? 0 : depth * 0.34),
      -BODY_TURN_LIMIT,
      BODY_TURN_LIMIT,
    );
    let bodyX = side * 46;
    let bodyY = depth * 36;

    const armPart = this.arms[armSide].part;
    const solveFromBody = () => {
      const shoulder = rotate({ x: armPart.baseX, y: armPart.baseY }, bodyRotation);
      shoulder.x += bodyX;
      shoulder.y += bodyY;
      return solveSingleReach(armSide, shoulder, { x: localX, y: localY }, bodyRotation);
    };

    let reach = solveFromBody();
    // Far buttons (the bottom of the ring) get an extra torso lunge toward
    // the target so the paw lands on the button instead of pressing air.
    if (reach.rawScale > REACH_SCALE_MAX) {
      const shoulder = rotate({ x: armPart.baseX, y: armPart.baseY }, bodyRotation);
      shoulder.x += bodyX;
      shoulder.y += bodyY;
      const extra = Math.min(
        (reach.rawScale - REACH_SCALE_MAX) * vectorLength(CAT_RIG_GEOMETRY.arms[armSide].restVector),
        LUNGE_EXTRA_MAX,
      );
      bodyX += reach.unit.x * extra;
      bodyY += reach.unit.y * extra;
      reach = solveFromBody();
    }

    const turn = Math.abs(side) * 0.7 + Math.abs(depth) * 0.3;
    const follow = { x: bodyX * 0.45, y: bodyY * 0.45 };

    this.targetPose = {
      bodyX,
      bodyY,
      bodyRotation,
      bodyScaleX: 1 - turn * 0.035,
      bodyScaleY: 1 + turn * 0.018,
      headX: side * 54 + follow.x,
      headY: depth * 26 - 4 + follow.y,
      headRotation: clamp(
        bodyRotation * 0.6 + side * 0.34 + depth * 0.06,
        -0.72,
        0.72,
      ),
      headScaleX: 1 - turn * 0.06,
      headScaleY: 1 + turn * 0.02,
      // Pupil offsets stay inside the eye whites, so the read comes from the
      // head turn above plus this small eye lead.
      // The complete compact eye layer stays registered to the face. The
      // head turn communicates aim without sliding eyeballs around the skull.
      gazeX: 0,
      gazeY: 0,
      gazeRotation: 0,
      facingBack,
      armSide,
      armRotation: reach.armRotation,
      armScale: reach.scale,
      armAlpha: LOOK_ARM_ALPHA,
      pressUnit: reach.unit,
    };

    if (this.state !== CAT_STATES.SABOTAGE || !animate) return;
    this.animateTargetLook();
  }

  startSabotageReach(button, { duration = 280, contactDuration = null } = {}) {
    if (!this.enabled || !button) return;

    this.setTarget(button, { animate: false });
    this.targetPose = { ...this.targetPose, armAlpha: 1 };
    this.stopTweens();
    const to = this.getMotion(POSES[CAT_STATES.SABOTAGE], CAT_STATES.SABOTAGE, 1);
    this.applyVisibility(to);
    const activeArm = this.targetPose.armSide;
    const inactiveArm = activeArm === ARM_SIDE.LEFT ? ARM_SIDE.RIGHT : ARM_SIDE.LEFT;
    // When gameplay supplies a hit beat, make the paw's first contact land on
    // that exact beat so the button never closes before the animation reaches it.
    const hasContactBeat = Number.isFinite(contactDuration);
    const contactBeat = hasContactBeat ? Math.max(50, Math.round(contactDuration)) : null;
    const pressLiftDuration = hasContactBeat ? Math.max(10, Math.round(contactBeat * 0.25)) : 55;
    const pressDownDuration = hasContactBeat ? Math.max(10, Math.round(contactBeat * 0.25)) : 55;
    const reachDuration = hasContactBeat
      ? Math.max(20, contactBeat - pressLiftDuration - pressDownDuration)
      : Math.max(110, duration - 130);
    const pressUpDuration = hasContactBeat ? Math.max(60, Math.round(contactBeat * 0.8)) : 120;
    this.reachProgress = 1;

    // The body settles during the reach so it is free to dip with the press
    // beat afterwards without two tweens fighting over the same properties.
    this.tween(this.body, {
      x: to.body.x,
      y: to.body.y - 3,
      rotation: to.body.rotation,
      scaleX: this.body.baseScale * to.body.scaleX,
      scaleY: this.body.baseScale * to.body.scaleY,
    }, reachDuration, 'Cubic.easeOut');
    this.tween(this.head, {
      x: to.head.x,
      y: to.head.y - 5,
      rotation: to.head.rotation,
      scaleX: this.head.baseScale * to.head.scaleX,
      scaleY: this.head.baseScale * to.head.scaleY,
    }, Math.round(duration * 0.84), 'Cubic.easeOut');
    this.tween(this.sleepHead, {
      x: to.sleepHead.x,
      y: to.sleepHead.y,
      rotation: to.sleepHead.rotation,
    }, duration, 'Cubic.easeOut');
    this.tween(this.backHead, {
      x: to.backHead.x,
      y: to.backHead.y - 5,
      rotation: to.backHead.rotation,
      scaleX: this.backHead.baseScale * to.backHead.scaleX,
      scaleY: this.backHead.baseScale * to.backHead.scaleY,
    }, Math.round(duration * 0.84), 'Cubic.easeOut');
    this.tween(this.gaze, {
      x: to.gaze.x,
      y: to.gaze.y,
      rotation: to.gaze.rotation,
      scaleX: this.gaze.baseScale * to.gaze.scaleX,
      scaleY: this.gaze.baseScale * to.gaze.scaleY,
    }, Math.round(duration * 0.68), 'Sine.easeOut');

    // The arm reaches in two beats: the rotation leads so the limb turns
    // toward the button first, then the scale extends the reach behind it.
    // That reads as a shoulder-led reach instead of a clock-hand sweep.
    const arm = this.arms[activeArm].part;
    this.tween(arm, {
      x: to.arms[activeArm].x,
      y: to.arms[activeArm].y,
    }, reachDuration, 'Cubic.easeOut');
    this.tween(arm, {
      rotation: to.arms[activeArm].rotation,
    }, Math.round(reachDuration * 0.7), 'Sine.easeOut');
    this.tween(arm, {
      scaleX: arm.baseScale * to.arms[activeArm].scale,
      scaleY: arm.baseScale * to.arms[activeArm].scale,
    }, reachDuration, 'Cubic.easeOut', () => {
      // The press lands in three beats: the paw lifts for a small wind-up,
      // slaps down with a squash while the body dips into the button, then
      // springs back so the contact reads as weight instead of a slide.
      const unit = this.targetPose.pressUnit ?? { x: 0, y: 1 };
      const armRest = {
        x: to.arms[activeArm].x,
        y: to.arms[activeArm].y,
        scale: to.arms[activeArm].scale,
      };
      this.tween(arm, {
        x: armRest.x - unit.x * 10,
        y: armRest.y - unit.y * 10,
      }, pressLiftDuration, 'Sine.easeOut', () => {
        this.tween(this.body, {
          x: to.body.x + unit.x * 5,
          y: to.body.y + unit.y * 5,
          rotation: to.body.rotation + unit.x * 0.02,
        }, pressDownDuration, 'Sine.easeIn');
        this.tween(this.head, {
          y: to.head.y + 3,
        }, pressDownDuration, 'Sine.easeIn');
        this.tween(arm, {
          x: armRest.x + unit.x * 13,
          y: armRest.y + unit.y * 13,
          scaleX: arm.baseScale * armRest.scale * 0.92,
          scaleY: arm.baseScale * armRest.scale * 0.92,
        }, pressDownDuration, 'Sine.easeIn', () => {
          this.tween(arm, {
            x: armRest.x,
            y: armRest.y,
            scaleX: arm.baseScale * armRest.scale,
            scaleY: arm.baseScale * armRest.scale,
          }, pressUpDuration, 'Back.easeOut');
          this.tween(this.body, {
            x: to.body.x,
            y: to.body.y,
            rotation: to.body.rotation,
          }, pressUpDuration, 'Sine.easeOut');
          this.tween(this.head, {
            y: to.head.y,
          }, pressUpDuration, 'Sine.easeOut');
        });
      });
    });
    this.tweenArm(inactiveArm, to.arms[inactiveArm], Math.round(duration * 0.7), 'Sine.easeInOut');
  }

  animateTargetLook() {
    this.stopTweens();
    // The aiming pose lands the paw on the button already, so the preview
    // reads as "paw touches its target" and the sabotage press is a squash
    // on that spot instead of an arm floating toward empty air.
    const motion = this.getMotion(POSES[CAT_STATES.SABOTAGE], CAT_STATES.SABOTAGE, 1);
    const activeArm = this.targetPose.armSide;
    const inactiveArm = activeArm === ARM_SIDE.LEFT ? ARM_SIDE.RIGHT : ARM_SIDE.LEFT;
    this.reachProgress = 1;
    this.applyVisibility(motion);

    this.tween(this.body, {
      x: motion.body.x,
      y: motion.body.y,
      rotation: motion.body.rotation,
      scaleX: this.body.baseScale * motion.body.scaleX,
      scaleY: this.body.baseScale * motion.body.scaleY,
    }, 260, 'Sine.easeInOut');
    this.tween(this.head, {
      x: motion.head.x,
      y: motion.head.y,
      rotation: motion.head.rotation,
      scaleX: this.head.baseScale * motion.head.scaleX,
      scaleY: this.head.baseScale * motion.head.scaleY,
    }, 260, 'Sine.easeInOut');
    this.tween(this.sleepHead, {
      x: motion.sleepHead.x,
      y: motion.sleepHead.y,
      rotation: motion.sleepHead.rotation,
    }, 200, 'Sine.easeInOut');
    this.tween(this.backHead, {
      x: motion.backHead.x,
      y: motion.backHead.y,
      rotation: motion.backHead.rotation,
      scaleX: this.backHead.baseScale * motion.backHead.scaleX,
      scaleY: this.backHead.baseScale * motion.backHead.scaleY,
    }, 260, 'Sine.easeInOut');
    this.tween(this.gaze, {
      x: motion.gaze.x,
      y: motion.gaze.y,
      rotation: motion.gaze.rotation,
      scaleX: this.gaze.baseScale * motion.gaze.scaleX,
      scaleY: this.gaze.baseScale * motion.gaze.scaleY,
    }, 150, 'Sine.easeOut');
    this.tweenArm(activeArm, motion.arms[activeArm], 260, 'Sine.easeInOut', () => {
      if (this.state === CAT_STATES.SABOTAGE) this.startIdleLoop();
    });
    this.tweenArm(inactiveArm, motion.arms[inactiveArm], 200, 'Sine.easeInOut');
  }

  pause() {
    this.activeTweens.forEach((tween) => tween.pause());
  }

  resume() {
    this.activeTweens.forEach((tween) => tween.resume());
  }

  stop() {
    this.stopTweens();
    this.state = CAT_STATES.HIDDEN;
    this.targetPose = NEUTRAL_TARGET_POSE;
    this.reachProgress = 0;
    if (this.enabled) this.applyMotion(this.getMotion(POSES[CAT_STATES.HIDDEN], CAT_STATES.HIDDEN, 0));
  }

  applyPose(pose) {
    if (!this.enabled) return;
    this.applyMotion(this.getMotion(pose, this.state, this.reachProgress));
  }

  getMotion(pose, state, reachProgress = this.reachProgress) {
    const target = state === CAT_STATES.SABOTAGE ? this.targetPose : NEUTRAL_TARGET_POSE;
    const bodyX = state === CAT_STATES.SABOTAGE ? target.bodyX : 0;
    const bodyY = state === CAT_STATES.SABOTAGE ? target.bodyY : 0;
    const bodyRotation = state === CAT_STATES.SABOTAGE ? target.bodyRotation : 0;
    const getArmMotion = (side) => {
      const arm = this.arms[side].part;
      const isActive = state === CAT_STATES.SABOTAGE && target.armSide === side;
      const progress = isActive ? reachProgress : 0;
      const shoulder = rotate({ x: arm.baseX, y: arm.baseY }, bodyRotation);
      shoulder.x += bodyX;
      shoulder.y += bodyY;
      const alpha = state === CAT_STATES.SABOTAGE
        ? isActive
          ? pose.armAlpha * (reachProgress > 0 ? target.armAlpha : 0)
          : 0
        : pose.armAlpha;

      // Keep the unused arm fully hidden throughout sabotage. Its tucked
      // transform is retained only to give future state blends a stable pose.
      if (!isActive) {
        const restVector = CAT_RIG_GEOMETRY.arms[side].restVector;
        const restAngle = Math.atan2(restVector.y, restVector.x);
        const tuckAngle = Math.PI / 2 + (side === ARM_SIDE.LEFT ? 0.35 : -0.35);
        return {
          x: shoulder.x,
          y: shoulder.y,
          rotation: tuckAngle - restAngle,
          scale: 0.72,
          alpha,
        };
      }

      const scale = 1 + (target.armScale - 1) * progress;
      const armRotation = target.armRotation * progress;

      return {
        x: shoulder.x,
        y: shoulder.y,
        rotation: bodyRotation + armRotation,
        scale,
        alpha,
      };
    };

    const headX = state === CAT_STATES.SABOTAGE ? target.headX : 0;
    const headY = state === CAT_STATES.SABOTAGE ? target.headY : 0;

    return {
      body: {
        x: bodyX,
        y: pose.bodyY + bodyY,
        alpha: pose.bodyAlpha,
        rotation: state === CAT_STATES.SABOTAGE ? target.bodyRotation : 0,
        scaleX: pose.bodyScale * (state === CAT_STATES.SABOTAGE ? target.bodyScaleX : 1),
        scaleY: pose.bodyScale * (state === CAT_STATES.SABOTAGE ? target.bodyScaleY : 1),
      },
      head: {
        x: headX,
        y: pose.headY + headY,
        alpha: state === CAT_STATES.SABOTAGE && target.facingBack ? 0 : pose.headAlpha,
        rotation: pose.headRotation + (state === CAT_STATES.SABOTAGE ? target.headRotation : 0),
        scaleX: pose.headScale * (state === CAT_STATES.SABOTAGE ? target.headScaleX : 1),
        scaleY: pose.headScale * (state === CAT_STATES.SABOTAGE ? target.headScaleY : 1),
      },
      sleepHead: {
        x: headX,
        y: pose.sleepHeadY + headY,
        alpha: pose.sleepHeadAlpha,
        rotation: pose.headRotation,
        scaleX: pose.headScale,
        scaleY: pose.headScale,
      },
      backHead: {
        x: headX,
        y: pose.headY + headY,
        alpha: state === CAT_STATES.SABOTAGE && target.facingBack ? pose.headAlpha : 0,
        rotation: pose.headRotation + (state === CAT_STATES.SABOTAGE ? target.headRotation : 0),
        scaleX: pose.headScale * (state === CAT_STATES.SABOTAGE ? target.headScaleX : 1),
        scaleY: pose.headScale * (state === CAT_STATES.SABOTAGE ? target.headScaleY : 1),
      },
      gaze: {
        x: headX + (state === CAT_STATES.SABOTAGE ? target.gazeX * reachProgress : 0),
        y: pose.headY + headY + (state === CAT_STATES.SABOTAGE ? target.gazeY * reachProgress : 0),
        alpha: state === CAT_STATES.SABOTAGE && target.facingBack ? 0 : pose.gazeAlpha,
        rotation: state === CAT_STATES.SABOTAGE
          ? pose.headRotation + target.headRotation
          : pose.headRotation,
        scaleX: 1,
        scaleY: 1,
      },
      arms: {
        left: getArmMotion(ARM_SIDE.LEFT),
        right: getArmMotion(ARM_SIDE.RIGHT),
      },
    };
  }

  applyMotion(motion) {
    if (!this.enabled) return;
    this.applyPart(this.body, motion.body);
    this.applyPart(this.head, motion.head);
    this.applyPart(this.sleepHead, motion.sleepHead);
    this.applyPart(this.backHead, motion.backHead);
    this.applyPart(this.gaze, motion.gaze);
    Object.values(ARM_SIDE).forEach((side) => {
      this.applyPart(this.arms[side].part, motion.arms[side]);
    });
  }

  applyVisibility(motion) {
    this.body.setAlpha(motion.body.alpha);
    this.head.setAlpha(motion.head.alpha);
    this.sleepHead.setAlpha(motion.sleepHead.alpha);
    this.backHead.setAlpha(motion.backHead.alpha);
    this.gaze.setAlpha(motion.gaze.alpha);
    Object.values(ARM_SIDE).forEach((side) => {
      this.arms[side].part.setAlpha(motion.arms[side].alpha);
    });
  }

  applyPart(part, motion) {
    part.setPosition(motion.x, motion.y)
      .setAlpha(motion.alpha)
      .setScale(
        part.baseScale * (motion.scaleX ?? motion.scale),
        part.baseScale * (motion.scaleY ?? motion.scale),
      )
      .setRotation(motion.rotation);
  }

  tweenArm(side, motion, duration, ease, onComplete) {
    const arm = this.arms[side].part;
    arm.setAlpha(motion.alpha);
    this.tween(arm, {
      x: motion.x,
      y: motion.y,
      rotation: motion.rotation,
      scaleX: arm.baseScale * motion.scale,
      scaleY: arm.baseScale * motion.scale,
    }, duration, ease, onComplete);
  }

  startIdleLoop() {
    if (!this.enabled || this.state === CAT_STATES.HIDE) return;

    const breathing = this.scene.tweens.add({
      targets: [this.body, this.head, this.sleepHead, this.backHead, this.gaze].filter(Boolean),
      y: '+=2.5',
      duration: this.state === CAT_STATES.HIDDEN ? 1100 : 760,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
    const sway = this.scene.tweens.add({
      targets: [this.body, this.head, this.sleepHead, this.backHead, this.gaze].filter(Boolean),
      rotation: '+=0.014',
      duration: this.state === CAT_STATES.HIDDEN ? 1900 : 1300,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
    this.activeTweens.add(breathing);
    this.activeTweens.add(sway);

    if (this.state === CAT_STATES.HIDDEN) {
      const sleepNod = this.scene.tweens.add({
        targets: this.sleepHead,
        rotation: '+=0.018',
        duration: 2400,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
      });
      this.activeTweens.add(sleepNod);
    }
  }

  tween(targets, props, duration, ease, onComplete) {
    let tween;
    tween = this.scene.tweens.add({
      targets,
      ...props,
      duration,
      ease,
      onComplete: () => {
        this.activeTweens.delete(tween);
        onComplete?.();
      },
    });
    this.activeTweens.add(tween);
    return tween;
  }

  stopTweens() {
    this.activeTweens.forEach((tween) => tween.remove());
    this.activeTweens.clear();
    if (this.enabled) this.scene.tweens.killTweensOf([
      this.body,
      this.head,
      this.sleepHead,
      this.backHead,
      this.gaze,
      this.arms.left.part,
      this.arms.right.part,
    ].filter(Boolean));
  }
}
