/**
 * CatKub HUD Layout & Component Specifications
 * Visual Direction: Cozy Cat Café
 * Target Canvas: 1024 × 1820 portrait
 */

import { UI_COLORS, UI_FONTS, UI_SPACING, UI_DEPTH } from './UITokens.js';
import { COPY_THAI } from './CopyThai.js';

export const HUD_LAYOUT_CONFIG = Object.freeze({
  // Score plaque (Top Left)
  scorePill: {
    x: 20,
    y: 18,
    width: 340,
    height: 255,
    assetCenterY: 145,
    assetHeight: 255,
    radius: 48,
    bgColor: UI_COLORS.creamSoft,
    borderColor: UI_COLORS.woodDeep,
    shadowColor: UI_COLORS.woodDeep,
    badgeBgColor: 0xf1c98d,
    badgeBorderColor: UI_COLORS.woodDark,
    badgeX: 102,
    badgeY: 82,
    badgeRadius: 50,
    starX: 102,
    starY: 82,
    starScale: 0.48,
    labelX: 232,
    labelY: 65,
    labelWidth: 120,
    labelHeight: 30,
    valueX: 232,
    valueY: 160,
  },

  // Combo Pill (Right HUD Column)
  comboPill: {
    x: 834,
    y: 280,
    width: 190,
    height: 158,
    radius: 32,
    assetY: 280,
    assetWidth: 190,
    assetHeight: 158,
    bgColor: UI_COLORS.panelBg,
    borderColor: UI_COLORS.accentGold,
    labelY: 52,
    valueY: 84,
  },

  // Hearts Container (Below Score)
  heartsRow: {
    x: 20,
    y: 274,
    width: 340,
    height: 112,
    radius: 48,
    bgColor: UI_COLORS.creamSoft,
    borderColor: UI_COLORS.woodDeep,
    shadowColor: UI_COLORS.woodDeep,
    assetCenterY: 330,
    assetHeight: 113,
    startX: 146,
    gap: 68,
    yCenter: 330,
    iconScale: 0.42,
  },

  // 4-Segment Progress Bar (Right HUD Column)
  progressBar: {
    x: 834,
    y: 155,
    width: 320,
    height: 48,
    radius: 24,
    bgColor: UI_COLORS.panelBg,
    borderColor: UI_COLORS.panelBorder,
    labelY: 155,
    segmentWidth: 42,
    segmentHeight: 22,
    segmentGap: 8,
    segmentRadius: 10,
    segmentActiveColor: UI_COLORS.greenSuccess,
    segmentInactiveColor: 0x5a3e32,
    ratioLabelX: 630,
  },

  // Combo countdown bar (Below Combo Pill)
  timerBar: {
    x: 834,
    y: 368,
    width: 210,
    height: 30,
    radius: 15,
    bgColor: 0x2b1d18,
    borderColor: UI_COLORS.woodDark,
    trackColor: 0x5a3e32,
    fillColor: UI_COLORS.greenSuccess,
    warningColor: UI_COLORS.accentAmber,
    dangerColor: UI_COLORS.dangerCoral,
    labelOffsetX: -75,
    valueOffsetX: 75,
    trackOffsetX: -23,
    trackWidth: 58,
  },

  // Bottom Floating Table Instruction Banner
  instructionBanner: {
    x: 512,
    y: 935,
    width: 480,
    height: 64,
    radius: 32,
    bgColor: 0x3d281e,
    borderColor: UI_COLORS.accentGold,
    alpha: 0.92,
  },

  // Cat Warning Bubble (Near Hole Top-Right)
  warningBubble: {
    x: 620,
    y: 360,
    scale: 1.0,
  },

  // Controls (Pause & Sound buttons)
  controls: {
    pauseX: 928,
    pauseY: 64,
    muteX: 992,
    muteY: 64,
    radius: 24,
    bgColor: UI_COLORS.panelBg,
    borderColor: UI_COLORS.woodDark,
  },
});

/**
 * Creates a complete Cozy Cat Café HUD hierarchy in Phaser Scene
 * @param {Phaser.Scene} scene
 * @param {Object} callbacks
 * @returns {Object} HUD controllers and update functions
 */
export function buildCozyHUD(scene, callbacks = {}) {
  const container = scene.add.container(0, 0).setDepth(UI_DEPTH.HUD);
  const viewportHeight = scene.scale.gameSize?.height ?? 1024;

  // 1. Top Score Pill
  const cfgScore = HUD_LAYOUT_CONFIG.scorePill;
  const hasScoreBar = scene.textures.exists('score_bar');
  const scoreBg = hasScoreBar
    ? scene.add.image(cfgScore.x + cfgScore.width / 2, cfgScore.assetCenterY, 'score_bar')
      .setDisplaySize(cfgScore.width, cfgScore.assetHeight)
    : scene.add.graphics();
  if (!hasScoreBar) {
    scoreBg.fillStyle(cfgScore.shadowColor, 1);
    scoreBg.fillRoundedRect(cfgScore.x + 4, cfgScore.y + 6, cfgScore.width, cfgScore.height, cfgScore.radius);
    scoreBg.fillStyle(cfgScore.bgColor, 1);
    scoreBg.fillRoundedRect(cfgScore.x, cfgScore.y, cfgScore.width, cfgScore.height, cfgScore.radius);
    scoreBg.lineStyle(6, cfgScore.borderColor, 1);
    scoreBg.strokeRoundedRect(cfgScore.x, cfgScore.y, cfgScore.width, cfgScore.height, cfgScore.radius);
    scoreBg.lineStyle(3, 0xffffff, 0.7);
    scoreBg.strokeRoundedRect(cfgScore.x + 9, cfgScore.y + 9, cfgScore.width - 18, cfgScore.height - 18, cfgScore.radius - 9);
  }

  const starIcon = !hasScoreBar && scene.textures.exists('star_icon')
    ? scene.add.image(cfgScore.starX, cfgScore.starY, 'star_icon').setScale(cfgScore.starScale)
    : (!hasScoreBar ? scene.add.text(cfgScore.starX, cfgScore.starY, '★', { fontSize: '32px', color: '#ffcb5c' }).setOrigin(0.5) : null);

  let scoreLabelBg = null;
  let scoreLabel = null;
  if (!hasScoreBar) {
    scoreLabelBg = scene.add.graphics();
    scoreLabelBg.fillStyle(UI_COLORS.beigePill, 1);
    scoreLabelBg.fillRoundedRect(
      cfgScore.labelX - cfgScore.labelWidth / 2,
      cfgScore.labelY - cfgScore.labelHeight / 2,
      cfgScore.labelWidth,
      cfgScore.labelHeight,
      cfgScore.labelHeight / 2,
    );

    scoreLabel = scene.add.text(cfgScore.labelX, cfgScore.labelY, COPY_THAI.hud.scoreLabel, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.hudLabel}px`,
      color: UI_COLORS.textPrimary,
      fontStyle: 'bold',
    }).setOrigin(0.5);
  }

  const scoreValue = scene.add.text(cfgScore.valueX, cfgScore.valueY, '0', {
    fontFamily: UI_FONTS.family,
    fontSize: '40px',
    color: UI_COLORS.textPrimary,
    fontStyle: 'bold',
  }).setOrigin(0.5);

  container.add([scoreBg, starIcon, scoreLabelBg, scoreLabel, scoreValue].filter(Boolean));

  // 2. Center Combo Pill
  const cfgCombo = HUD_LAYOUT_CONFIG.comboPill;
  const comboHud = scene.add.container(0, 0).setVisible(false);
  const comboAssetKeys = Object.freeze({
    2: 'combo_x2',
    3: 'combo_x3',
    4: 'combo_x4',
  });
  const hasComboAssets = Object.values(comboAssetKeys).every((key) => scene.textures.exists(key));
  const comboAsset = hasComboAssets
    ? scene.add.image(cfgCombo.x, cfgCombo.assetY, comboAssetKeys[2])
      .setDisplaySize(cfgCombo.assetWidth, cfgCombo.assetHeight)
    : null;

  let comboBg = null;
  let comboLabel = null;
  let comboValue = null;
  if (comboAsset) {
    comboHud.add(comboAsset);
  } else {
    comboBg = scene.add.graphics();
    comboBg.fillStyle(cfgCombo.bgColor, 0.94);
    comboBg.fillRoundedRect(cfgCombo.x - cfgCombo.width / 2, cfgCombo.y - cfgCombo.height / 2, cfgCombo.width, cfgCombo.height, cfgCombo.radius);
    comboBg.lineStyle(4, cfgCombo.borderColor, 1);
    comboBg.strokeRoundedRect(cfgCombo.x - cfgCombo.width / 2, cfgCombo.y - cfgCombo.height / 2, cfgCombo.width, cfgCombo.height, cfgCombo.radius);

    comboLabel = scene.add.text(cfgCombo.x, cfgCombo.labelY, COPY_THAI.hud.comboLabel, {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.caption}px`,
      color: UI_COLORS.textMuted,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    comboValue = scene.add.text(cfgCombo.x, cfgCombo.valueY, 'x1', {
      fontFamily: UI_FONTS.family,
      fontSize: `${UI_FONTS.sizes.hudValue}px`,
      color: UI_COLORS.textGold,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    comboHud.add([comboBg, comboLabel, comboValue]);
  }
  container.add(comboHud);

  // 3. Hearts Row
  const cfgHearts = HUD_LAYOUT_CONFIG.heartsRow;
  const hasHealthBar = scene.textures.exists('health_bar');
  const heartsBg = hasHealthBar
    ? scene.add.image(cfgHearts.x + cfgHearts.width / 2, cfgHearts.assetCenterY, 'health_bar')
      .setDisplaySize(cfgHearts.width, cfgHearts.assetHeight)
    : scene.add.graphics();
  if (!hasHealthBar) {
    heartsBg.fillStyle(cfgHearts.shadowColor, 1);
    heartsBg.fillRoundedRect(cfgHearts.x + 4, cfgHearts.y + 6, cfgHearts.width, cfgHearts.height, cfgHearts.radius);
    heartsBg.fillStyle(cfgHearts.bgColor, 1);
    heartsBg.fillRoundedRect(cfgHearts.x, cfgHearts.y, cfgHearts.width, cfgHearts.height, cfgHearts.radius);
    heartsBg.lineStyle(6, cfgHearts.borderColor, 1);
    heartsBg.strokeRoundedRect(cfgHearts.x, cfgHearts.y, cfgHearts.width, cfgHearts.height, cfgHearts.radius);
    heartsBg.lineStyle(3, 0xffffff, 0.7);
    heartsBg.strokeRoundedRect(cfgHearts.x + 9, cfgHearts.y + 9, cfgHearts.width - 18, cfgHearts.height - 18, cfgHearts.radius - 9);
  }

  container.add(heartsBg);

  const heartIcons = [];
  for (let i = 0; i < 3; i += 1) {
    const hx = cfgHearts.startX + i * cfgHearts.gap;
    const hy = cfgHearts.yCenter;
    const hImg = scene.textures.exists('heart_full')
      ? scene.add.image(hx, hy, 'heart_full').setScale(cfgHearts.iconScale)
      : scene.add.text(hx, hy, '♥', { fontSize: '32px', color: '#f45b69' }).setOrigin(0.5);
    container.add(hImg);
    heartIcons.push(hImg);
  }

  // 4. 4-Segment Progress Bar
  const cfgProg = HUD_LAYOUT_CONFIG.progressBar;
  const progContainer = scene.add.container(0, 0);

  const progBg = scene.add.graphics();
  progBg.fillStyle(cfgProg.bgColor, 0.88);
  progBg.fillRoundedRect(cfgProg.x - cfgProg.width / 2, cfgProg.y - cfgProg.height / 2, cfgProg.width, cfgProg.height, cfgProg.radius);
  progBg.lineStyle(3, cfgProg.borderColor, 0.8);
  progBg.strokeRoundedRect(cfgProg.x - cfgProg.width / 2, cfgProg.y - cfgProg.height / 2, cfgProg.width, cfgProg.height, cfgProg.radius);

  const progLabel = scene.add.text(cfgProg.x - 30, cfgProg.y, COPY_THAI.hud.progressLabel, {
    fontFamily: UI_FONTS.family,
    fontSize: '17px',
    color: '#fff4dc',
    fontStyle: 'bold',
  }).setOrigin(0.5);

  const progSegments = [];
  const startSegX = cfgProg.x + 38;
  for (let i = 0; i < 4; i += 1) {
    const sx = startSegX + i * (cfgProg.segmentWidth + cfgProg.segmentGap);
    const seg = scene.add.graphics();
    progSegments.push(seg);
    progContainer.add(seg);
  }

  const progRatio = scene.add.text(cfgProg.x + 120, cfgProg.y, '0/4', {
    fontFamily: UI_FONTS.family,
    fontSize: '18px',
    color: '#ffcb5c',
    fontStyle: 'bold',
  }).setOrigin(0.5);

  progContainer.add([progBg, progLabel, progRatio]);
  container.add(progContainer);

  // Function to redraw the 4 progress segments
  function renderProgressSegments(completedCount = 0, totalCount = 4) {
    const safeTotal = Math.max(1, totalCount ?? 4);
    const safeCompleted = Math.min(safeTotal, Math.max(0, completedCount ?? 0));
    const progressRatio = safeCompleted / safeTotal;
    progSegments.forEach((seg, idx) => {
      seg.clear();
      const sx = startSegX - 60 + idx * 28;
      const sy = cfgProg.y - 8;
      const isLit = idx < Math.ceil(progressRatio * progSegments.length);
      seg.fillStyle(isLit ? cfgProg.segmentActiveColor : cfgProg.segmentInactiveColor, 1);
      seg.fillRoundedRect(sx, sy, 22, 16, 6);
      if (isLit) {
        seg.fillStyle(0xffffff, 0.4);
        seg.fillRoundedRect(sx + 2, sy + 2, 18, 5, 3);
      }
    });
    progRatio.setText(`${safeCompleted}/${safeTotal}`);
  }
  renderProgressSegments(0);

  // 5. Cat event countdown bar
  const cfgTimer = HUD_LAYOUT_CONFIG.timerBar;
  const timerContainer = scene.add.container(0, 0);
  const timerBg = scene.add.graphics();
  timerBg.fillStyle(cfgTimer.bgColor, 0.88);
  timerBg.fillRoundedRect(cfgTimer.x - cfgTimer.width / 2, cfgTimer.y - cfgTimer.height / 2, cfgTimer.width, cfgTimer.height, cfgTimer.radius);
  timerBg.lineStyle(3, cfgTimer.borderColor, 0.8);
  timerBg.strokeRoundedRect(cfgTimer.x - cfgTimer.width / 2, cfgTimer.y - cfgTimer.height / 2, cfgTimer.width, cfgTimer.height, cfgTimer.radius);

  const timerLabel = scene.add.text(cfgTimer.x + cfgTimer.labelOffsetX, cfgTimer.y, COPY_THAI.hud.comboTimerLabel, {
    fontFamily: UI_FONTS.family,
    fontSize: '17px',
    color: UI_COLORS.textLight,
    fontStyle: 'bold',
  }).setOrigin(0.5);

  const timerTrack = scene.add.graphics();
  const timerFill = scene.add.graphics();
  const timerValue = scene.add.text(cfgTimer.x + cfgTimer.valueOffsetX, cfgTimer.y, '5 วิ', {
    fontFamily: UI_FONTS.family,
    fontSize: '17px',
    color: UI_COLORS.textGold,
    fontStyle: 'bold',
  }).setOrigin(0.5);

  timerContainer.add([timerBg, timerTrack, timerFill, timerLabel, timerValue]);
  comboHud.add(timerContainer);

  function renderTimer(remainingMs = 0, durationMs = 1) {
    const safeDuration = Math.max(1, durationMs ?? 1);
    const safeRemaining = Math.max(0, Math.min(safeDuration, remainingMs ?? 0));
    const ratio = safeRemaining / safeDuration;
    const trackX = cfgTimer.x + cfgTimer.trackOffsetX;
    const trackY = cfgTimer.y - 8;
    const trackWidth = cfgTimer.trackWidth;

    timerTrack.clear();
    timerTrack.fillStyle(cfgTimer.trackColor, 1);
    timerTrack.fillRoundedRect(trackX, trackY, trackWidth, 16, 8);

    timerFill.clear();
    const fillColor = ratio <= 0.25
      ? cfgTimer.dangerColor
      : ratio <= 0.5
        ? cfgTimer.warningColor
        : cfgTimer.fillColor;
    timerFill.fillStyle(fillColor, 1);
    timerFill.fillRoundedRect(trackX, trackY, trackWidth * ratio, 16, 8);
    if (ratio > 0) {
      timerFill.fillStyle(0xffffff, 0.35);
      timerFill.fillRoundedRect(trackX + 2, trackY + 2, Math.max(0, trackWidth * ratio - 4), 4, 2);
    }
    timerValue.setText(`${Math.ceil(safeRemaining / 1000)} วิ`);
  }

  renderTimer(5000, 5000);

  // 6. Warning Speech Bubble (Replaced by centered warning mark above cat head)
  // Handled by UIManager to avoid duplicate warning marks

  // 7. Bottom Instruction / Toast Banner
  const cfgBanner = {
    ...HUD_LAYOUT_CONFIG.instructionBanner,
    y: viewportHeight - 86,
  };
  const bannerBg = scene.add.graphics();
  bannerBg.fillStyle(cfgBanner.bgColor, cfgBanner.alpha);
  bannerBg.fillRoundedRect(cfgBanner.x - cfgBanner.width / 2, cfgBanner.y - cfgBanner.height / 2, cfgBanner.width, cfgBanner.height, cfgBanner.radius);
  bannerBg.lineStyle(3, cfgBanner.borderColor, 0.9);
  bannerBg.strokeRoundedRect(cfgBanner.x - cfgBanner.width / 2, cfgBanner.y - cfgBanner.height / 2, cfgBanner.width, cfgBanner.height, cfgBanner.radius);

  const bannerText = scene.add.text(cfgBanner.x, cfgBanner.y, COPY_THAI.instructions.promptHold, {
    fontFamily: UI_FONTS.family,
    fontSize: '22px',
    color: '#fff4dc',
    fontStyle: 'bold',
  }).setOrigin(0.5);

  function renderBanner(highlight = false) {
    bannerBg.clear();
    bannerBg.fillStyle(cfgBanner.bgColor, cfgBanner.alpha);
    bannerBg.fillRoundedRect(
      cfgBanner.x - cfgBanner.width / 2,
      cfgBanner.y - cfgBanner.height / 2,
      cfgBanner.width,
      cfgBanner.height,
      cfgBanner.radius,
    );
    bannerBg.lineStyle(3, highlight ? UI_COLORS.dangerCoral : UI_COLORS.accentGold, 0.9);
    bannerBg.strokeRoundedRect(
      cfgBanner.x - cfgBanner.width / 2,
      cfgBanner.y - cfgBanner.height / 2,
      cfgBanner.width,
      cfgBanner.height,
      cfgBanner.radius,
    );
  }

  renderBanner();

  container.add([bannerBg, bannerText]);

  // 8. Pause & Sound Button Controls
  const cfgCtrl = HUD_LAYOUT_CONFIG.controls;

  // Pause button
  const pauseBtn = scene.add.container(cfgCtrl.pauseX, cfgCtrl.pauseY);
  const pauseBg = scene.add.circle(0, 0, cfgCtrl.radius, cfgCtrl.bgColor).setStrokeStyle(3, cfgCtrl.borderColor, 1);
  const pauseIcon = scene.textures.exists('pause_icon')
    ? scene.add.image(0, 0, 'pause_icon').setScale(0.55)
    : scene.add.text(0, 0, '⏸', { fontSize: '20px', color: '#fff4dc' }).setOrigin(0.5);
  pauseBtn.add([pauseBg, pauseIcon]);
  pauseBtn.setSize(cfgCtrl.radius * 2, cfgCtrl.radius * 2).setInteractive({ useHandCursor: true });
  pauseBtn.on('pointerdown', () => callbacks.onPause?.());
  pauseBtn.on('pointerover', () => pauseBtn.setScale(1.08));
  pauseBtn.on('pointerout', () => pauseBtn.setScale(1.0));

  // Sound button
  const soundBtn = scene.add.container(cfgCtrl.muteX, cfgCtrl.muteY);
  const soundBg = scene.add.circle(0, 0, cfgCtrl.radius, cfgCtrl.bgColor).setStrokeStyle(3, cfgCtrl.borderColor, 1);
  const soundIcon = scene.textures.exists('sound_on')
    ? scene.add.image(0, 0, 'sound_on').setScale(0.55)
    : scene.add.text(0, 0, '🔊', { fontSize: '20px', color: '#fff4dc' }).setOrigin(0.5);
  soundBtn.add([soundBg, soundIcon]);
  soundBtn.setSize(cfgCtrl.radius * 2, cfgCtrl.radius * 2).setInteractive({ useHandCursor: true });
  soundBtn.on('pointerdown', () => callbacks.onMute?.());
  soundBtn.on('pointerover', () => soundBtn.setScale(1.08));
  soundBtn.on('pointerout', () => soundBtn.setScale(1.0));

  container.add([pauseBtn, soundBtn]);

  return {
    container,
    setScore(score) {
      scoreValue.setText(String(score));
    },
    setCombo(combo) {
      const normalizedCombo = Math.max(1, Math.min(4, Number(combo) || 1));
      const comboVisible = normalizedCombo >= 2;
      comboHud.setVisible(comboVisible);

      if (comboAsset && comboVisible) {
        comboAsset
          .setTexture(comboAssetKeys[normalizedCombo] ?? comboAssetKeys[4])
          .setScale(1)
          .setDisplaySize(cfgCombo.assetWidth, cfgCombo.assetHeight);
      }

      if (comboValue) {
        comboValue.setText(`x${normalizedCombo}`);
        comboValue.setColor(UI_COLORS.accentGoldHex);
      }

    },
    setHearts(health, maxHealth = 3) {
      heartIcons.forEach((hImg, idx) => {
        const isFull = idx < health;
        if (scene.textures.exists('heart_full') && scene.textures.exists('heart_empty')) {
          hImg.setTexture(isFull ? 'heart_full' : 'heart_empty');
        } else {
          hImg.setText(isFull ? '♥' : '♡');
          hImg.setColor(isFull ? '#f45b69' : '#7b5b50');
        }
      });
    },
    setProgress(activeCount, totalCount = 4) {
      renderProgressSegments(activeCount, totalCount);
    },
    setComboTimer(remainingMs, durationMs) {
      renderTimer(remainingMs, durationMs);
    },
    setWarning(_visible) {
      // Centered warning mark is handled directly above cat's head in UIManager
    },
    setBanner(message, highlight = false) {
      bannerText.setText(message);
      renderBanner(highlight);
    },
    setMuted(muted) {
      if (scene.textures.exists('sound_on') && scene.textures.exists('sound_off')) {
        soundIcon.setTexture(muted ? 'sound_off' : 'sound_on');
      } else {
        soundIcon.setText(muted ? '🔇' : '🔊');
      }
    },
    setVisible(visible) {
      container.setVisible(visible);
    },
  };
}
