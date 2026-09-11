/**
 * CatKub HUD Layout & Component Specifications
 * Visual Direction: Cozy Cat Café
 * Target Canvas: 1024 × 1024
 */

import { UI_COLORS, UI_FONTS, UI_SPACING, UI_DEPTH } from './UITokens.js';
import { COPY_THAI } from './CopyThai.js';

export const HUD_LAYOUT_CONFIG = Object.freeze({
  // Score Pill (Top Left)
  scorePill: {
    x: 48,
    y: 46,
    width: 210,
    height: 68,
    radius: 34,
    bgColor: UI_COLORS.beigePill,
    borderColor: UI_COLORS.panelBorder,
    starX: 84,
    starY: 80,
    labelX: 168,
    labelY: 62,
    valueX: 168,
    valueY: 88,
  },

  // Combo Pill (Top Center)
  comboPill: {
    x: 512,
    y: 72,
    width: 220,
    height: 72,
    radius: 36,
    bgColor: UI_COLORS.panelBg,
    borderColor: UI_COLORS.accentGold,
    labelY: 56,
    valueY: 86,
  },

  // Hearts Container (Top Right)
  heartsRow: {
    x: 770,
    y: 46,
    width: 206,
    height: 68,
    radius: 34,
    bgColor: UI_COLORS.beigePill,
    borderColor: UI_COLORS.panelBorder,
    startX: 827,
    gap: 46,
    yCenter: 80,
  },

  // 4-Segment Progress Bar (Below Combo Pill)
  progressBar: {
    x: 512,
    y: 154,
    width: 320,
    height: 48,
    radius: 24,
    bgColor: UI_COLORS.panelBg,
    borderColor: UI_COLORS.panelBorder,
    labelY: 132,
    segmentWidth: 42,
    segmentHeight: 22,
    segmentGap: 8,
    segmentRadius: 10,
    segmentActiveColor: UI_COLORS.greenSuccess,
    segmentInactiveColor: 0x5a3e32,
    ratioLabelX: 630,
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
    pauseX: 960,
    pauseY: 145,
    muteX: 960,
    muteY: 205,
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
  const scoreBg = scene.add.graphics();
  scoreBg.fillStyle(cfgScore.bgColor, 1);
  scoreBg.fillRoundedRect(cfgScore.x, cfgScore.y, cfgScore.width, cfgScore.height, cfgScore.radius);
  scoreBg.lineStyle(4, cfgScore.borderColor, 1);
  scoreBg.strokeRoundedRect(cfgScore.x, cfgScore.y, cfgScore.width, cfgScore.height, cfgScore.radius);

  const starIcon = scene.textures.exists('star_icon')
    ? scene.add.image(cfgScore.starX, cfgScore.starY, 'star_icon').setScale(0.44)
    : scene.add.text(cfgScore.starX, cfgScore.starY, '★', { fontSize: '32px', color: '#ffcb5c' }).setOrigin(0.5);

  const scoreLabel = scene.add.text(cfgScore.labelX, cfgScore.labelY, COPY_THAI.hud.scoreLabel, {
    fontFamily: UI_FONTS.family,
    fontSize: `${UI_FONTS.sizes.caption}px`,
    color: UI_COLORS.textSecondary,
    fontStyle: 'bold',
  }).setOrigin(0.5);

  const scoreValue = scene.add.text(cfgScore.valueX, cfgScore.valueY, '0', {
    fontFamily: UI_FONTS.family,
    fontSize: `${UI_FONTS.sizes.hudValue}px`,
    color: UI_COLORS.textPrimary,
    fontStyle: 'bold',
  }).setOrigin(0.5);

  container.add([scoreBg, starIcon, scoreLabel, scoreValue]);

  // 2. Center Combo Pill
  const cfgCombo = HUD_LAYOUT_CONFIG.comboPill;
  const comboBg = scene.add.graphics();
  comboBg.fillStyle(cfgCombo.bgColor, 0.94);
  comboBg.fillRoundedRect(cfgCombo.x - cfgCombo.width / 2, cfgCombo.y - cfgCombo.height / 2, cfgCombo.width, cfgCombo.height, cfgCombo.radius);
  comboBg.lineStyle(4, cfgCombo.borderColor, 1);
  comboBg.strokeRoundedRect(cfgCombo.x - cfgCombo.width / 2, cfgCombo.y - cfgCombo.height / 2, cfgCombo.width, cfgCombo.height, cfgCombo.radius);

  const comboLabel = scene.add.text(cfgCombo.x, cfgCombo.labelY, COPY_THAI.hud.comboLabel, {
    fontFamily: UI_FONTS.family,
    fontSize: `${UI_FONTS.sizes.caption}px`,
    color: UI_COLORS.textMuted,
    fontStyle: 'bold',
  }).setOrigin(0.5);

  const comboValue = scene.add.text(cfgCombo.x, cfgCombo.valueY, 'x1', {
    fontFamily: UI_FONTS.family,
    fontSize: `${UI_FONTS.sizes.hudValue}px`,
    color: UI_COLORS.textGold,
    fontStyle: 'bold',
  }).setOrigin(0.5);

  container.add([comboBg, comboLabel, comboValue]);

  // 3. Hearts Row
  const cfgHearts = HUD_LAYOUT_CONFIG.heartsRow;
  const heartsBg = scene.add.graphics();
  heartsBg.fillStyle(cfgHearts.bgColor, 1);
  heartsBg.fillRoundedRect(cfgHearts.x, cfgHearts.y, cfgHearts.width, cfgHearts.height, cfgHearts.radius);
  heartsBg.lineStyle(4, cfgHearts.borderColor, 1);
  heartsBg.strokeRoundedRect(cfgHearts.x, cfgHearts.y, cfgHearts.width, cfgHearts.height, cfgHearts.radius);
  container.add(heartsBg);

  const heartIcons = [];
  for (let i = 0; i < 3; i += 1) {
    const hx = cfgHearts.startX + i * cfgHearts.gap;
    const hy = cfgHearts.yCenter;
    const hImg = scene.textures.exists('heart_full')
      ? scene.add.image(hx, hy, 'heart_full').setScale(0.38)
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

  // 5. Warning Speech Bubble (Replaced by centered warning mark above cat head)
  // Handled by UIManager to avoid duplicate warning marks

  // 6. Bottom Instruction / Toast Banner
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

  // 7. Pause & Sound Button Controls
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
      comboValue.setText(`x${combo}`);
      comboValue.setColor(combo > 1 ? UI_COLORS.accentGoldHex : '#fff4dc');
      if (combo > 1) {
        scene.tweens.add({
          targets: comboValue,
          scale: 1.25,
          duration: 100,
          yoyo: true,
        });
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
