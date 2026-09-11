/**
 * CatKub Screen Layouts & Views
 * Visual Direction: Cozy Cat Café
 * Target Screens: Start, Tutorial (3 Steps), Pause, Stage Clear, Game Over
 */

import { UI_COLORS, UI_FONTS, UI_DEPTH } from './UITokens.js';
import { COPY_THAI } from './CopyThai.js';

export function createCozyButton(scene, x, y, text, onClick, {
  fontSize = 28,
  bgColor = UI_COLORS.beigePill,
  textColor = UI_COLORS.textPrimary,
  borderColor = UI_COLORS.panelBorder,
  width = 240,
  height = 68,
} = {}) {
  const container = scene.add.container(x, y);

  const bg = scene.add.graphics();
  bg.fillStyle(bgColor, 1);
  bg.fillRoundedRect(-width / 2, -height / 2, width, height, height / 2);
  bg.lineStyle(4, borderColor, 1);
  bg.strokeRoundedRect(-width / 2, -height / 2, width, height, height / 2);

  const label = scene.add.text(0, 0, text, {
    fontFamily: UI_FONTS.family,
    fontSize: `${fontSize}px`,
    color: textColor,
    fontStyle: 'bold',
  }).setOrigin(0.5);

  container.add([bg, label]);
  container.setSize(width, height).setInteractive({ useHandCursor: true });

  container.on('pointerdown', () => onClick?.());
  container.on('pointerover', () => {
    scene.tweens.add({ targets: container, scale: 1.05, duration: 120 });
  });
  container.on('pointerout', () => {
    scene.tweens.add({ targets: container, scale: 1.0, duration: 120 });
  });

  return container;
}

export function createModalPanel(scene, width = 840, height = 760) {
  const panel = scene.add.graphics();
  // Semi-transparent dark overlay for background focus
  const overlay = scene.add.rectangle(512, 512, 1024, 1024, 0x1a120e, 0.72);

  // Warm wooden panel container
  panel.fillStyle(UI_COLORS.panelBg, 0.96);
  panel.fillRoundedRect(512 - width / 2, 512 - height / 2, width, height, 36);
  panel.lineStyle(6, UI_COLORS.panelBorder, 1);
  panel.strokeRoundedRect(512 - width / 2, 512 - height / 2, width, height, 36);

  // Inner subtle highlight border
  panel.lineStyle(2, 0xffe2b8, 0.35);
  panel.strokeRoundedRect(512 - width / 2 + 10, 512 - height / 2 + 10, width - 20, height - 20, 28);

  return [overlay, panel];
}

export class ScreenLayoutManager {
  constructor(scene, callbacks = {}) {
    this.scene = scene;
    this.callbacks = callbacks;
    this.screens = new Map();
    this.tutorialStep = 0;
    this.tutorialReturnScreen = 'start';
    this.screenOffsetY = Math.max(0, ((scene.scale.gameSize?.height ?? 1024) - 1024) / 2);
    this.buildScreens();
  }

  buildScreens() {
    const screens = [
      ['start', this.buildStartScreen()],
      ['tutorial', this.buildTutorialScreen()],
      ['pause', this.buildPauseScreen()],
      ['stage-clear', this.buildStageClearScreen()],
      ['game-over', this.buildGameOverScreen()],
    ];
    screens.forEach(([name, screen]) => {
      screen.setY(this.screenOffsetY);
      this.screens.set(name, screen);
    });
  }

  buildStartScreen() {
    const screen = this.scene.add.container(0, 0).setDepth(UI_DEPTH.MODAL_OVERLAY).setVisible(false);
    screen.add(createModalPanel(this.scene, 860, 780));

    // Logo / Title
    const title = this.scene.add.text(512, 260, COPY_THAI.app.title, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.display}px`,
      color: UI_COLORS.textLight,
      fontStyle: 'bold',
      stroke: '#301f16',
      strokeThickness: 8,
    }).setOrigin(0.5);

    // Subtitle
    const subtitle = this.scene.add.text(512, 350, COPY_THAI.app.subtitle, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.h2}px`,
      color: UI_COLORS.accentGoldHex,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Tagline / Description
    const desc = this.scene.add.text(512, 440, COPY_THAI.screens.start.description, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.body}px`,
      color: '#f8dfc1',
      align: 'center',
      lineSpacing: 10,
    }).setOrigin(0.5);

    // Play Button
    const playBtn = createCozyButton(this.scene, 512, 610, COPY_THAI.screens.start.playButton, () => {
      this.showTutorial('start');
    }, {
      fontSize: 34,
      bgColor: UI_COLORS.accentGold,
      borderColor: 0xc48a24,
      width: 260,
      height: 74,
    });

    // Touch hint
    const hint = this.scene.add.text(512, 715, COPY_THAI.screens.start.tutorialPrompt, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.caption}px`,
      color: UI_COLORS.textMuted,
    }).setOrigin(0.5);

    screen.add([title, subtitle, desc, playBtn, hint]);
    return screen;
  }

  buildTutorialScreen() {
    const screen = this.scene.add.container(0, 0).setDepth(UI_DEPTH.MODAL_OVERLAY).setVisible(false);
    screen.add(createModalPanel(this.scene, 860, 800));

    const title = this.scene.add.text(512, 230, COPY_THAI.screens.tutorial.title, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.h2}px`,
      color: UI_COLORS.accentGoldHex,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Step Number Badge (Pill)
    this.tutStepBadge = this.scene.add.text(512, 305, 'ขั้นตอนที่ 1 / 3', {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.caption}px`,
      color: '#fff4dc',
      backgroundColor: '#7a4e32',
      padding: { left: 16, right: 16, top: 6, bottom: 6 },
    }).setOrigin(0.5);

    // Step Heading
    this.tutHeading = this.scene.add.text(512, 375, '', {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.h3}px`,
      color: '#fff4dc',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Step Body
    this.tutBody = this.scene.add.text(512, 480, '', {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.body}px`,
      color: '#f8dfc1',
      align: 'center',
      wordWrap: { width: 680 },
      lineSpacing: 12,
    }).setOrigin(0.5);

    // Step Hint Box
    this.tutHint = this.scene.add.text(512, 595, '', {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.caption}px`,
      color: UI_COLORS.accentGoldHex,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Skip Button
    const skipBtn = createCozyButton(this.scene, 370, 715, COPY_THAI.screens.tutorial.skipButton, () => {
      this.finishTutorial();
    }, {
      fontSize: 24,
      width: 180,
      height: 60,
    });

    // Next / Start Button
    this.tutNextBtn = createCozyButton(this.scene, 654, 715, COPY_THAI.screens.tutorial.nextButton, () => {
      this.advanceTutorial();
    }, {
      fontSize: 26,
      bgColor: UI_COLORS.accentGold,
      borderColor: 0xc48a24,
      width: 200,
      height: 60,
    });

    screen.add([title, this.tutStepBadge, this.tutHeading, this.tutBody, this.tutHint, skipBtn, this.tutNextBtn]);
    return screen;
  }

  buildPauseScreen() {
    const screen = this.scene.add.container(0, 0).setDepth(UI_DEPTH.MODAL_OVERLAY).setVisible(false);
    screen.add(createModalPanel(this.scene, 780, 680));

    const title = this.scene.add.text(512, 275, COPY_THAI.screens.pause.title, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.h1}px`,
      color: UI_COLORS.textLight,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const subtitle = this.scene.add.text(512, 345, COPY_THAI.screens.pause.subtitle, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.body}px`,
      color: UI_COLORS.accentGoldHex,
    }).setOrigin(0.5);

    const resumeBtn = createCozyButton(this.scene, 512, 455, COPY_THAI.screens.pause.resumeButton, () => {
      this.callbacks.onResume?.();
    }, {
      fontSize: 30,
      bgColor: UI_COLORS.greenSuccess,
      borderColor: 0x489664,
      width: 280,
      height: 68,
    });

    const tutBtn = createCozyButton(this.scene, 512, 545, COPY_THAI.screens.pause.howToPlayButton, () => {
      this.showTutorial('pause');
    }, {
      fontSize: 24,
      width: 240,
      height: 60,
    });

    const restartBtn = createCozyButton(this.scene, 512, 630, COPY_THAI.screens.pause.restartButton, () => {
      this.callbacks.onRestart?.();
    }, {
      fontSize: 24,
      bgColor: UI_COLORS.accentGold,
      borderColor: 0xc48a24,
      width: 240,
      height: 60,
    });

    screen.add([title, subtitle, resumeBtn, tutBtn, restartBtn]);
    return screen;
  }

  buildStageClearScreen() {
    const screen = this.scene.add.container(0, 0).setDepth(UI_DEPTH.MODAL_OVERLAY).setVisible(false);
    screen.add(createModalPanel(this.scene, 840, 780));

    const title = this.scene.add.text(512, 250, COPY_THAI.screens.stageClear.title, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.display}px`,
      color: UI_COLORS.greenSuccessHex,
      fontStyle: 'bold',
      stroke: '#1e4429',
      strokeThickness: 6,
    }).setOrigin(0.5);

    const subtitle = this.scene.add.text(512, 335, COPY_THAI.screens.stageClear.subtitle, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.body}px`,
      color: '#f8dfc1',
    }).setOrigin(0.5);

    this.clearBonusLabel = this.scene.add.text(512, 410, COPY_THAI.screens.stageClear.clearBonus, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.h3}px`,
      color: UI_COLORS.accentGoldHex,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.clearScoreLabel = this.scene.add.text(512, 490, 'คะแนนรวม 1,480', {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.h1}px`,
      color: UI_COLORS.textLight,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const playAgainBtn = createCozyButton(this.scene, 512, 620, COPY_THAI.screens.stageClear.playAgainButton, () => {
      this.callbacks.onRestart?.();
    }, {
      fontSize: 30,
      bgColor: UI_COLORS.greenSuccess,
      borderColor: 0x489664,
      width: 280,
      height: 70,
    });

    const homeBtn = createCozyButton(this.scene, 512, 715, COPY_THAI.screens.stageClear.homeButton, () => {
      this.callbacks.onHome?.();
    }, {
      fontSize: 22,
      width: 200,
      height: 56,
    });

    screen.add([title, subtitle, this.clearBonusLabel, this.clearScoreLabel, playAgainBtn, homeBtn]);
    return screen;
  }

  buildGameOverScreen() {
    const screen = this.scene.add.container(0, 0).setDepth(UI_DEPTH.MODAL_OVERLAY).setVisible(false);
    screen.add(createModalPanel(this.scene, 840, 780));

    const title = this.scene.add.text(512, 250, COPY_THAI.screens.gameOver.title, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.display}px`,
      color: UI_COLORS.dangerCoralHex,
      fontStyle: 'bold',
      stroke: '#4a1e1e',
      strokeThickness: 6,
    }).setOrigin(0.5);

    const subtitle = this.scene.add.text(512, 335, COPY_THAI.screens.gameOver.subtitle, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.body}px`,
      color: '#f8dfc1',
    }).setOrigin(0.5);

    this.overScoreLabel = this.scene.add.text(512, 430, 'คะแนนที่ได้ 320', {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.h2}px`,
      color: UI_COLORS.accentGoldHex,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const cheerUp = this.scene.add.text(512, 505, COPY_THAI.screens.gameOver.cheerUp, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.caption}px`,
      color: UI_COLORS.textMuted,
      align: 'center',
    }).setOrigin(0.5);

    const retryBtn = createCozyButton(this.scene, 512, 620, COPY_THAI.screens.gameOver.retryButton, () => {
      this.callbacks.onRestart?.();
    }, {
      fontSize: 30,
      bgColor: UI_COLORS.accentGold,
      borderColor: 0xc48a24,
      width: 280,
      height: 70,
    });

    const homeBtn = createCozyButton(this.scene, 512, 715, COPY_THAI.screens.gameOver.homeButton, () => {
      this.callbacks.onHome?.();
    }, {
      fontSize: 22,
      width: 200,
      height: 56,
    });

    screen.add([title, subtitle, this.overScoreLabel, cheerUp, retryBtn, homeBtn]);
    return screen;
  }

  show(name) {
    this.screens.forEach((screen, key) => screen.setVisible(key === name));
  }

  showTutorial(returnTo = 'start') {
    this.tutorialReturnScreen = returnTo;
    this.tutorialStep = 0;
    this.renderTutorialStep();
    this.show('tutorial');
  }

  advanceTutorial() {
    if (this.tutorialStep >= 2) {
      this.finishTutorial();
      return;
    }
    this.tutorialStep += 1;
    this.renderTutorialStep();
  }

  finishTutorial() {
    if (this.tutorialReturnScreen === 'pause') {
      this.callbacks.onTutorialReturn?.();
    } else {
      this.callbacks.onTutorialComplete?.();
    }
  }

  renderTutorialStep() {
    const step = COPY_THAI.screens.tutorial.steps[this.tutorialStep];
    this.tutStepBadge.setText(`ขั้นตอนที่ ${this.tutorialStep + 1} / 3`);
    this.tutHeading.setText(step.heading);
    this.tutBody.setText(step.body);
    this.tutHint.setText(`💡 ${step.hint}`);
    
    // Update button text on last step
    const isLast = this.tutorialStep >= 2;
    // Find label child of button container
    const nextLabel = this.tutNextBtn.getAt(1);
    if (nextLabel) {
      nextLabel.setText(isLast ? COPY_THAI.screens.tutorial.startButton : COPY_THAI.screens.tutorial.nextButton);
    }
  }

  setClearStats(score, maxCombo = 1) {
    this.clearScoreLabel.setText(`คะแนนรวม ${score.toLocaleString()}`);
  }

  setGameOverStats(score) {
    this.overScoreLabel.setText(`คะแนนที่ได้ ${score.toLocaleString()}`);
  }
}
