import Phaser from 'phaser';
import { createGameConfig } from '../config/gameConfig.js';
import { ASSET_KEYS, preloadContractAssets } from './AssetManifest.js';
import { createCatTableAssembly } from './PlaceholderArt.js';
import { CAT_STATES, GAME_SCREENS } from './constants.js';
import { AudioManager } from './AudioManager.js';
import { ButtonManager } from './ButtonManager.js';
import { CatController } from './CatController.js';
import { HealthManager } from './HealthManager.js';
import { ScoreManager } from './ScoreManager.js';
import { StageManager } from './StageManager.js';
import { UIManager } from './UIManager.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.config = createGameConfig(globalThis.CATKUB_CONFIG ?? {});
  }

  preload() {
    preloadContractAssets(this, { useRealAssets: this.config.useRealAssets });
  }

  create() {
    this.preventBrowserScroll();
    this.boardOffsetY = Math.max(0, (this.scale.gameSize.height - this.config.canvasSize) / 2);
    const boardCenterY = this.config.canvasSize / 2 + this.boardOffsetY;
    this.add.rectangle(512, boardCenterY, 1024, 1024, 0xf3dcc1).setDepth(-10);
    this.background = this.add.image(512, boardCenterY, ASSET_KEYS.background)
      .setOrigin(0.5, 0.5)
      .setDepth(0);
    const bgScale = Math.max(1024 / this.background.width, 1024 / this.background.height);
    this.background.setScale(bgScale);
    this.backgroundForeground = this.add.image(200, 1635, ASSET_KEYS.backgroundForeground)
      .setOrigin(0.5, 0.5)
      .setScale(0.34)
      .setDepth(25);
    this.assembly = createCatTableAssembly(this, {
      useRealAssets: this.config.useRealAssets,
      anchor: { x: 512, y: boardCenterY },
    });
    this.zeroJumpReport = this.runZeroJumpVerification();
    this.audio = new AudioManager();
    this.stage = new StageManager();
    this.score = new ScoreManager(this.config, () => this.refreshHud());
    this.health = new HealthManager(this.config.debug.forceHealth ?? this.config.startingHealth, () => this.refreshHud());

    this.sessionScreen = GAME_SCREENS.START;
    this.inputLockRemaining = 0;
    this.lastScoreEvent = null;

    this.ui = new UIManager(this, {
      onPause: () => this.pauseStage(),
      onResume: () => this.resumeStage(),
      onRestart: () => this.beginStage(),
      onHome: () => this.showStart(),
      onMute: () => this.toggleMute(),
      onTutorialComplete: () => this.beginStage(),
      onTutorialReturn: () => this.showPause(),
      boardOffsetY: this.boardOffsetY,
    });

    this.buttons = new ButtonManager(this, this.config, {
      canStartHold: () => this.canStartHold(),
      onHoldStart: (button) => {
        this.ui.onButtonHold(button.visual);
        this.cat?.onPlayerStartedHold();
      },
      onHoldEnd: (button) => this.ui.onButtonRelease(button.visual),
      onComplete: (result) => this.handleButtonComplete(result),
      worldOffsetY: this.boardOffsetY,
    });

    this.cat = new CatController(this, this.config, {
      onStateChange: (state) => this.handleCatState(state),
      onWatch: () => this.handleWatchStart(),
      onAttack: () => this.handleAttack(),
      onSabotage: (buttonId) => this.handleSabotage(buttonId),
      getSabotageTarget: () => this.buttons.getSabotageTarget(),
    });

    this.ui.showStart();
    this.refreshHud();
  }

  update(_time, delta) {
    if (this.inputLockRemaining > 0 && this.stage.isPlaying()) {
      this.inputLockRemaining = Math.max(0, this.inputLockRemaining - delta);
    }

    if (!this.stage.isPlaying()) return;
    this.buttons.update(delta, true);
    this.cat.update(delta);
    this.refreshHud();
  }

  beginStage() {
    this.score.reset();
    this.health.reset();
    this.buttons.reset();
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
    this.buttons.cancelCurrent();
    this.buttons.setVisible(false);
    this.cat.pause();
    this.stage.pause();
    this.sessionScreen = GAME_SCREENS.PAUSE;
    this.ui.show(GAME_SCREENS.PAUSE);
  }

  resumeStage() {
    if (this.stage.status !== 'paused') return;
    this.stage.resume();
    this.cat.resume();
    this.cat.suppressFor(this.config.resumeSafeWindow);
    this.buttons.setVisible(true);
    this.sessionScreen = GAME_SCREENS.GAMEPLAY;
    this.ui.show(GAME_SCREENS.GAMEPLAY);
    this.ui.setStatus('ปลอดภัยชั่วครู่...');
  }

  showStart() {
    this.cat?.stop();
    this.stage.reset();
    this.buttons?.reset();
    this.buttons?.setVisible(false);
    this.sessionScreen = GAME_SCREENS.START;
    this.ui.showStart();
  }

  handleButtonComplete({ button, isReactivation, reactivationCount }) {
    const scoreEvent = this.score.awardActivation({ isReactivation, reactivationCount });
    this.lastScoreEvent = scoreEvent;
    this.ui.onButtonComplete(button, scoreEvent);
    this.audio.play(isReactivation ? 'reactivation' : 'button-complete');
    this.ui.setStatus(isReactivation ? 'เปิดปุ่มกลับมาแล้ว!' : 'เปิดปุ่มสำเร็จ!');

    if (this.buttons.areAllActivated()) {
      this.finishStage();
      return;
    }

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
    this.ui.onCatState(state, this.assembly.catState);
    if (state === CAT_STATES.WARNING || state === CAT_STATES.PEEK) {
      this.audio.play('warning');
    } else if (state === CAT_STATES.WATCH) {
    } else if (state === CAT_STATES.ATTACK) {
    } else if (state === CAT_STATES.SABOTAGE) {
      this.audio.play('sabotage');
    }
    this.refreshHud();
  }

  handleWatchStart() {
    if (this.buttons.isHolding()) this.cat.requestAttack();
  }

  handleAttack() {
    this.buttons.cancelCurrent();
    this.inputLockRemaining = this.config.attackRecovery;
    this.score.resetCombo();
    this.health.damage(1);
    this.audio.play('attack');
    if (this.health.isEmpty()) {
      this.finishGameOver();
    }
  }

  handleSabotage(buttonId) {
    const button = this.buttons.buttons[buttonId];
    this.buttons.sabotage(buttonId);
    this.ui.onSabotage(button);
    this.audio.play('sabotage');
  }

  finishStage() {
    if (!this.stage.isPlaying()) return;
    this.cat.stop();
    this.buttons.cancelCurrent();
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
    this.buttons.cancelCurrent();
    this.buttons.setVisible(false);
    this.stage.gameOver();
    this.sessionScreen = GAME_SCREENS.GAME_OVER;
    this.ui.setGameOverStats(this.score.score);
    this.ui.show(GAME_SCREENS.GAME_OVER);
  }

  canStartHold() {
    return this.stage.isPlaying() && this.inputLockRemaining <= 0;
  }

  toggleMute() {
    this.audio.toggleMute();
    this.refreshHud();
  }

  refreshHud() {
    if (!this.ui || !this.score || !this.health || !this.buttons) return;
    this.ui.updateStats({
      score: this.score.score,
      combo: this.score.combo,
      health: this.health.health,
      maxHealth: this.health.maxHealth,
      activeCount: this.buttons.getActivatedCount(),
      totalCount: this.buttons.getButtonCount(),
      muted: this.audio?.muted ?? false,
      catState: this.cat?.state ?? CAT_STATES.HIDDEN,
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
