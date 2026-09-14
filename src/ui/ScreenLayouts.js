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

export function createDimOverlay(scene) {
  const viewportHeight = Math.max(1024, scene.scale.gameSize?.height ?? 1024);
  return scene.add.rectangle(512, 512, 1024, viewportHeight, 0x1a120e, 0.72);
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
    this.pauseDifficulty = callbacks.initialSettings?.difficulty ?? 'normal';
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
      if (name !== 'start') {
        screen.setY(this.screenOffsetY);
      }
      this.screens.set(name, screen);
    });
  }

  buildStartScreen() {
    const screen = this.scene.add.container(0, 0).setDepth(UI_DEPTH.MODAL_OVERLAY).setVisible(false);
    this.startScreenContainer = screen;

    const hasCardAsset = this.scene.textures.exists('home_card');
    const hasBtnAsset = this.scene.textures.exists('btn_start_game');

    if (hasCardAsset && hasBtnAsset) {
      // Home Card Image (Wood sign + Cat + Subtitle + 3 Rules Parchment)
      const card = this.scene.add.image(512, 100, 'home_card')
        .setOrigin(0.5, 0)
        .setScale(0.63);

      // Start Game Button (Golden cat-eared button with sparkles)
      const btnHoverKey = this.scene.textures.exists('btn_start_game_hover')
        ? 'btn_start_game_hover'
        : 'btn_start_game';

      const baseBtnScale = 0.285;
      const startBtn = this.scene.add.image(512, 880, 'btn_start_game')
        .setOrigin(0.5, 0.5)
        .setScale(baseBtnScale)
        .setInteractive({ useHandCursor: true });

      // Breathing idle animation
      const breathTween = this.scene.tweens.add({
        targets: startBtn,
        scaleX: baseBtnScale * 1.04,
        scaleY: baseBtnScale * 1.04,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      startBtn.on('pointerover', () => {
        breathTween.pause();
        startBtn.setTexture(btnHoverKey);
        startBtn.setScale(baseBtnScale * 1.05);
      });

      startBtn.on('pointerout', () => {
        startBtn.setTexture('btn_start_game');
        startBtn.setScale(baseBtnScale);
        breathTween.resume();
      });

      startBtn.on('pointerdown', () => {
        startBtn.setScale(baseBtnScale * 0.94);
      });

      startBtn.on('pointerup', () => {
        startBtn.setScale(baseBtnScale * 1.05);
        if (this.callbacks.onStart) {
          this.callbacks.onStart();
        } else if (this.callbacks.onRestart) {
          this.callbacks.onRestart();
        }
      });

      // Subtitle Divider: "— 🐾 แล้วมาดูสิ... คุณไหวแค่ไหน? —"
      const subtitle = this.scene.add.text(512, 970, '— 🐾 แล้วมาดูสิ... คุณไหวแค่ไหน? —', {
        fontFamily: UI_FONTS.family,
        fontSize: '22px',
        color: '#714626',
        fontStyle: 'bold',
        stroke: '#fff4dc',
        strokeThickness: 4,
      }).setOrigin(0.5);

      screen.add([card, startBtn, subtitle]);
    } else {
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
        if (this.callbacks.onStart) {
          this.callbacks.onStart();
        } else if (this.callbacks.onRestart) {
          this.callbacks.onRestart();
        }
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
    }

    return screen;
  }

  buildTutorialScreen() {
    const screen = this.scene.add.container(0, 0).setDepth(UI_DEPTH.MODAL_OVERLAY).setVisible(false);
    screen.add(createModalPanel(this.scene, 880, 840));

    const title = this.scene.add.text(512, 210, COPY_THAI.screens.tutorial.title, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.h2}px`,
      color: UI_COLORS.accentGoldHex,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Step Number Badge (Pill)
    this.tutStepBadge = this.scene.add.text(512, 280, 'ขั้นตอนที่ 1 / 3', {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.caption}px`,
      color: '#fff4dc',
      backgroundColor: '#7a4e32',
      padding: { left: 16, right: 16, top: 6, bottom: 6 },
    }).setOrigin(0.5);

    // Step Indicator Dots (●○○)
    this.tutStepDots = this.scene.add.text(512, 315, '● ○ ○', {
      fontFamily: UI_FONTS.family,
      fontSize: '18px',
      color: UI_COLORS.accentGoldHex,
      letterSpacing: 4,
    }).setOrigin(0.5);

    // Step Heading — larger for readability
    this.tutHeading = this.scene.add.text(512, 370, '', {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.h2}px`,
      color: '#fff4dc',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Step Body — more line spacing, wider wrap
    this.tutBody = this.scene.add.text(512, 480, '', {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.bodyLarge}px`,
      color: '#f8dfc1',
      align: 'center',
      wordWrap: { width: 720 },
      lineSpacing: 16,
    }).setOrigin(0.5);

    // Step Hint Box — with background for emphasis
    this.tutHintBg = this.scene.add.graphics();
    this.tutHint = this.scene.add.text(512, 610, '', {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.body}px`,
      color: UI_COLORS.accentGoldHex,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Skip Button
    const skipBtn = createCozyButton(this.scene, 370, 740, COPY_THAI.screens.tutorial.skipButton, () => {
      this.finishTutorial();
    }, {
      fontSize: 24,
      width: 180,
      height: 62,
    });

    // Next / Start Button
    this.tutNextBtn = createCozyButton(this.scene, 654, 740, COPY_THAI.screens.tutorial.nextButton, () => {
      this.advanceTutorial();
    }, {
      fontSize: 26,
      bgColor: UI_COLORS.accentGold,
      borderColor: 0xc48a24,
      width: 210,
      height: 62,
    });

    screen.add([title, this.tutStepBadge, this.tutStepDots, this.tutHeading, this.tutBody, this.tutHintBg, this.tutHint, skipBtn, this.tutNextBtn]);
    return screen;
  }

  buildPauseScreen() {
    const screen = this.scene.add.container(0, 0).setDepth(UI_DEPTH.MODAL_OVERLAY).setVisible(false);

    if (this.scene.textures.exists('pause_panel')) {
      screen.add(this.buildPausePanelScreen());
      return screen;
    }

    // Fallback: drawn modal (no pause_panel art asset)
    screen.add(createModalPanel(this.scene, 800, 720));

    const title = this.scene.add.text(512, 260, COPY_THAI.screens.pause.title, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.h1}px`,
      color: UI_COLORS.textLight,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const subtitle = this.scene.add.text(512, 330, COPY_THAI.screens.pause.subtitle, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.body}px`,
      color: UI_COLORS.accentGoldHex,
    }).setOrigin(0.5);

    // Decorative gold divider line
    const divider = this.scene.add.graphics();
    divider.lineStyle(2, UI_COLORS.accentGold, 0.5);
    divider.lineBetween(512 - 120, 370, 512 + 120, 370);
    // Small diamond in the center of divider
    divider.fillStyle(UI_COLORS.accentGold, 0.6);
    divider.fillCircle(512, 370, 3);

    const resumeBtn = createCozyButton(this.scene, 512, 440, COPY_THAI.screens.pause.resumeButton, () => {
      this.callbacks.onResume?.();
    }, {
      fontSize: 30,
      bgColor: UI_COLORS.greenSuccess,
      borderColor: 0x489664,
      textColor: UI_COLORS.textLight,
      width: 300,
      height: 74,
    });

    const tutBtn = createCozyButton(this.scene, 512, 545, COPY_THAI.screens.pause.howToPlayButton, () => {
      this.showTutorial('pause');
    }, {
      fontSize: 24,
      width: 250,
      height: 62,
    });

    const settingsBtn = createCozyButton(this.scene, 512, 640, COPY_THAI.screens.pause.settingsButton, () => {
      this.callbacks.onMute?.();
    }, {
      fontSize: 24,
      bgColor: UI_COLORS.accentGold,
      borderColor: 0xc48a24,
      width: 250,
      height: 62,
    });

    screen.add([title, subtitle, divider, resumeBtn, tutBtn, settingsBtn]);
    return screen;
  }

  // Pause screen built on the wooden panel art (assets/ui/pause_panel.png)
  buildPausePanelScreen() {
    const panel = this.scene.add.image(512, 512, 'pause_panel')
      .setOrigin(0.5, 0.5)
      .setDisplaySize(690, 941);

    const mainView = this.scene.add.container(0, 0);

    const title = this.scene.add.text(512, 210, COPY_THAI.screens.pause.title, {
      fontFamily: UI_FONTS.family,
      fontSize: '46px',
      color: UI_COLORS.textPrimary,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const subtitle = this.scene.add.text(512, 276, COPY_THAI.screens.pause.subtitle, {
      fontFamily: UI_FONTS.family,
      fontSize: '22px',
      color: UI_COLORS.textSecondary,
    }).setOrigin(0.5);

    const resumeBtn = createCozyButton(this.scene, 512, 424, COPY_THAI.screens.pause.resumeButton, () => {
      this.callbacks.onResume?.();
    }, {
      fontSize: 32,
      bgColor: UI_COLORS.greenSuccess,
      borderColor: 0x489664,
      textColor: UI_COLORS.textLight,
      width: 380,
      height: 92,
    });

    const howToBtn = createCozyButton(this.scene, 512, 562, COPY_THAI.screens.pause.howToPlayButton, () => {
      this.showTutorial('pause');
    }, {
      fontSize: 26,
      bgColor: UI_COLORS.creamSoft,
      borderColor: UI_COLORS.woodDark,
      textColor: UI_COLORS.textPrimary,
      width: 340,
      height: 80,
    });

    const settingsBtn = createCozyButton(this.scene, 512, 698, COPY_THAI.screens.pause.settingsButton, () => {
      this.showPauseSettings(true);
    }, {
      fontSize: 26,
      bgColor: UI_COLORS.accentGold,
      borderColor: 0xc48a24,
      textColor: UI_COLORS.textPrimary,
      width: 340,
      height: 80,
    });

    mainView.add([title, subtitle, resumeBtn, howToBtn, settingsBtn]);

    const settingsView = this.scene.add.container(0, 0).setVisible(false);

    const settingsTitle = this.scene.add.text(512, 210, COPY_THAI.screens.pause.settingsTitle, {
      fontFamily: UI_FONTS.family,
      fontSize: '46px',
      color: UI_COLORS.textPrimary,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const difficultyLabel = this.scene.add.text(512, 330, COPY_THAI.screens.pause.difficultyLabel, {
      fontFamily: UI_FONTS.family,
      fontSize: '28px',
      color: UI_COLORS.textPrimary,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.pauseDifficultyToggle = createCozyButton(this.scene, 512, 430, this.getDifficultyLabel(), () => {
      this.cycleDifficulty();
    }, {
      fontSize: 26,
      bgColor: UI_COLORS.creamSoft,
      borderColor: UI_COLORS.woodDark,
      textColor: UI_COLORS.textPrimary,
      width: 380,
      height: 84,
    });

    const difficultyHint = this.scene.add.text(512, 512, COPY_THAI.screens.pause.difficultyAction, {
      fontFamily: UI_FONTS.family,
      fontSize: '18px',
      color: UI_COLORS.textSecondary,
    }).setOrigin(0.5);

    const backBtn = createCozyButton(this.scene, 512, 698, COPY_THAI.screens.pause.backButton, () => {
      this.showPauseSettings(false);
    }, {
      fontSize: 26,
      bgColor: UI_COLORS.beigePill,
      borderColor: UI_COLORS.woodDark,
      textColor: UI_COLORS.textPrimary,
      width: 340,
      height: 80,
    });

    settingsView.add([
      settingsTitle,
      difficultyLabel,
      this.pauseDifficultyToggle,
      difficultyHint,
      backBtn,
    ]);

    this.pauseMainView = mainView;
    this.pauseSettingsView = settingsView;
    this.renderPauseDifficultyToggle();

    return [createDimOverlay(this.scene), panel, mainView, settingsView];
  }

  showPauseSettings(visible) {
    this.pauseMainView?.setVisible(!visible);
    this.pauseSettingsView?.setVisible(visible);
  }

  getDifficultyLabel() {
    const labels = {
      normal: COPY_THAI.screens.pause.difficultyNormal,
      easy: COPY_THAI.screens.pause.difficultyEasy,
      hard: COPY_THAI.screens.pause.difficultyHard,
    };
    return labels[this.pauseDifficulty] ?? labels.normal;
  }

  cycleDifficulty() {
    const order = ['normal', 'easy', 'hard'];
    const currentIndex = Math.max(0, order.indexOf(this.pauseDifficulty));
    const nextDifficulty = order[(currentIndex + 1) % order.length];
    this.pauseDifficulty = nextDifficulty;
    this.renderPauseDifficultyToggle();
    this.callbacks.onDifficultyChange?.(nextDifficulty);
  }

  renderPauseDifficultyToggle() {
    if (!this.pauseDifficultyToggle) return;
    const label = this.pauseDifficultyToggle.getAt(1);
    label?.setText(this.getDifficultyLabel());
  }

  setDifficulty(difficulty) {
    if (!['normal', 'easy', 'hard'].includes(difficulty)) return;
    this.pauseDifficulty = difficulty;
    this.renderPauseDifficultyToggle();
  }

  buildStageClearScreen() {
    const screen = this.scene.add.container(0, 0).setDepth(UI_DEPTH.MODAL_OVERLAY).setVisible(false);

    // Dim overlay
    const overlay = createDimOverlay(this.scene);

    const hasPausePanel = this.scene.textures.exists('pause_panel');
    let panel;
    if (hasPausePanel) {
      panel = this.scene.add.image(512, 512, 'pause_panel')
        .setOrigin(0.5, 0.5)
        .setDisplaySize(690, 941);
    } else {
      panel = createModalPanel(this.scene, 700, 880)[1];
    }

    // Title
    const title = this.scene.add.text(512, 220, COPY_THAI.screens.stageClear.title, {
      fontFamily: UI_FONTS.family,
      fontSize: '48px',
      color: UI_COLORS.textPrimary,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Stars (3 stars with star_icon)
    const starY = 310;
    const starSpacing = 80;
    const starScale = 0.58;
    const starElements = [];
    for (let i = 0; i < 3; i++) {
      const sx = 512 + (i - 1) * starSpacing;
      if (this.scene.textures.exists('star_icon')) {
        const star = this.scene.add.image(sx, starY, 'star_icon').setScale(starScale);
        starElements.push(star);
      }
    }
    let starsText = null;
    if (starElements.length === 0) {
      starsText = this.scene.add.text(512, starY, '★  ★  ★', {
        fontFamily: UI_FONTS.family,
        fontSize: '36px',
        color: UI_COLORS.accentGoldHex,
      }).setOrigin(0.5);
    }

    // Subtitle
    const subtitle = this.scene.add.text(512, 395, COPY_THAI.screens.stageClear.subtitle, {
      fontFamily: UI_FONTS.family,
      fontSize: '22px',
      color: UI_COLORS.textSecondary,
    }).setOrigin(0.5);

    // Divider
    const divider = this.scene.add.graphics();
    divider.lineStyle(2, 0xd9c4a8, 0.6);
    divider.lineBetween(512 - 180, 450, 512 + 180, 450);

    // Score (No clear bonus label or pill)
    this.clearScoreLabel = this.scene.add.text(512, 520, 'คะแนนรวม 0', {
      fontFamily: UI_FONTS.family,
      fontSize: '44px',
      color: UI_COLORS.textPrimary,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Play Again button ("เล่นอีกครั้ง")
    const playAgainBtn = createCozyButton(this.scene, 512, 635, COPY_THAI.screens.stageClear.playAgainButton, () => {
      this.callbacks.onRestart?.();
    }, {
      fontSize: 30,
      bgColor: UI_COLORS.greenSuccess,
      borderColor: 0x489664,
      textColor: UI_COLORS.textLight,
      width: 360,
      height: 84,
    });

    // Home button ("หน้าแรก")
    const homeBtn = createCozyButton(this.scene, 512, 740, COPY_THAI.screens.stageClear.homeButton, () => {
      this.callbacks.onHome?.();
    }, {
      fontSize: 26,
      bgColor: UI_COLORS.creamSoft,
      borderColor: UI_COLORS.woodDark,
      textColor: UI_COLORS.textPrimary,
      width: 300,
      height: 74,
    });

    const elements = [overlay, panel, title];
    starElements.forEach((s) => elements.push(s));
    if (starsText) elements.push(starsText);
    elements.push(subtitle, divider, this.clearScoreLabel, playAgainBtn, homeBtn);

    screen.add(elements);
    return screen;
  }

  buildGameOverScreen() {
    const screen = this.scene.add.container(0, 0).setDepth(UI_DEPTH.MODAL_OVERLAY).setVisible(false);
    screen.add(createModalPanel(this.scene, 840, 800));

    const title = this.scene.add.text(512, 240, COPY_THAI.screens.gameOver.title, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.display}px`,
      color: UI_COLORS.dangerCoralHex,
      fontStyle: 'bold',
      stroke: '#4a1e1e',
      strokeThickness: 6,
    }).setOrigin(0.5);

    const subtitle = this.scene.add.text(512, 325, COPY_THAI.screens.gameOver.subtitle, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.body}px`,
      color: '#f8dfc1',
    }).setOrigin(0.5);

    // Score section background
    const scoreBg = this.scene.add.graphics();
    scoreBg.fillStyle(0x5a3e32, 0.5);
    scoreBg.fillRoundedRect(512 - 200, 370, 400, 80, 18);
    scoreBg.lineStyle(2, UI_COLORS.accentGold, 0.3);
    scoreBg.strokeRoundedRect(512 - 200, 370, 400, 80, 18);

    this.overScoreLabel = this.scene.add.text(512, 410, 'คะแนนที่ได้ 320', {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.h2}px`,
      color: UI_COLORS.accentGoldHex,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // CheerUp — bigger font, cream color, multi-line
    const cheerUp = this.scene.add.text(512, 500, COPY_THAI.screens.gameOver.cheerUp, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.body}px`,
      color: '#f8dfc1',
      align: 'center',
      lineSpacing: 10,
    }).setOrigin(0.5);

    const retryBtn = createCozyButton(this.scene, 512, 620, COPY_THAI.screens.gameOver.retryButton, () => {
      this.callbacks.onRestart?.();
    }, {
      fontSize: 30,
      bgColor: UI_COLORS.accentGold,
      borderColor: 0xc48a24,
      width: 300,
      height: 72,
    });

    const homeBtn = createCozyButton(this.scene, 512, 725, COPY_THAI.screens.gameOver.homeButton, () => {
      this.callbacks.onHome?.();
    }, {
      fontSize: 22,
      width: 210,
      height: 58,
    });

    screen.add([title, subtitle, scoreBg, this.overScoreLabel, cheerUp, retryBtn, homeBtn]);
    return screen;
  }

  show(name) {
    this.screens.forEach((screen, key) => screen.setVisible(key === name));
    if (name === 'pause') this.showPauseSettings(false);
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

    // Update step indicator dots
    const dots = [0, 1, 2].map(i => i === this.tutorialStep ? '●' : '○').join(' ');
    this.tutStepDots.setText(dots);

    // Draw hint background box
    this.tutHintBg.clear();
    const hintWidth = Math.max(360, this.tutHint.width + 48);
    const hintHeight = 44;
    this.tutHintBg.fillStyle(0x5a3e32, 0.7);
    this.tutHintBg.fillRoundedRect(512 - hintWidth / 2, 610 - hintHeight / 2, hintWidth, hintHeight, hintHeight / 2);
    this.tutHintBg.lineStyle(2, UI_COLORS.accentGold, 0.3);
    this.tutHintBg.strokeRoundedRect(512 - hintWidth / 2, 610 - hintHeight / 2, hintWidth, hintHeight, hintHeight / 2);
    
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

  playStartTransition(onComplete) {
    if (!this.startScreenContainer) {
      onComplete?.();
      return;
    }
    this.scene.tweens.killTweensOf(this.startScreenContainer);
    this.scene.tweens.add({
      targets: this.startScreenContainer,
      y: -140,
      alpha: 0,
      duration: 380,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        this.startScreenContainer.setVisible(false);
        this.startScreenContainer.setY(0);
        this.startScreenContainer.setAlpha(1);
        onComplete?.();
      },
    });
  }

  playShowStartTransition() {
    if (!this.startScreenContainer) return;
    this.scene.tweens.killTweensOf(this.startScreenContainer);
    this.startScreenContainer.setY(0);
    this.startScreenContainer.setAlpha(0);
    this.startScreenContainer.setVisible(true);
    this.scene.tweens.add({
      targets: this.startScreenContainer,
      alpha: 1,
      duration: 300,
      ease: 'Sine.easeOut',
    });
  }
}
