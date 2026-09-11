import Phaser from 'phaser';
import { createGameConfig } from '../config/gameConfig.js';
import { preloadContractAssets } from './AssetManifest.js';
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
    this.add.rectangle(512, 512, 1024, 1024, 0xf3dcc1).setDepth(-20);
    this.assembly = createCatTableAssembly(this, { useRealAssets: this.config.useRealAssets });
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
    });

    this.buttons = new ButtonManager(this, this.config, {
      canStartHold: () => this.canStartHold(),
      onHoldStart: () => this.cat?.onPlayerStartedHold(),
      onComplete: (result) => this.handleButtonComplete(result),
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
    this.ui.setStatus('เปิดปุ่มให้ครบทั้งสี่');
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
    if (state === CAT_STATES.WARNING || state === CAT_STATES.PEEK) {
      this.ui.setStatus('ระวัง! แมวกำลังจับตาดูนะ');
      this.audio.play('warning');
    } else if (state === CAT_STATES.WATCH) {
      this.ui.setStatus('แมวกำลังมองอยู่!');
    } else if (state === CAT_STATES.ATTACK) {
      this.ui.setStatus('โดนจับแล้ว!');
    } else if (state === CAT_STATES.SABOTAGE) {
      this.ui.setStatus('แมวแกล้งปิดปุ่ม!');
      this.audio.play('sabotage');
    } else if (state === CAT_STATES.HIDDEN) {
      this.ui.setStatus('เปิดปุ่มให้ครบทั้งสี่');
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
    this.buttons.sabotage(buttonId);
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
    this.ui.setResultMessage(GAME_SCREENS.STAGE_CLEAR, `คะแนนรวม ${this.score.score}\nโบนัส Stage Clear +${bonus}`);
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
    this.ui.setResultMessage(GAME_SCREENS.GAME_OVER, `คะแนนรวม ${this.score.score}\nลองใหม่อีกครั้งได้เลย`);
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
      progress: this.buttons.getProgress(),
      muted: this.audio?.muted ?? false,
      catState: this.cat?.state ?? CAT_STATES.HIDDEN,
    });
  }

  preventBrowserScroll() {
    const canvas = this.sys.game.canvas;
    canvas.style.touchAction = 'none';
    canvas.addEventListener('contextmenu', (event) => event.preventDefault());
  }
}
