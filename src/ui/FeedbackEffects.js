import { UI_DEPTH } from './UITokens.js';
import { ASSET_KEYS } from '../game/AssetKeys.js';
import { CAT_CLAW_CUTSCENE_FRAMES } from './CatAttackCutscene.js';

/**
 * CatKub Visual Feedback & Animation FX Specifications
 * Visual Direction: Cozy Cat Café
 * Defines exact parameters, tweens, and particle effects for AI-1 Integration
 */

export const FEEDBACK_EFFECTS = Object.freeze({
  buttonActivated: {
    popScale: 1.22,
    popDuration: 180,
    ease: 'Back.easeOut',
    settleScale: 1.0,
    settleDuration: 120,
    sparkleCount: 8,
    sparkleColors: [0xffcb5c, 0xfff4dc, 0x67b887],
    scoreFlyup: {
      distanceY: -64,
      duration: 650,
      fadeStart: 350,
    },
  },

  catWarning: {
    iconBounceDistance: -16,
    bounceDuration: 220,
    haloPulseAlpha: { from: 0.2, to: 0.8 },
    haloPulseDuration: 300,
    speechBubbleScale: { from: 0.6, to: 1.0 },
    speechBubbleEase: 'Back.easeOut',
  },

  catWatch: {
    stareTensionDuration: 800,
    vignetteAlpha: 0.28,
    vignetteColor: 0x22110c,
    eyeNarrowDuration: 150,
  },

  catAttack: {
    heartBreak: {
      scale: 1.4,
      dropDistanceY: 32,
      duration: 350,
    },
    clawScratch: {
      depth: UI_DEPTH.CAT_FX + 1,
      overlayColor: 0x120b09,
      overlayAlpha: 0.35,
      frameDuration: 95,
      introDuration: 120,
      outroDuration: 180,
      startScale: 0.62,
      peakScale: 0.88,
      fallbackColor: 0xf4dec2,
      fallbackAlpha: 0.92,
      fallbackLineWidth: 18,
      fallbackOffsetX: 26,
      fallbackOffsetY: 38,
    },
  },

  catSabotage: {
    buttonDeflateScale: 0.85,
    deflateDuration: 140,
    wobbleAngle: 6, // degrees
    wobbleCount: 3,
    sparkleUndoColor: 0xe66b5d,
    toastDuration: 1200,
  },

  stageClear: {
    confettiCount: 24,
    confettiColors: [0xffcb5c, 0x67b887, 0xf45b69, 0xfff4dc, 0x79a8d7],
    titleScale: { from: 0.5, to: 1.0 },
    titleDuration: 400,
    titleEase: 'Back.easeOut',
    bonusCountupDelay: 300,
  },

  gameOver: {
    fadeDuration: 400,
    desaturationTint: 0x998888,
    finalHeartScale: 1.5,
    retryButtonBounceDelay: 350,
  },
});

/**
 * Helper triggers for visual feedback in Phaser Scene
 */
export const FeedbackFX = {
  triggerButtonPop(scene, buttonVisual, onFinish = null) {
    const baseScale = buttonVisual.baseScale ?? 0.55;
    scene.tweens.add({
      targets: buttonVisual,
      scaleX: baseScale * 1.15,
      scaleY: baseScale * 1.15,
      duration: FEEDBACK_EFFECTS.buttonActivated.popDuration,
      ease: FEEDBACK_EFFECTS.buttonActivated.ease,
      yoyo: true,
      onComplete: () => {
        buttonVisual.setScale(baseScale * 1.05);
        onFinish?.();
      },
    });
  },

  triggerClawScratch(scene, { x = 512, y = 910 } = {}) {
    const config = FEEDBACK_EFFECTS.catAttack.clawScratch;
    const textureKey = ASSET_KEYS.ui.catClawCutscene;
    if (!scene.textures.exists(textureKey)) {
      this.triggerFallbackClawScratch(scene, { x, y, config });
      return;
    }

    const viewportHeight = scene.scale.gameSize?.height ?? 1024;
    const vignette = scene.add.rectangle(
      512,
      viewportHeight / 2,
      1024,
      viewportHeight,
      config.overlayColor,
      0,
    ).setDepth(config.depth - 1);
    const scratch = scene.add.image(x, y, textureKey, CAT_CLAW_CUTSCENE_FRAMES.pawReady)
      .setOrigin(0.5, 0.5)
      .setDepth(config.depth)
      .setScale(config.startScale)
      .setAlpha(0);

    let frame = CAT_CLAW_CUTSCENE_FRAMES.pawReady;
    const frameTimer = scene.time.addEvent({
      delay: config.frameDuration,
      repeat: 2,
      callback: () => {
        frame += 1;
        scratch.setFrame(frame);
      },
    });

    scene.tweens.add({
      targets: vignette,
      alpha: { from: 0, to: config.overlayAlpha },
      duration: config.introDuration,
      ease: 'Quad.easeOut',
    });
    scene.tweens.add({
      targets: scratch,
      alpha: { from: 0, to: 1 },
      scaleX: { from: config.startScale, to: config.peakScale },
      scaleY: { from: config.startScale, to: config.peakScale },
      duration: config.introDuration,
      ease: 'Back.easeOut',
      onComplete: () => {
        scene.tweens.add({
          targets: scratch,
          x: x + 8,
          angle: { from: -2, to: 2 },
          duration: config.frameDuration * 2,
          yoyo: true,
          repeat: 1,
          ease: 'Sine.easeInOut',
        });
      },
    });
    scene.time.delayedCall(config.frameDuration * 4 + config.outroDuration, () => {
      frameTimer.remove(false);
      scene.tweens.add({
        targets: [scratch, vignette],
        alpha: 0,
        scaleX: 0.76,
        scaleY: 0.76,
        duration: config.outroDuration,
        ease: 'Quad.easeIn',
        onComplete: () => {
          scratch.destroy();
          vignette.destroy();
        },
      });
    });
  },

  triggerFallbackClawScratch(scene, { x, y, config }) {
    const scratch = scene.add.graphics().setDepth(config.depth).setPosition(x, y).setAlpha(0);
    scratch.lineStyle(config.fallbackLineWidth, config.fallbackColor, config.fallbackAlpha);
    [-1, 0, 1].forEach((offset) => {
      const offsetX = offset * config.fallbackOffsetX;
      const offsetY = offset * config.fallbackOffsetY;
      scratch.beginPath();
      scratch.moveTo(-150 + offsetX, -92 + offsetY);
      scratch.lineTo(150 + offsetX, 92 + offsetY);
      scratch.strokePath();
    });
    scene.tweens.add({
      targets: scratch,
      alpha: { from: 0, to: 1 },
      scaleX: { from: config.startScale, to: 1 },
      scaleY: { from: config.startScale, to: 1 },
      duration: config.introDuration,
      ease: 'Back.easeOut',
      hold: config.frameDuration * 2,
      yoyo: true,
      onComplete: () => scratch.destroy(),
    });
  },

  triggerHeartDamage(scene, heartImage) {
    scene.tweens.add({
      targets: heartImage,
      scaleX: FEEDBACK_EFFECTS.catAttack.heartBreak.scale,
      scaleY: FEEDBACK_EFFECTS.catAttack.heartBreak.scale,
      duration: 120,
      yoyo: true,
      onComplete: () => {
        heartImage.setTexture?.('heart_empty');
      },
    });
  },

  triggerScoreFlyup(scene, x, y, text, color = '#ffcb5c') {
    const label = scene.add.text(x, y, text, {
      fontFamily: 'Mali, sans-serif',
      fontSize: '26px',
      color,
      fontStyle: 'bold',
      stroke: '#4c3030',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(150);

    scene.tweens.add({
      targets: label,
      y: y + FEEDBACK_EFFECTS.buttonActivated.scoreFlyup.distanceY,
      alpha: 0,
      duration: FEEDBACK_EFFECTS.buttonActivated.scoreFlyup.duration,
      ease: 'Power2',
      onComplete: () => label.destroy(),
    });
  },
};
