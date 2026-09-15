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
    screenShake: {
      intensity: 0.014, // in Phaser scene.cameras.main.shake
      duration: 250,
    },
    flashColor: 0xe66b5d,
    flashAlpha: 0.45,
    flashDuration: 180,
    heartBreak: {
      scale: 1.4,
      dropDistanceY: 32,
      duration: 350,
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

  triggerScreenShake(scene) {
    scene.cameras.main.shake(
      FEEDBACK_EFFECTS.catAttack.screenShake.duration,
      FEEDBACK_EFFECTS.catAttack.screenShake.intensity
    );
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
