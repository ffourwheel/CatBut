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
    this.tutorialScreenContainer = screen;
    screen.add(createModalPanel(this.scene, 880, 870));

    // 1. Header
    const title = this.scene.add.text(512, 130, COPY_THAI.screens.tutorial.title ?? 'วิธีเล่น CatKub 🐱', {
      fontFamily: UI_FONTS.family,
      fontSize: '38px',
      color: '#fff4dc',
      fontStyle: 'bold',
      stroke: '#2b1b14',
      strokeThickness: 5,
    }).setOrigin(0.5);

    const subtitle = this.scene.add.text(512, 175, COPY_THAI.screens.tutorial.subtitle ?? 'แอบเปิดปุ่มให้ครบ อย่าให้เจ้าเหมียวจับได้!', {
      fontFamily: UI_FONTS.family,
      fontSize: '20px',
      color: UI_COLORS.accentGoldHex,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Decorative golden divider line
    const divider = this.scene.add.graphics();
    divider.lineStyle(2, UI_COLORS.accentGold, 0.45);
    divider.lineBetween(512 - 200, 202, 512 + 200, 202);
    divider.fillStyle(UI_COLORS.accentGold, 0.85);
    divider.fillCircle(512, 202, 3.5);

    // Close "✕" button at top-right
    const closeBtn = this.scene.add.container(890, 128);
    const closeBg = this.scene.add.circle(0, 0, 24, 0x422a1e).setStrokeStyle(2.5, UI_COLORS.panelBorder, 1);
    const closeText = this.scene.add.text(0, 0, '✕', {
      fontFamily: UI_FONTS.family,
      fontSize: '22px',
      color: '#fff4dc',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    closeBtn.add([closeBg, closeText]);
    closeBtn.setSize(48, 48).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.closeTutorial());
    closeBtn.on('pointerover', () => closeBtn.setScale(1.1));
    closeBtn.on('pointerout', () => closeBtn.setScale(1.0));

    // 2. Rule Cards (Directly added to screen — 100% visible, no clipping!)
    const cardsData = COPY_THAI.screens.tutorial.cards ?? [
      {
        icon: '👆',
        title: '1. แตะค้างเพื่อเปิดปุ่ม',
        desc: 'แตะปุ่มบนโต๊ะค้างไว้จนวงแหวนเต็มเพื่อเปิดไฟ เปิดให้ครบทุกปุ่ม',
        tip: '💡 ปล่อยมือก่อน วงแหวนจะค่อย ๆ ลดลง',
      },
      {
        icon: '👀',
        title: '2. แมวโผล่ รีบปล่อยมือ!',
        desc: 'เห็นหูแมวโผล่หรือเครื่องหมาย ❗ ให้รีบยกนิ้วทันที!',
        tip: '⚠️ ถ้ายังกดค้างอยู่จะโดนตบ เสีย ♥ 1 ดวง + คอมโบรีเซ็ต',
      },
      {
        icon: '🐾',
        title: '3. ระวังอุ้งมือแมวป่วน!',
        desc: 'เจ้าเหมียวจะแอบยื่นอุ้งมือมาปิดปุ่ม ต้องคอยเปิดใหม่ให้ติดครบ',
        tip: '⭐ ทุกปุ่มต้องเปิดติดพร้อมกัน = ชนะทันที!',
      },
    ];

    const cardYPositions = [268, 398, 528];
    const cardColors = [
      { iconBg: 0x422a1d, titleColor: '#ffcb5c', tipColor: '#ffdca8' },
      { iconBg: 0x482420, titleColor: '#ff8a7a', tipColor: '#ffb3a8' },
      { iconBg: 0x3f2a1e, titleColor: '#ffcb5c', tipColor: '#ffe399' },
    ];

    const cardElements = [];
    cardsData.forEach((c, idx) => {
      const cardY = cardYPositions[idx] ?? (268 + idx * 130);
      const card = this.createTutorialCard(cardY, {
        icon: c.icon,
        iconBg: cardColors[idx]?.iconBg ?? 0x3c281e,
        title: c.title,
        titleColor: cardColors[idx]?.titleColor ?? '#ffcb5c',
        desc: c.desc,
        tip: c.tip,
        tipColor: cardColors[idx]?.tipColor ?? '#ffdca8',
      });
      cardElements.push(card);
    });

    // Goal Banner below the 3 cards
    const goalBanner = this.createGoalBanner(632, COPY_THAI.screens.tutorial.goal);

    // 3. Action Button at Bottom
    this.tutConfirmBtn = createCozyButton(
      this.scene,
      512,
      734,
      COPY_THAI.screens.tutorial.confirmButton ?? 'เข้าใจแล้ว เริ่มเลย! 🎮',
      () => this.handleConfirmTutorial(),
      {
        fontSize: 28,
        bgColor: UI_COLORS.accentGold,
        borderColor: 0xc48a24,
        textColor: UI_COLORS.textPrimary,
        width: 360,
        height: 74,
      }
    );

    screen.add([
      title,
      subtitle,
      divider,
      closeBtn,
      ...cardElements,
      goalBanner,
      this.tutConfirmBtn,
    ]);
    return screen;
  }

  createTutorialCard(cardY, { icon, iconBg, title, titleColor, desc, tip, tipColor }) {
    const card = this.scene.add.container(512, cardY);
    const cardW = 760;
    const cardH = 116;

    // Background panel with cozy border
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x271912, 0.94);
    bg.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 20);
    bg.lineStyle(2.5, UI_COLORS.panelBorder, 1);
    bg.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 20);
    bg.lineStyle(1.5, 0xffe2b8, 0.22);
    bg.strokeRoundedRect(-cardW / 2 + 4, -cardH / 2 + 4, cardW - 8, cardH - 8, 16);

    // Left Icon Badge
    const iconCircle = this.scene.add.graphics();
    iconCircle.fillStyle(iconBg, 1);
    iconCircle.fillCircle(-312, 0, 32);
    iconCircle.lineStyle(2.5, UI_COLORS.panelBorder, 1);
    iconCircle.strokeCircle(-312, 0, 32);
    iconCircle.lineStyle(1.5, 0xffe2b8, 0.35);
    iconCircle.strokeCircle(-312, 0, 28);

    const iconText = this.scene.add.text(-312, 0, icon, {
      fontSize: '30px',
    }).setOrigin(0.5);

    // Title Text
    const titleText = this.scene.add.text(-260, -31, title, {
      fontFamily: UI_FONTS.family,
      fontSize: '22px',
      color: titleColor,
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);

    // Description Text
    const descText = this.scene.add.text(-260, -4, desc, {
      fontFamily: UI_FONTS.family,
      fontSize: '17px',
      color: '#fff4dc',
    }).setOrigin(0, 0.5);

    // Tip Badge
    const tipText = this.scene.add.text(-250, 28, tip, {
      fontFamily: UI_FONTS.family,
      fontSize: '15px',
      color: tipColor,
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);

    const tipBg = this.scene.add.graphics();
    const tipW = Math.min(580, tipText.width + 20);
    tipBg.fillStyle(0x19100a, 0.85);
    tipBg.fillRoundedRect(-260, 16, tipW, 24, 12);
    tipBg.lineStyle(1, 0x6e4732, 0.6);
    tipBg.strokeRoundedRect(-260, 16, tipW, 24, 12);

    card.add([bg, iconCircle, iconText, titleText, descText, tipBg, tipText]);
    return card;
  }

  createGoalBanner(bannerY, goalText) {
    const banner = this.scene.add.container(512, bannerY);
    const w = 760;
    const h = 48;

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x1e120c, 0.95);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 24);
    bg.lineStyle(2, UI_COLORS.accentGold, 0.85);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 24);
    bg.lineStyle(1, 0xffe2b8, 0.2);
    bg.strokeRoundedRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6, 21);

    const text = this.scene.add.text(0, 0, goalText ?? '🎯 เป้าหมาย: แอบเปิดปุ่มบนโต๊ะให้ครบ 100% เพื่อผ่านด่าน!', {
      fontFamily: UI_FONTS.family,
      fontSize: '17px',
      color: '#ffcb5c',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    banner.add([bg, text]);
    return banner;
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

    // Title — warm red/coral tone
    const title = this.scene.add.text(512, 220, COPY_THAI.screens.gameOver.title, {
      fontFamily: UI_FONTS.family,
      fontSize: '46px',
      color: '#b23b2b',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Empty hearts row (3 empty hearts)
    const heartY = 300;
    const heartSpacing = 72;
    const heartElements = [];
    for (let i = 0; i < 3; i++) {
      const hx = 512 + (i - 1) * heartSpacing;
      if (this.scene.textures.exists('heart_empty')) {
        const heart = this.scene.add.image(hx, heartY, 'heart_empty').setScale(0.52);
        heartElements.push(heart);
      }
    }
    let heartsText = null;
    if (heartElements.length === 0) {
      heartsText = this.scene.add.text(512, heartY, '♡  ♡  ♡', {
        fontFamily: UI_FONTS.family,
        fontSize: '36px',
        color: '#b23b2b',
      }).setOrigin(0.5);
    }

    // Subtitle
    const subtitle = this.scene.add.text(512, 380, COPY_THAI.screens.gameOver.subtitle, {
      fontFamily: UI_FONTS.family,
      fontSize: '22px',
      color: UI_COLORS.textSecondary,
    }).setOrigin(0.5);

    // Divider
    const divider = this.scene.add.graphics();
    divider.lineStyle(2, 0xd9c4a8, 0.6);
    divider.lineBetween(512 - 180, 435, 512 + 180, 435);

    // Score
    this.overScoreLabel = this.scene.add.text(512, 490, 'คะแนนที่ได้ 0', {
      fontFamily: UI_FONTS.family,
      fontSize: '42px',
      color: UI_COLORS.textPrimary,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // CheerUp message
    const cheerUp = this.scene.add.text(512, 560, COPY_THAI.screens.gameOver.cheerUp, {
      fontFamily: UI_FONTS.family,
      fontSize: '20px',
      color: '#8a6552',
      align: 'center',
      lineSpacing: 8,
    }).setOrigin(0.5);

    // Retry button ("ลองใหม่อีกครั้ง")
    const retryBtn = createCozyButton(this.scene, 512, 650, COPY_THAI.screens.gameOver.retryButton, () => {
      this.callbacks.onRestart?.();
    }, {
      fontSize: 28,
      bgColor: UI_COLORS.accentGold,
      borderColor: 0xc48a24,
      textColor: UI_COLORS.textPrimary,
      width: 360,
      height: 84,
    });

    // Home button ("หน้าแรก")
    const homeBtn = createCozyButton(this.scene, 512, 750, COPY_THAI.screens.gameOver.homeButton, () => {
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
    heartElements.forEach((h) => elements.push(h));
    if (heartsText) elements.push(heartsText);
    elements.push(subtitle, divider, this.overScoreLabel, cheerUp, retryBtn, homeBtn);

    screen.add(elements);
    return screen;
  }

  show(name) {
    this.screens.forEach((screen, key) => screen.setVisible(key === name));
    if (name === 'pause') this.showPauseSettings(false);
  }

  showTutorial(returnTo = 'start') {
    this.tutorialReturnScreen = returnTo;
    const isPause = returnTo === 'pause';
    const label = isPause
      ? (COPY_THAI.screens.tutorial.returnButton ?? 'กลับไปเล่นต่อ 🐾')
      : (COPY_THAI.screens.tutorial.confirmButton ?? 'เข้าใจแล้ว เริ่มเลย! 🎮');
    const btnLabel = this.tutConfirmBtn?.getAt(1);
    if (btnLabel && typeof btnLabel.setText === 'function') {
      btnLabel.setText(label);
    }
    this.show('tutorial');
  }

  handleConfirmTutorial() {
    if (this.tutorialReturnScreen === 'pause') {
      if (this.callbacks.onResume) {
        this.callbacks.onResume();
      } else {
        this.callbacks.onTutorialReturn?.();
      }
    } else {
      if (this.callbacks.onStart) {
        this.callbacks.onStart();
      } else {
        this.callbacks.onTutorialComplete?.();
      }
    }
  }

  closeTutorial() {
    if (this.tutorialReturnScreen === 'pause') {
      this.callbacks.onTutorialReturn?.();
    } else {
      if (this.callbacks.onHome) {
        this.callbacks.onHome();
      } else {
        this.callbacks.onTutorialComplete?.();
      }
    }
  }

  finishTutorial() {
    this.handleConfirmTutorial();
  }

  advanceTutorial() {
    this.handleConfirmTutorial();
  }

  renderTutorialStep() {
    // Single-page tutorial: all cards are rendered statically in buildTutorialScreen
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
