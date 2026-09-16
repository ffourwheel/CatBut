/**
 * CatKub HUD Layout & Component Specifications
 * Visual Direction: Cozy Cat Café
 * Target Canvas: 1024 × 1820 portrait
 */

import { UI_COLORS, UI_FONTS, UI_SPACING, UI_DEPTH } from './UITokens.js';
import { COPY_THAI } from './CopyThai.js';
import { CAT_MOOD_LEVELS } from '../game/MoodManager.js';
import { MOOD_CUE_ICONS } from './MoodCue.js';

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
    y: 216,
    width: 340,
    height: 112,
    radius: 48,
    bgColor: UI_COLORS.creamSoft,
    borderColor: UI_COLORS.woodDeep,
    shadowColor: UI_COLORS.woodDeep,
    assetCenterY: 272,
    assetHeight: 113,
    startX: 172,
    gap: 54,
    yCenter: 272,
    iconScale: 0.39,
  },

  // Objective / Progress Card (Right HUD Column)
  progressBar: {
    x: 830,
    y: 159,
    width: 340,
    height: 78,
    radius: 26,
    bgColor: UI_COLORS.panelBg,
    borderColor: UI_COLORS.panelBorder,
    borderHighlight: 0xffe2b8,
    labelX: 678,
    labelY: 142,
    badgeX: 954,
    badgeY: 142,
    badgeWidth: 62,
    badgeHeight: 28,
    badgeRadius: 14,
    trackX: 678,
    trackY: 175,
    trackWidth: 304,
    trackHeight: 14,
    trackRadius: 7,
    trackBgColor: 0x241711,
    trackBorderColor: 0x5a3e32,
    fillColor: UI_COLORS.greenSuccess,
    fillGlowColor: 0x8ae4a8,
    completeColor: UI_COLORS.accentGold,
  },

  // Combo countdown bar (Below Combo Pill)
  timerBar: {
    x: 830,
    y: 366,
    width: 250,
    height: 38,
    radius: 19,
    bgColor: 0x2b1d18,
    borderColor: UI_COLORS.woodDark,
    trackColor: 0x5a3e32,
    fillColor: UI_COLORS.greenSuccess,
    warningColor: UI_COLORS.accentAmber,
    dangerColor: UI_COLORS.dangerCoral,
    labelOffsetX: -75,
    valueOffsetX: 80,
    trackOffsetX: -20,
    trackWidth: 70,
  },

  // Cat Mood (Below Hearts)
  moodBar: {
    x: 20,
    y: 342,
    width: 320,
    height: 54,
    radius: 24,
    trackX: 146,
    trackY: 366,
    trackWidth: 176,
    trackHeight: 12,
    segmentGap: 5,
  },

  // Bottom Floating Table Instruction Banner
  instructionBanner: {
    x: 512,
    y: 935,
    width: 560,
    height: 74,
    radius: 37,
    bgColor: 0x3d281e,
    borderColor: UI_COLORS.accentGold,
    alpha: 0.94,
    fontSize: 24,
  },

  // Cat Warning Bubble (Near Hole Top-Right)
  warningBubble: {
    x: 620,
    y: 360,
    scale: 1.0,
  },

  // Controls (Pause & Sound buttons)
  controls: {
    pauseX: 876,
    pauseY: 68,
    muteX: 964,
    muteY: 68,
    radius: 36, // Diameter 72px (comfortable mobile touch size)
    iconScale: 0.82,
    bgColor: UI_COLORS.panelBg,
    borderColor: UI_COLORS.panelBorder,
    highlightColor: 0xffe2b8,
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

  // 4. Objective & Dynamic Progress Card
  const cfgProg = HUD_LAYOUT_CONFIG.progressBar;
  const progContainer = scene.add.container(0, 0);

  // Panel background & double border
  const progBg = scene.add.graphics();
  progBg.fillStyle(cfgProg.bgColor, 0.94);
  progBg.fillRoundedRect(cfgProg.x - cfgProg.width / 2, cfgProg.y - cfgProg.height / 2, cfgProg.width, cfgProg.height, cfgProg.radius);
  progBg.lineStyle(3.5, cfgProg.borderColor, 1);
  progBg.strokeRoundedRect(cfgProg.x - cfgProg.width / 2, cfgProg.y - cfgProg.height / 2, cfgProg.width, cfgProg.height, cfgProg.radius);
  progBg.lineStyle(1.5, cfgProg.borderHighlight, 0.28);
  progBg.strokeRoundedRect(cfgProg.x - cfgProg.width / 2 + 4, cfgProg.y - cfgProg.height / 2 + 4, cfgProg.width - 8, cfgProg.height - 8, cfgProg.radius - 4);

  // Objective title ("เปิดปุ่มให้ครบ")
  const progLabel = scene.add.text(cfgProg.labelX, cfgProg.labelY, COPY_THAI.hud.progressLabel, {
    fontFamily: UI_FONTS.family,
    fontSize: '21px',
    color: '#fff4dc',
    fontStyle: 'bold',
  }).setOrigin(0, 0.5);

  // Counter badge background
  const progBadgeBg = scene.add.graphics();
  progBadgeBg.fillStyle(0x271912, 1);
  progBadgeBg.fillRoundedRect(
    cfgProg.badgeX - cfgProg.badgeWidth / 2,
    cfgProg.badgeY - cfgProg.badgeHeight / 2,
    cfgProg.badgeWidth,
    cfgProg.badgeHeight,
    cfgProg.badgeRadius,
  );
  progBadgeBg.lineStyle(1.5, 0x6a4a3a, 1);
  progBadgeBg.strokeRoundedRect(
    cfgProg.badgeX - cfgProg.badgeWidth / 2,
    cfgProg.badgeY - cfgProg.badgeHeight / 2,
    cfgProg.badgeWidth,
    cfgProg.badgeHeight,
    cfgProg.badgeRadius,
  );

  // Counter text ("0/6")
  const progRatio = scene.add.text(cfgProg.badgeX, cfgProg.badgeY, '0/4', {
    fontFamily: UI_FONTS.family,
    fontSize: '20px',
    color: '#ffcb5c',
    fontStyle: 'bold',
  }).setOrigin(0.5);

  // Progress gauge track and fill graphics
  const progTrackGraphics = scene.add.graphics();
  const progFillGraphics = scene.add.graphics();
  const progDividersGraphics = scene.add.graphics();

  // Add elements in strict back-to-front rendering order
  progContainer.add([
    progBg,
    progTrackGraphics,
    progFillGraphics,
    progDividersGraphics,
    progBadgeBg,
    progLabel,
    progRatio,
  ]);
  container.add(progContainer);

  // Function to redraw progress track, dynamic notches, and smooth fill
  function renderProgressSegments(completedCount = 0, totalCount = 4) {
    const safeTotal = Math.max(1, totalCount ?? 4);
    const safeCompleted = Math.min(safeTotal, Math.max(0, completedCount ?? 0));
    const progressRatio = safeCompleted / safeTotal;

    const trackX = cfgProg.trackX;
    const trackY = cfgProg.trackY - cfgProg.trackHeight / 2;
    const trackW = cfgProg.trackWidth;
    const trackH = cfgProg.trackHeight;

    // 1. Draw track
    progTrackGraphics.clear();
    progTrackGraphics.fillStyle(cfgProg.trackBgColor, 1);
    progTrackGraphics.fillRoundedRect(trackX, trackY, trackW, trackH, cfgProg.trackRadius);
    progTrackGraphics.lineStyle(1.5, cfgProg.trackBorderColor, 0.8);
    progTrackGraphics.strokeRoundedRect(trackX, trackY, trackW, trackH, cfgProg.trackRadius);

    // 2. Draw active fill
    progFillGraphics.clear();
    if (safeCompleted > 0) {
      const fillW = Math.max(cfgProg.trackRadius * 2, trackW * progressRatio);
      const isComplete = safeCompleted >= safeTotal;
      progFillGraphics.fillStyle(isComplete ? cfgProg.completeColor : cfgProg.fillColor, 1);
      progFillGraphics.fillRoundedRect(trackX, trackY, fillW, trackH, cfgProg.trackRadius);

      // Inner glossy shine
      progFillGraphics.fillStyle(0xffffff, 0.35);
      progFillGraphics.fillRoundedRect(trackX + 2, trackY + 2, Math.max(0, fillW - 4), Math.floor(trackH / 2) - 2, 3);
    }

    // 3. Draw segment divider notches if more than 1 button
    progDividersGraphics.clear();
    if (safeTotal > 1) {
      for (let i = 1; i < safeTotal; i += 1) {
        const dx = trackX + (trackW / safeTotal) * i;
        progDividersGraphics.lineStyle(2, 0x1b110c, 0.7);
        progDividersGraphics.lineBetween(dx, trackY + 2, dx, trackY + trackH - 2);
      }
    }

    progRatio.setText(`${safeCompleted}/${safeTotal}`);
  }
  renderProgressSegments(0);

  // 5. Cat event countdown bar
  const cfgTimer = HUD_LAYOUT_CONFIG.timerBar;
  const timerContainer = scene.add.container(0, 0);
  const timerBg = scene.add.graphics();
  timerBg.fillStyle(cfgTimer.bgColor, 0.92);
  timerBg.fillRoundedRect(cfgTimer.x - cfgTimer.width / 2, cfgTimer.y - cfgTimer.height / 2, cfgTimer.width, cfgTimer.height, cfgTimer.radius);
  timerBg.lineStyle(3, cfgTimer.borderColor, 0.9);
  timerBg.strokeRoundedRect(cfgTimer.x - cfgTimer.width / 2, cfgTimer.y - cfgTimer.height / 2, cfgTimer.width, cfgTimer.height, cfgTimer.radius);
  timerBg.lineStyle(1.5, 0xffe2b8, 0.25);
  timerBg.strokeRoundedRect(cfgTimer.x - cfgTimer.width / 2 + 3, cfgTimer.y - cfgTimer.height / 2 + 3, cfgTimer.width - 6, cfgTimer.height - 6, cfgTimer.radius - 3);

  const timerLabel = scene.add.text(cfgTimer.x + cfgTimer.labelOffsetX, cfgTimer.y, COPY_THAI.hud.comboTimerLabel, {
    fontFamily: UI_FONTS.family,
    fontSize: '18px',
    color: UI_COLORS.textLight,
    fontStyle: 'bold',
  }).setOrigin(0.5);

  const timerTrack = scene.add.graphics();
  const timerFill = scene.add.graphics();
  const timerValue = scene.add.text(cfgTimer.x + cfgTimer.valueOffsetX, cfgTimer.y, '5 วิ', {
    fontFamily: UI_FONTS.family,
    fontSize: '18px',
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
    const trackY = cfgTimer.y - 9;
    const trackWidth = cfgTimer.trackWidth;

    timerTrack.clear();
    timerTrack.fillStyle(cfgTimer.trackColor, 1);
    timerTrack.fillRoundedRect(trackX, trackY, trackWidth, 18, 9);

    timerFill.clear();
    const fillColor = ratio <= 0.25
      ? cfgTimer.dangerColor
      : ratio <= 0.5
        ? cfgTimer.warningColor
        : cfgTimer.fillColor;
    timerFill.fillStyle(fillColor, 1);
    timerFill.fillRoundedRect(trackX, trackY, trackWidth * ratio, 18, 9);
    if (ratio > 0) {
      timerFill.fillStyle(0xffffff, 0.35);
      timerFill.fillRoundedRect(trackX + 2, trackY + 2, Math.max(0, trackWidth * ratio - 4), 5, 2);
    }
    timerValue.setText(`${Math.ceil(safeRemaining / 1000)} วิ`);
  }

  renderTimer(5000, 5000);

  // 6. Cat Mood Meter
  const cfgMood = HUD_LAYOUT_CONFIG.moodBar;
  const moodContainer = scene.add.container(0, 0);
  const moodBg = scene.add.graphics();
  const moodTrack = scene.add.graphics();
  const moodFill = scene.add.graphics();
  moodBg.fillStyle(UI_COLORS.panelBg, 0.94);
  moodBg.fillRoundedRect(cfgMood.x, cfgMood.y, cfgMood.width, cfgMood.height, cfgMood.radius);
  moodBg.lineStyle(3, UI_COLORS.panelBorder, 0.95);
  moodBg.strokeRoundedRect(cfgMood.x, cfgMood.y, cfgMood.width, cfgMood.height, cfgMood.radius);

  const moodLabel = scene.add.text(cfgMood.x + 16, cfgMood.y + 7, COPY_THAI.hud.moodLabel, {
    fontFamily: UI_FONTS.family,
    fontSize: '16px',
    color: UI_COLORS.textLight,
    fontStyle: 'bold',
  }).setOrigin(0, 0);
  const moodValue = scene.add.text(cfgMood.x + cfgMood.width - 16, cfgMood.y + 7, 'Z ง่วง', {
    fontFamily: UI_FONTS.family,
    fontSize: '16px',
    color: UI_COLORS.greenSuccessHex,
    fontStyle: 'bold',
  }).setOrigin(1, 0);

  moodContainer.add([moodBg, moodTrack, moodFill, moodLabel, moodValue]);
  container.add(moodContainer);

  const moodPresentation = Object.freeze({
    sleepy: { color: UI_COLORS.greenSuccess, hex: UI_COLORS.greenSuccessHex, icon: MOOD_CUE_ICONS.sleepy },
    curious: { color: UI_COLORS.accentGold, hex: UI_COLORS.accentGoldHex, icon: MOOD_CUE_ICONS.curious },
    annoyed: { color: UI_COLORS.accentAmber, hex: UI_COLORS.accentAmberHex, icon: MOOD_CUE_ICONS.annoyed },
    angry: { color: UI_COLORS.dangerCoral, hex: UI_COLORS.dangerCoralHex, icon: MOOD_CUE_ICONS.angry },
  });

  function renderMood(snapshot = {}) {
    const level = snapshot?.level ?? 'sleepy';
    const presentation = moodPresentation[level] ?? moodPresentation.sleepy;
    const levelIndex = Math.max(0, CAT_MOOD_LEVELS.findIndex((moodLevel) => moodLevel.key === level));
    const segmentWidth = (cfgMood.trackWidth - (cfgMood.segmentGap * 3)) / 4;

    moodTrack.clear();
    moodTrack.fillStyle(0x241711, 1);
    for (let index = 0; index < 4; index += 1) {
      const segmentX = cfgMood.trackX + index * (segmentWidth + cfgMood.segmentGap);
      moodTrack.fillRoundedRect(
        segmentX,
        cfgMood.trackY,
        segmentWidth,
        cfgMood.trackHeight,
        cfgMood.trackHeight / 2,
      );
    }

    moodFill.clear();
    moodFill.fillStyle(presentation.color, 1);
    for (let index = 0; index <= levelIndex; index += 1) {
      const segmentX = cfgMood.trackX + index * (segmentWidth + cfgMood.segmentGap);
      moodFill.fillRoundedRect(
        segmentX,
        cfgMood.trackY,
        segmentWidth,
        cfgMood.trackHeight,
        cfgMood.trackHeight / 2,
      );
    }
    const moodLabelText = snapshot?.label
      ?? CAT_MOOD_LEVELS.find((moodLevel) => moodLevel.key === level)?.label
      ?? CAT_MOOD_LEVELS[0].label;
    moodValue.setText(`${presentation.icon} ${moodLabelText}`)
      .setColor(presentation.hex);
  }
  renderMood();

  // 7. Warning Speech Bubble (Replaced by centered warning mark above cat head)
  // Handled by UIManager to avoid duplicate warning marks

  // 7. Bottom Instruction / Toast Banner
  const cfgBanner = {
    ...HUD_LAYOUT_CONFIG.instructionBanner,
    y: viewportHeight - 88,
  };
  const bannerBg = scene.add.graphics();
  bannerBg.fillStyle(cfgBanner.bgColor, cfgBanner.alpha);
  bannerBg.fillRoundedRect(cfgBanner.x - cfgBanner.width / 2, cfgBanner.y - cfgBanner.height / 2, cfgBanner.width, cfgBanner.height, cfgBanner.radius);
  bannerBg.lineStyle(3.5, cfgBanner.borderColor, 0.95);
  bannerBg.strokeRoundedRect(cfgBanner.x - cfgBanner.width / 2, cfgBanner.y - cfgBanner.height / 2, cfgBanner.width, cfgBanner.height, cfgBanner.radius);
  bannerBg.lineStyle(1.5, 0xffe2b8, 0.3);
  bannerBg.strokeRoundedRect(cfgBanner.x - cfgBanner.width / 2 + 5, cfgBanner.y - cfgBanner.height / 2 + 5, cfgBanner.width - 10, cfgBanner.height - 10, cfgBanner.radius - 5);

  const bannerText = scene.add.text(cfgBanner.x, cfgBanner.y, COPY_THAI.instructions.promptTap, {
    fontFamily: UI_FONTS.family,
    fontSize: `${cfgBanner.fontSize}px`,
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
    bannerBg.lineStyle(3.5, highlight ? UI_COLORS.dangerCoral : UI_COLORS.accentGold, 0.95);
    bannerBg.strokeRoundedRect(
      cfgBanner.x - cfgBanner.width / 2,
      cfgBanner.y - cfgBanner.height / 2,
      cfgBanner.width,
      cfgBanner.height,
      cfgBanner.radius,
    );
    bannerBg.lineStyle(1.5, 0xffe2b8, 0.3);
    bannerBg.strokeRoundedRect(
      cfgBanner.x - cfgBanner.width / 2 + 5,
      cfgBanner.y - cfgBanner.height / 2 + 5,
      cfgBanner.width - 10,
      cfgBanner.height - 10,
      cfgBanner.radius - 5,
    );
  }

  renderBanner();

  container.add([bannerBg, bannerText]);

  // 8. Pause & Sound Button Controls (Touch-friendly 72px buttons)
  const cfgCtrl = HUD_LAYOUT_CONFIG.controls;

  // Pause button
  const pauseBtn = scene.add.container(cfgCtrl.pauseX, cfgCtrl.pauseY);
  const pauseBg = scene.add.circle(0, 0, cfgCtrl.radius, cfgCtrl.bgColor)
    .setStrokeStyle(3.5, cfgCtrl.borderColor, 1);
  const pauseHighlight = scene.add.circle(0, 0, cfgCtrl.radius - 4)
    .setStrokeStyle(1.5, cfgCtrl.highlightColor, 0.35);
  const pauseIcon = scene.textures.exists('pause_icon')
    ? scene.add.image(0, 0, 'pause_icon').setScale(cfgCtrl.iconScale)
    : scene.add.text(0, 0, '⏸', { fontSize: '28px', color: '#fff4dc' }).setOrigin(0.5);
  pauseBtn.add([pauseBg, pauseHighlight, pauseIcon]);
  pauseBtn.setSize(cfgCtrl.radius * 2, cfgCtrl.radius * 2).setInteractive({ useHandCursor: true });
  pauseBtn.on('pointerdown', () => {
    scene.tweens.add({ targets: pauseBtn, scale: 0.92, duration: 80, yoyo: true });
    callbacks.onPause?.();
  });
  pauseBtn.on('pointerover', () => scene.tweens.add({ targets: pauseBtn, scale: 1.08, duration: 120 }));
  pauseBtn.on('pointerout', () => scene.tweens.add({ targets: pauseBtn, scale: 1.0, duration: 120 }));

  // Sound button
  const soundBtn = scene.add.container(cfgCtrl.muteX, cfgCtrl.muteY);
  const soundBg = scene.add.circle(0, 0, cfgCtrl.radius, cfgCtrl.bgColor)
    .setStrokeStyle(3.5, cfgCtrl.borderColor, 1);
  const soundHighlight = scene.add.circle(0, 0, cfgCtrl.radius - 4)
    .setStrokeStyle(1.5, cfgCtrl.highlightColor, 0.35);
  const soundIcon = scene.textures.exists('sound_on')
    ? scene.add.image(0, 0, 'sound_on').setScale(cfgCtrl.iconScale)
    : scene.add.text(0, 0, '🔊', { fontSize: '28px', color: '#fff4dc' }).setOrigin(0.5);
  soundBtn.add([soundBg, soundHighlight, soundIcon]);
  soundBtn.setSize(cfgCtrl.radius * 2, cfgCtrl.radius * 2).setInteractive({ useHandCursor: true });
  soundBtn.on('pointerdown', () => {
    scene.tweens.add({ targets: soundBtn, scale: 0.92, duration: 80, yoyo: true });
    callbacks.onMute?.();
  });
  soundBtn.on('pointerover', () => scene.tweens.add({ targets: soundBtn, scale: 1.08, duration: 120 }));
  soundBtn.on('pointerout', () => scene.tweens.add({ targets: soundBtn, scale: 1.0, duration: 120 }));

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
          hImg.setScale(cfgHearts.iconScale);
        } else {
          hImg.setText(isFull ? '♥' : '♡');
          hImg.setColor(isFull ? '#f45b69' : '#7b5b50');
        }
      });
    },
    getHeartImage(index) {
      return heartIcons[index] ?? null;
    },
    setProgress(activeCount, totalCount = 4) {
      renderProgressSegments(activeCount, totalCount);
    },
    setComboTimer(remainingMs, durationMs) {
      renderTimer(remainingMs, durationMs);
    },
    setMood(snapshot) {
      renderMood(snapshot);
    },
    pulseMood(direction = 'up') {
      scene.tweens.add({
        targets: moodContainer,
        scaleX: direction === 'down' ? 0.97 : 1.04,
        scaleY: direction === 'down' ? 0.97 : 1.04,
        duration: direction === 'down' ? 220 : 140,
        ease: 'Back.easeOut',
        yoyo: true,
        onComplete: () => moodContainer.setScale(1),
      });
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
        soundIcon.setScale(cfgCtrl.iconScale);
      } else {
        soundIcon.setText(muted ? '🔇' : '🔊');
      }
    },
    setVisible(visible) {
      container.setVisible(visible);
    },
  };
}
