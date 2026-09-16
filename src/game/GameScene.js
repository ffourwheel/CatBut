import Phaser from 'phaser';
import { createGameConfig, getRuntimeGameConfig } from '../config/gameConfig.js';
import { ASSET_KEYS, preloadContractAssets } from './AssetManifest.js';
import { createCatTableAssembly } from './PlaceholderArt.js';
import {
  ASSEMBLY_DEPTH,
  CAT_STATES,
  GAME_SCREENS,
  SABOTAGE_PAW_DEFAULT_ANGLE,
  SABOTAGE_PAW_REACH,
} from './constants.js';
import { AudioManager } from './AudioManager.js';
import { ButtonManager } from './ButtonManager.js';
import { CatAnimationController } from './CatAnimationController.js';
import { CatController } from './CatController.js';
import { HealthManager } from './HealthManager.js';
import { MoodManager } from './MoodManager.js';
import { ScoreManager } from './ScoreManager.js';
import { StageManager } from './StageManager.js';
import { SettingsStore } from './SettingsStore.js';
import { resolveButtonCompletion } from './StageFlow.js';
import { UIManager } from './UIManager.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.settings = new SettingsStore();
    this.config = getRuntimeGameConfig({ preset: this.settings.get('difficulty') });
  }

  preload() {
    preloadContractAssets(this, { useRealAssets: this.config.useRealAssets });
  }

  create() {
    this.preventBrowserScroll();
    this.boardOffsetY = Math.max(0, (this.scale.gameSize.height - this.config.canvasSize) / 2);
    this.boardCenterY = this.config.canvasSize / 2 + this.boardOffsetY;
    this.homeTableOffset = 485;
    const boardCenterY = this.boardCenterY;
    this.add.rectangle(512, boardCenterY, 1024, 1024, 0xf3dcc1).setDepth(-10);
    this.background = this.add.image(512, boardCenterY, ASSET_KEYS.background)
      .setOrigin(0.5, 0.5)
      .setDepth(0);
    const worldWidth = this.scale.gameSize.width || 1024;
    const worldHeight = this.scale.gameSize.height || this.config.canvasSize;
    this.background.setPosition(worldWidth / 2, worldHeight / 2);
    const bgScale = Math.max(worldWidth / this.background.width, worldHeight / this.background.height);
    this.background.setScale(bgScale);
    this.backgroundForeground = this.add.image(200, 1635, ASSET_KEYS.backgroundForeground)
      .setOrigin(0.5, 0.5)
      .setScale(0.48)
      .setDepth(ASSEMBLY_DEPTH.FOREGROUND);
    this.assembly = createCatTableAssembly(this, {
      useRealAssets: this.config.useRealAssets,
      useVectorCat: this.config.useVectorCat,
      anchor: { x: 512, y: boardCenterY },
    });
    this.zeroJumpReport = this.runZeroJumpVerification();
    this.catAnimation = new CatAnimationController(this, this.assembly);
    this.audio = new AudioManager({ muted: this.settings.get('muted') });
    this.stage = new StageManager();
    this.score = new ScoreManager(this.config, () => this.refreshHud());
    this.health = new HealthManager(this.config.debug.forceHealth ?? this.config.startingHealth, () => this.refreshHud());
    this.mood = new MoodManager(this.config, (snapshot) => this.handleMoodChange(snapshot));

    this.sessionScreen = GAME_SCREENS.START;
    this.inputLockRemaining = 0;
    this.lastScoreEvent = null;
    this.sabotagePawTween = null;
    this.sabotageHitTimer = null;

    this.ui = new UIManager(this, {
      onPause: () => this.pauseStage(),
      onResume: () => this.resumeStage(),
      onRestart: () => this.beginStage(),
      onStart: () => this.startGameFromHome(),
      onHome: () => this.showStart(),
      onMute: () => this.toggleMute(),
      onDifficultyChange: (difficulty) => this.setDifficulty(difficulty),
      initialSettings: this.settings.snapshot(),
      onTutorialComplete: () => this.beginStage(),
      onTutorialReturn: () => this.showPause(),
      boardOffsetY: this.boardOffsetY,
      getMoodCueAnchor: () => this.catAnimation?.getMoodCueAnchor?.() ?? {
        x: 660,
        y: this.boardCenterY - 180,
      },
    });

    this.buttons = new ButtonManager(this, this.config, {
      canActivate: () => this.canActivateButton(),
      onActivate: (result) => this.handleButtonComplete(result),
      worldOffsetY: this.boardOffsetY,
    });

    this.cat = new CatController(this, this.config, {
      onStateChange: (state) => this.handleCatState(state),
      onAttack: () => this.handleAttack(),
      onSabotagePreview: (slotId) => this.handleSabotagePreview(slotId),
      onSabotage: (slotId) => this.handleSabotage(slotId),
      getProgress: () => ({
        activeCount: this.buttons.getActivatedCount(),
        totalCount: this.buttons.getButtonCount(),
      }),
      getSabotageTarget: (excludedSlotId) => this.buttons.getSabotageTarget(excludedSlotId),
      isSabotageTargetAvailable: (slotId) => this.buttons.isActivated(slotId),
      getMoodIntervalScale: () => this.mood.getIntervalScale(),
      onRapidTap: () => this.handleRapidTap(),
    });

    this.showStart(true);
    this.refreshHud();
  }

  update(_time, delta) {
    if (this.inputLockRemaining > 0 && this.stage.isPlaying()) {
      this.inputLockRemaining = Math.max(0, this.inputLockRemaining - delta);
    }

    if (!this.stage.isPlaying()) return;
    this.ui.update(delta);
    this.score.update(delta);
    this.mood.update(delta);
    this.buttons.update(delta, true);
    this.cat.update(delta);
    this.refreshHud();
  }

  beginStage() {
    this.hideSabotagePaw(true);
    this.catAnimation?.transitionTo(CAT_STATES.HIDDEN, { immediate: true });
    this.buttons?.clearSabotageTarget();
    if (this.assembly?.container) {
      this.assembly.container.setY(this.boardCenterY);
    }
    if (this.buttons?.layer) {
      this.buttons.layer.setY(0);
    }
    this.score.reset();
    this.health.reset();
    this.mood.reset();
    this.buttons.reset({ randomize: true });
    this.inputLockRemaining = 0;
    this.lastScoreEvent = null;
    this.stage.start();
    this.sessionScreen = GAME_SCREENS.GAMEPLAY;
    this.buttons.setVisible(true);
    this.ui.show(GAME_SCREENS.GAMEPLAY);
    this.cat.start();
    this.ui.setStatus(`เปิดปุ่มให้ครบทั้ง ${this.buttons.getButtonCount()} ปุ่ม`);
    this.refreshHud();
  }

  pauseStage() {
    if (!this.stage.isPlaying()) return;
    this.buttons.setVisible(false);
    this.cat.pause();
    this.catAnimation?.pause();
    this.sabotagePawTween?.pause();
    this.stage.pause();
    this.sessionScreen = GAME_SCREENS.PAUSE;
    this.ui.show(GAME_SCREENS.PAUSE);
  }

  resumeStage() {
    if (this.stage.status !== 'paused') return;
    this.stage.resume();
    this.cat.resume();
    this.catAnimation?.resume();
    this.sabotagePawTween?.resume();
    this.cat.suppressFor(this.config.resumeSafeWindow);
    this.buttons.setVisible(true);
    this.sessionScreen = GAME_SCREENS.GAMEPLAY;
    this.ui.show(GAME_SCREENS.GAMEPLAY);
    this.ui.setStatus('ปลอดภัยชั่วครู่...');
  }

  showPause() {
    this.sessionScreen = GAME_SCREENS.PAUSE;
    this.ui.show(GAME_SCREENS.PAUSE);
  }

  showStart(immediate = false) {
    this.cat?.stop();
    this.stage.reset();
    this.hideSabotagePaw(true);
    this.buttons?.clearSabotageTarget();
    this.buttons?.reset();
    this.buttons?.setVisible(true);
    this.sessionScreen = GAME_SCREENS.START;

    const targetTableY = this.boardCenterY + this.homeTableOffset;
    if (this.assembly?.container) {
      this.tweens.killTweensOf(this.assembly.container);
      if (immediate) {
        this.assembly.container.setY(targetTableY);
      } else {
        this.tweens.add({
          targets: this.assembly.container,
          y: targetTableY,
          duration: 400,
          ease: 'Cubic.easeOut',
        });
      }
      this.assembly.setCatState(CAT_STATES.WATCH);
      this.catAnimation?.transitionTo(CAT_STATES.WATCH, { immediate: true });
    }
    if (this.buttons?.layer) {
      this.tweens.killTweensOf(this.buttons.layer);
      if (immediate) {
        this.buttons.layer.setY(this.homeTableOffset);
      } else {
        this.tweens.add({
          targets: this.buttons.layer,
          y: this.homeTableOffset,
          duration: 400,
          ease: 'Cubic.easeOut',
        });
      }
    }

    this.ui.showStart();
  }

  startGameFromHome() {
    if (this.assembly?.container) {
      this.tweens.killTweensOf(this.assembly.container);
      this.tweens.add({
        targets: this.assembly.container,
        y: this.boardCenterY,
        duration: 450,
        ease: 'Cubic.easeOut',
      });
    }
    if (this.buttons?.layer) {
      this.tweens.killTweensOf(this.buttons.layer);
      this.tweens.add({
        targets: this.buttons.layer,
        y: 0,
        duration: 450,
        ease: 'Cubic.easeOut',
      });
    }

    this.ui.screens.playStartTransition(() => {
      this.beginStage();
    });
  }

  handleButtonComplete({ button, isReactivation, reactivationCount }) {
    const scoreEvent = this.score.awardActivation({ isReactivation, reactivationCount });
    this.lastScoreEvent = scoreEvent;
    this.ui.onButtonComplete(button, scoreEvent);
    this.audio.play(isReactivation ? 'reactivation' : 'button-complete');
    this.ui.setStatus(isReactivation ? 'เปิดปุ่มกลับมาแล้ว!' : 'เปิดปุ่มสำเร็จ!');

    const allActivated = this.buttons.areAllActivated();
    resolveButtonCompletion({
      allActivated,
      onStageClear: () => this.finishStage(),
      onPlayerActivated: (slotId) => this.cat.onPlayerActivated(slotId),
      slotId: button.slotId,
    });
    if (allActivated) return;

    this.refreshHud();
    this.tweens.add({
      targets: button.visual,
      alpha: { from: 0.5, to: 1 },
      duration: 180,
      yoyo: true,
    });
  }

  handleCatState(state) {
    this.assembly.setCatState(state);
    this.catAnimation?.transitionTo(state);
    this.ui.onCatState(state, this.assembly.catState);
    if (state === CAT_STATES.WARNING || state === CAT_STATES.PEEK) {
      this.audio.play('warning');
    } else if (state === CAT_STATES.WATCH) {
    } else if (state === CAT_STATES.ATTACK) {
    } else if (state === CAT_STATES.SABOTAGE) {
    } else if (state === CAT_STATES.HIDE || state === CAT_STATES.HIDDEN) {
      this.hideSabotagePaw();
      this.buttons.clearSabotageTarget();
    }
    this.refreshHud();
  }

  handleAttack() {
    this.inputLockRemaining = this.config.attackRecovery;
    this.score.resetCombo();
    const remainingHealth = this.health.damage(1);
    this.ui.onAttackDamage?.(remainingHealth);
    this.audio.play('attack');
    if (this.health.isEmpty()) {
      this.finishGameOver();
    }
  }

  handleSabotagePreview(slotId) {
    const button = this.buttons.setSabotageTarget(slotId);
    if (!button) return;
    this.catAnimation?.setTarget(button);
    this.ui.setStatus('แมวกำลังเล็งปุ่มนี้!', true);
    this.ui.onSabotagePreview?.(button);
  }

  handleSabotage(slotId) {
    const button = this.buttons.getButtonBySlotId(slotId);
    if (!button) return;
    const paw = this.assembly.sabotagePaw;
    let sabotageResolved = false;
    const resolveSabotage = () => {
      if (sabotageResolved) return;
      sabotageResolved = true;
      this.sabotageHitTimer = null;
      if (!this.stage.isPlaying()) return;
      const sabotaged = this.buttons.sabotage(slotId);
      this.buttons.clearSabotageTarget();
      if (sabotaged) {
        this.ui.onSabotage(button);
        this.audio.play('sabotage');
      }
    };

    this.tweens.killTweensOf(paw);
    this.sabotageHitTimer?.remove(false);
    this.sabotageHitTimer = this.time.delayedCall(
      this.config.sabotageHitDuration,
      resolveSabotage,
    );

    if (this.catAnimation?.usesConnectedReach) {
      // The connected arm is now the only active sabotage visual. Keep the
      // legacy overlay hidden so a second, detached hand cannot appear.
      paw.setVisible(false).setAlpha(0).setScale(0.02);
      this.sabotagePawTween = null;
      this.catAnimation.startSabotageReach(button, {
        duration: this.config.sabotageReachDuration,
        contactDuration: this.config.sabotageHitDuration,
      });
      return;
    }

    const containerX = this.assembly.container.x;
    const containerY = this.assembly.container.y;
    const targetX = button.x - containerX;
    const targetY = button.y - containerY;
    const originX = 0;
    const originY = this.assembly.catState.baseY ?? 0;
    const targetAngle = Math.atan2(targetY - originY, targetX - originX);
    const targetDistance = Math.hypot(targetX - originX, targetY - originY);
    const targetScale = Math.max(0.3, Math.min(0.58, targetDistance / SABOTAGE_PAW_REACH));
    paw
      .setVisible(true)
      .setAlpha(0.08)
      .setPosition(originX, originY)
      .setRotation(targetAngle - SABOTAGE_PAW_DEFAULT_ANGLE)
      .setScale(0.02);

    // Keep the legacy paw fallback on the same contact beat as the gameplay
    // timer so the button never closes before the visible paw lands.
    const contactBeat = Math.max(50, this.config.sabotageHitDuration);
    const extendDuration = Math.max(20, Math.round(contactBeat * 0.5));
    const pressDuration = Math.max(20, contactBeat - extendDuration);
    const pressScale = targetScale * 0.96;
    const extendedScale = targetScale * 1.02;
    const pressButton = () => {
      this.sabotagePawTween = this.tweens.add({
        targets: paw,
        scaleX: pressScale,
        scaleY: pressScale,
        duration: pressDuration,
        ease: 'Sine.easeInOut',
        yoyo: true,
        onComplete: () => {
          this.sabotagePawTween = null;
          resolveSabotage();
        },
      });
    };

    this.sabotagePawTween = this.tweens.add({
      targets: paw,
      scaleX: extendedScale,
      scaleY: extendedScale,
      alpha: 1,
      duration: extendDuration,
      ease: 'Cubic.easeOut',
      onComplete: pressButton,
    });
  }

  handleRapidTap() {
    const moodChange = this.mood.recordRapidTap();
    this.ui?.onRapidTap?.(moodChange);
    this.refreshHud();
  }

  handleMoodChange(snapshot) {
    this.ui?.onMoodChange?.(snapshot);
    this.catAnimation?.setMood?.(snapshot.level);
    this.refreshHud();
  }

  hideSabotagePaw(immediate = false) {
    const paw = this.assembly?.sabotagePaw;
    if (!paw) return;
    this.tweens.killTweensOf(paw);
    this.sabotageHitTimer?.remove(false);
    this.sabotageHitTimer = null;
    this.sabotagePawTween = null;

    if (immediate) {
      paw.setVisible(false).setAlpha(0).setScale(0.02);
      return;
    }

    paw.setVisible(true);
    this.sabotagePawTween = this.tweens.add({
      targets: paw,
      scaleX: 0.02,
      scaleY: 0.02,
      alpha: 0,
      duration: this.config.hideDuration,
      ease: 'Quad.easeIn',
      onComplete: () => {
        paw.setVisible(false);
      },
    });
  }

  finishStage() {
    if (!this.stage.isPlaying()) return;
    this.cat.stop();
    this.buttons.setVisible(false);
    const bonus = this.score.addBonus(this.config.stageClearBonus);
    this.stage.clear();
    this.sessionScreen = GAME_SCREENS.STAGE_CLEAR;
    this.ui.setClearStats(this.score.score, this.score.combo);
    this.ui.show(GAME_SCREENS.STAGE_CLEAR);
    this.audio.play('stage-clear');
  }

  finishGameOver() {
    if (!this.stage.isPlaying()) return;
    this.cat.stop();
    this.buttons.setVisible(false);
    this.stage.gameOver();
    this.sessionScreen = GAME_SCREENS.GAME_OVER;
    this.ui.setGameOverStats(this.score.score);
    this.ui.show(GAME_SCREENS.GAME_OVER);
  }

  canActivateButton() {
    if (!this.stage.isPlaying() || this.inputLockRemaining > 0) return false;
    if (this.cat?.state === CAT_STATES.WATCH) {
      this.cat.requestAttack();
      return false;
    }
    if (this.cat?.state === CAT_STATES.ATTACK) return false;
    return true;
  }

  toggleMute() {
    this.settings.set('muted', this.audio.toggleMute());
    this.refreshHud();
  }

  setDifficulty(difficulty) {
    if (!this.settings.set('difficulty', difficulty)) return;

    const runtimeOverrides = globalThis.CATKUB_CONFIG && typeof globalThis.CATKUB_CONFIG === 'object'
      ? globalThis.CATKUB_CONFIG
      : {};
    this.config = createGameConfig({ ...runtimeOverrides, preset: difficulty });

    // Existing managers keep the same config interface, so the new preset is
    // picked up without rebuilding the table or the current screen.
    if (this.cat) this.cat.config = this.config;
    if (this.buttons) this.buttons.config = this.config;
    if (this.score) this.score.config = this.config;
    if (this.mood) this.mood.config = this.config;
    this.ui?.setDifficulty?.(difficulty);
  }

  refreshHud() {
    if (!this.ui || !this.score || !this.health || !this.buttons) return;
    const comboTimerInfo = this.score.getComboTimerInfo();
    this.ui.updateStats({
      score: this.score.score,
      combo: this.score.combo,
      health: this.health.health,
      maxHealth: this.health.maxHealth,
      activeCount: this.buttons.getActivatedCount(),
      totalCount: this.buttons.getButtonCount(),
      muted: this.audio?.muted ?? false,
      catState: this.cat?.state ?? CAT_STATES.HIDDEN,
      comboTimeRemaining: comboTimerInfo.remaining,
      comboTimeDuration: comboTimerInfo.duration,
      mood: this.mood?.snapshot() ?? {
        value: 0,
        max: 100,
        level: 'sleepy',
        intervalScale: 1,
      },
    });
  }

  preventBrowserScroll() {
    const canvas = this.sys.game.canvas;
    canvas.style.touchAction = 'none';
    canvas.addEventListener('contextmenu', (event) => event.preventDefault());
  }

  runZeroJumpVerification() {
    const layers = [this.assembly.tableBack, this.assembly.catState, this.assembly.tableFront];
    const snapshot = (gameObject) => ({
      x: gameObject.x,
      y: gameObject.y,
      scaleX: gameObject.scaleX,
      scaleY: gameObject.scaleY,
      rotation: gameObject.rotation,
      originX: gameObject.originX,
      originY: gameObject.originY,
    });
    const baseline = layers.map(snapshot);
    const states = Object.values(CAT_STATES);
    const checks = states.map((state) => {
      this.assembly.setCatState(state);
      const current = layers.map(snapshot);
      const maxDelta = current.reduce((maxLayerDelta, layer, index) => {
        const base = baseline[index];
        return Math.max(
          maxLayerDelta,
          ...Object.keys(base).map((key) => Math.abs(layer[key] - base[key])),
        );
      }, 0);
      return { state, maxDelta };
    });

    this.assembly.setCatState(CAT_STATES.HIDDEN);
    const report = {
      passed: checks.every((check) => check.maxDelta === 0),
      checks,
    };
    console.info('[Zero-Jump Test]', report.passed ? 'PASS' : 'FAIL', report);
    return report;
  }
}
