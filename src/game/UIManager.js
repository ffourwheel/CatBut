import Phaser from 'phaser';
import { buildCozyHUD } from '../ui/HUDLayout.js';
import { ScreenLayoutManager } from '../ui/ScreenLayouts.js';
import { FEEDBACK_EFFECTS, FeedbackFX } from '../ui/FeedbackEffects.js';
import { UI_DEPTH } from '../ui/UITokens.js';
import { CAT_STATES, GAME_SCREENS } from './constants.js';

/**
 * AI-1 integration adapter for the AI-2 HUD, screen layouts, and feedback modules.
 * Gameplay code talks to this small API so the visual modules remain replaceable.
 */
export class UIManager {
  constructor(scene, callbacks = {}) {
    this.scene = scene;
    this.callbacks = callbacks;
    this.boardOffsetY = callbacks.boardOffsetY ?? 0;
    this.viewportHeight = scene.scale.gameSize?.height ?? 1024;
    this.currentScreen = GAME_SCREENS.START;
    this.lastStats = {
      score: null,
      combo: null,
      health: null,
      activeCount: null,
      totalCount: null,
      muted: null,
      timeRemaining: null,
      timeDuration: null,
    };
    this.warningVisible = false;

    this.hud = buildCozyHUD(scene, {
      onPause: () => callbacks.onPause?.(),
      onMute: () => callbacks.onMute?.(),
    });

    this.screens = new ScreenLayoutManager(scene, {
      onResume: () => callbacks.onResume?.(),
      onRestart: () => callbacks.onRestart?.(),
      onStart: () => (callbacks.onStart ? callbacks.onStart() : callbacks.onRestart?.()),
      onHome: () => callbacks.onHome?.(),
      onTutorialComplete: () => callbacks.onTutorialComplete?.(),
      onTutorialReturn: () => callbacks.onTutorialReturn?.(),
    });

    this.attackFlash = scene.add.rectangle(512, this.viewportHeight / 2, 1024, this.viewportHeight, FEEDBACK_EFFECTS.catAttack.flashColor, 0)
      .setDepth(UI_DEPTH.CAT_FX + 1)
      .setBlendMode(Phaser.BlendModes.SCREEN);

    const warningKey = scene.textures.exists('warning_mark')
      ? 'warning_mark'
      : (scene.textures.exists('warning_bubble') ? 'warning_bubble' : 'warning_mark');

    this.warningY = 355 + this.boardOffsetY;
    this.warningMark = scene.add.image(515, this.warningY, warningKey)
      .setOrigin(0.5, 0.5)
      .setDepth(UI_DEPTH.CAT_FX)
      .setScale(0)
      .setAlpha(0)
      .setVisible(false);
    this.warningActive = false;

    this.hud.setVisible(false);
    this.screens.show('start');
  }

  show(screenName) {
    this.currentScreen = screenName;
    const gameplay = screenName === GAME_SCREENS.GAMEPLAY;
    if (!gameplay) this.hideWarningMark(true);
    this.screens.show(gameplay ? '__gameplay' : screenName);
    this.hud.setVisible(gameplay);
  }

  showStart() {
    this.hideWarningMark(true);
    this.show(GAME_SCREENS.START);
    this.screens.playShowStartTransition?.();
  }

  showTutorial(returnTo = 'start') {
    this.currentScreen = GAME_SCREENS.TUTORIAL;
    this.hud.setVisible(false);
    this.screens.showTutorial(returnTo);
  }

  updateStats({ score, combo, health, maxHealth, activeCount, totalCount, muted, catState, timeRemaining, timeDuration }) {
    if (this.lastStats.score !== score) this.hud.setScore(score);
    if (this.lastStats.combo !== combo) this.hud.setCombo(combo);
    if (this.lastStats.health !== health) this.hud.setHearts(health, maxHealth);
    if (this.lastStats.activeCount !== activeCount || this.lastStats.totalCount !== totalCount) {
      this.hud.setProgress(activeCount, totalCount);
    }
    if (this.lastStats.muted !== muted) this.hud.setMuted(muted);
    if (this.lastStats.timeRemaining !== timeRemaining || this.lastStats.timeDuration !== timeDuration) {
      this.hud.setTimer(timeRemaining, timeDuration);
    }

    this.lastStats = {
      score,
      combo,
      health,
      activeCount,
      totalCount,
      muted,
      timeRemaining,
      timeDuration,
    };
  }

  setStatus(message, highlight = false) {
    this.hud.setBanner(message, highlight);
  }

  setClearStats(score, maxCombo) {
    this.screens.setClearStats(score, maxCombo);
  }

  setGameOverStats(score) {
    this.screens.setGameOverStats(score);
  }

  onButtonHold(buttonVisual) {
    this.scene.tweens.killTweensOf(buttonVisual);
    const baseScale = buttonVisual.baseScale ?? 0.55;
    this.scene.tweens.add({
      targets: buttonVisual,
      scaleX: baseScale * 0.9,
      scaleY: baseScale * 0.9,
      duration: 100,
      ease: 'Sine.easeInOut',
    });
  }

  onButtonRelease(buttonVisual) {
    this.scene.tweens.killTweensOf(buttonVisual);
    const baseScale = buttonVisual.baseScale ?? 0.55;
    this.scene.tweens.add({
      targets: buttonVisual,
      scaleX: baseScale,
      scaleY: baseScale,
      duration: 140,
      ease: 'Back.easeOut',
    });
  }

  onButtonComplete(button, scoreEvent) {
    FeedbackFX.triggerButtonPop(this.scene, button.visual);
    FeedbackFX.triggerScoreFlyup(
      this.scene,
      button.x,
      button.y,
      `+${scoreEvent.points}`,
      scoreEvent.isReactivation ? '#f7c948' : '#ffcb5c',
    );
  }

  onSabotage(button) {
    if (!button || !this.scene.textures.exists('cat_paw')) return;
    const paw = this.scene.add.image(button.x, button.y - 24, 'cat_paw')
      .setScale(0.35)
      .setAlpha(0)
      .setDepth(UI_DEPTH.BUTTON_FX);
    this.scene.tweens.add({
      targets: paw,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.35, to: 0.95 },
      angle: { from: -18, to: 8 },
      duration: 220,
      ease: 'Quad.easeInOut',
      yoyo: true,
      hold: 80,
      onComplete: () => paw.destroy(),
    });
  }

  showWarningMark() {
    if (!this.warningMark || this.warningActive) return;
    this.warningActive = true;
    this.scene.tweens.killTweensOf(this.warningMark);

    const textureWidth = this.warningMark.width || 380;
    const baseScale = 190 / textureWidth;

    this.warningMark
      .setPosition(515, this.warningY + 7)
      .setScale(0)
      .setAlpha(0)
      .setVisible(true);

    this.scene.tweens.add({
      targets: this.warningMark,
      scaleX: baseScale * 1.15,
      scaleY: baseScale * 1.15,
      alpha: 1,
      y: this.warningY,
      duration: 180,
      ease: 'Back.easeOut',
      onComplete: () => {
        if (!this.warningActive) return;
        this.scene.tweens.add({
          targets: this.warningMark,
          scaleX: baseScale,
          scaleY: baseScale,
          y: this.warningY - 4,
          duration: 250,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      },
    });
  }

  hideWarningMark(immediate = false) {
    if (!this.warningMark || (!this.warningActive && !this.warningMark.visible)) return;
    this.warningActive = false;
    this.scene.tweens.killTweensOf(this.warningMark);

    if (immediate) {
      this.warningMark.setScale(0).setAlpha(0).setVisible(false);
      return;
    }

    this.scene.tweens.add({
      targets: this.warningMark,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      y: this.warningY + 10,
      duration: 120,
      ease: 'Back.easeIn',
      onComplete: () => {
        this.warningMark.setVisible(false);
      },
    });
  }

  onCatState(state, catStateImage) {
    if (state === CAT_STATES.WARNING) {
      this.setStatus('ระวังนะ! แมวเริ่มได้ยิน!', true);
      this.showWarningMark();
      return;
    }

    this.hideWarningMark();

    if (state === CAT_STATES.PEEK) {
      this.setStatus('แมวเริ่มมองหา...', true);
      return;
    }

    if (state === CAT_STATES.WATCH) {
      this.setStatus('แมวจ้องอยู่! ปล่อยมือเดี๋ยวนี้!', true);
      return;
    }

    if (state === CAT_STATES.ATTACK) {
      this.setStatus('โดนแมวจับได้แล้ว!', true);
      FeedbackFX.triggerScreenShake(this.scene);
      this.scene.tweens.add({
        targets: this.attackFlash,
        alpha: { from: FEEDBACK_EFFECTS.catAttack.flashAlpha, to: 0 },
        duration: FEEDBACK_EFFECTS.catAttack.flashDuration,
        ease: 'Power2.easeOut',
      });
      return;
    }

    if (state === CAT_STATES.SABOTAGE) {
      this.setStatus('แมวแอบปิดปุ่ม!', true);
      return;
    }

    if (state === CAT_STATES.HIDE) {
      this.setStatus('แมวมุดกลับแล้ว! ปลอดภัย!', false);
    }
  }
}
