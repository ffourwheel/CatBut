import { CAT_STATES, GAME_SCREENS } from './constants.js';

const COLORS = {
  ink: '#4c3030',
  muted: '#7b5b50',
  cream: '#fff4dc',
  panel: 0x6b463c,
  accent: 0xf2c14e,
  green: 0x67b887,
  red: 0xe66b5d,
};

export class UIManager {
  constructor(scene, callbacks = {}) {
    this.scene = scene;
    this.callbacks = callbacks;
    this.screens = new Map();
    this.tutorialReturn = 'start';
    this.createHud();
    this.createScreens();
  }

  createHud() {
    this.hud = this.scene.add.container(0, 0).setDepth(100);
    this.scoreLabel = this.scene.add.text(54, 42, 'คะแนน 0', this.textStyle(30, COLORS.ink, true));
    this.comboLabel = this.scene.add.text(54, 82, 'คอมโบ x1', this.textStyle(24, COLORS.muted));
    this.heartsLabel = this.scene.add.text(54, 124, 'หัวใจ ♥♥♥', this.textStyle(25, COLORS.red, true));
    this.progressLabel = this.scene.add.text(512, 930, 'กดค้างไว้', this.textStyle(24, COLORS.ink, true)).setOrigin(0.5);
    this.statusLabel = this.scene.add.text(512, 178, '', this.textStyle(30, COLORS.ink, true)).setOrigin(0.5);
    this.pauseButton = this.createTextButton(886, 56, 'พัก', () => this.callbacks.onPause?.(), 25);
    this.muteButton = this.createTextButton(886, 102, 'เสียง', () => this.callbacks.onMute?.(), 22);
    this.hud.add([this.scoreLabel, this.comboLabel, this.heartsLabel, this.progressLabel, this.statusLabel, this.pauseButton, this.muteButton]);
  }

  createScreens() {
    this.screens.set(GAME_SCREENS.START, this.createStartScreen());
    this.screens.set(GAME_SCREENS.TUTORIAL, this.createTutorialScreen());
    this.screens.set(GAME_SCREENS.PAUSE, this.createPauseScreen());
    this.screens.set(GAME_SCREENS.STAGE_CLEAR, this.createResultScreen(true));
    this.screens.set(GAME_SCREENS.GAME_OVER, this.createResultScreen(false));
  }

  createStartScreen() {
    const screen = this.createScreenContainer();
    screen.add(this.panel());
    screen.add(this.scene.add.text(512, 280, 'CatKub', this.textStyle(76, COLORS.cream, true)).setOrigin(0.5));
    screen.add(this.scene.add.text(512, 370, 'กดปุ่มให้ครบ ระวังแมว!', this.textStyle(30, COLORS.cream)).setOrigin(0.5));
    screen.add(this.scene.add.text(512, 460, 'เกมกดค้างแบบแอบ ๆ ในคาเฟ่แมว', this.textStyle(22, '#f8dfc1')).setOrigin(0.5));
    screen.add(this.createTextButton(512, 620, 'เริ่มเกม', () => this.showTutorial('start'), 32, COLORS.accent));
    screen.add(this.scene.add.text(512, 710, 'ใช้เมาส์หรือแตะปุ่มค้างไว้ให้เต็ม', this.textStyle(20, '#f8dfc1')).setOrigin(0.5));
    return screen;
  }

  createTutorialScreen() {
    const screen = this.createScreenContainer();
    screen.add(this.panel());
    this.tutorialTitle = this.scene.add.text(512, 270, 'วิธีเล่น', this.textStyle(54, COLORS.cream, true)).setOrigin(0.5);
    this.tutorialBody = this.scene.add.text(512, 430, '', {
      ...this.textStyle(28, COLORS.cream),
      align: 'center',
      wordWrap: { width: 660 },
      lineSpacing: 12,
    }).setOrigin(0.5);
    screen.add([this.tutorialTitle, this.tutorialBody]);
    screen.add(this.createTextButton(386, 700, 'ข้าม', () => this.finishTutorial(), 25));
    this.tutorialNext = this.createTextButton(638, 700, 'ถัดไป', () => this.advanceTutorial(), 25, COLORS.accent);
    screen.add(this.tutorialNext);
    return screen;
  }

  createPauseScreen() {
    const screen = this.createScreenContainer();
    screen.add(this.panel());
    screen.add(this.scene.add.text(512, 290, 'พักก่อนนะ', this.textStyle(54, COLORS.cream, true)).setOrigin(0.5));
    screen.add(this.createTextButton(512, 470, 'เล่นต่อ', () => this.callbacks.onResume?.(), 30, COLORS.green));
    screen.add(this.createTextButton(512, 570, 'ดูวิธีเล่น', () => this.showTutorial('pause'), 26));
    screen.add(this.createTextButton(512, 670, 'เริ่มใหม่', () => this.callbacks.onRestart?.(), 26, COLORS.accent));
    return screen;
  }

  createResultScreen(isClear) {
    const screen = this.createScreenContainer();
    screen.add(this.panel());
    const title = this.scene.add.text(512, 285, isClear ? 'เปิดครบแล้ว!' : 'โดนจับแล้ว!', this.textStyle(58, COLORS.cream, true)).setOrigin(0.5);
    const message = this.scene.add.text(512, 405, '', {
      ...this.textStyle(28, COLORS.cream),
      align: 'center',
    }).setOrigin(0.5);
    const retry = this.createTextButton(512, 610, 'เล่นอีกครั้ง', () => this.callbacks.onRestart?.(), 29, isClear ? COLORS.green : COLORS.accent);
    const home = this.createTextButton(512, 720, 'หน้าแรก', () => this.callbacks.onHome?.(), 24);
    screen.add([title, message, retry, home]);
    screen.resultMessage = message;
    return screen;
  }

  createScreenContainer() {
    return this.scene.add.container(0, 0).setDepth(200).setVisible(false);
  }

  panel() {
    return this.scene.add.rectangle(512, 512, 840, 760, COLORS.panel, 0.96).setStrokeStyle(8, 0xb57c56, 1);
  }

  createTextButton(x, y, text, onClick, fontSize = 28, background = null) {
    const label = this.scene.add.text(x, y, text, {
      ...this.textStyle(fontSize, COLORS.ink, true),
      backgroundColor: background === null ? '#f8dfc1' : `#${background.toString(16).padStart(6, '0')}`,
      padding: { left: 28, right: 28, top: 16, bottom: 16 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    label.on('pointerdown', () => onClick());
    label.on('pointerover', () => label.setScale(1.04));
    label.on('pointerout', () => label.setScale(1));
    return label;
  }

  textStyle(fontSize, color, bold = false) {
    return {
      color,
      fontFamily: 'Trebuchet MS, Noto Sans Thai, sans-serif',
      fontSize: `${fontSize}px`,
      fontStyle: bold ? 'bold' : 'normal',
    };
  }

  show(screenName) {
    this.screens.forEach((screen, name) => screen.setVisible(name === screenName));
    const gameplay = screenName === GAME_SCREENS.GAMEPLAY;
    this.hud.setVisible(gameplay);
    this.pauseButton.setVisible(gameplay);
    this.muteButton.setVisible(gameplay);
    this.progressLabel.setVisible(gameplay);
    this.statusLabel.setVisible(gameplay);
  }

  showStart() {
    this.show(GAME_SCREENS.START);
  }

  showTutorial(returnTo = 'start') {
    this.tutorialReturn = returnTo;
    this.tutorialStep = 0;
    this.renderTutorialStep();
    this.show(GAME_SCREENS.TUTORIAL);
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
    if (this.tutorialReturn === 'pause') this.callbacks.onTutorialReturn?.();
    else this.callbacks.onTutorialComplete?.();
  }

  renderTutorialStep() {
    const steps = [
      'เลือกปุ่ม แล้วกดค้างไว้\nจนวงแหวนเต็มเพื่อเปิดปุ่ม',
      'ถ้าเห็นแมวเริ่มโผล่\nปล่อยปุ่มเพื่อหลบสายตา',
      'เปิดให้ครบทั้งสี่ก่อนหัวใจจะหมด\nแต่อย่าลืมระวังแมวแกล้งปิดปุ่ม',
    ];
    this.tutorialBody.setText(steps[this.tutorialStep]);
    this.tutorialNext.setText(this.tutorialStep >= 2 ? 'เริ่มเล่น' : 'ถัดไป');
  }

  updateStats({ score, combo, health, maxHealth = 3, progress, muted, catState }) {
    this.scoreLabel.setText(`คะแนน ${score}`);
    this.comboLabel.setText(`คอมโบ x${combo}`);
    this.heartsLabel.setText(`หัวใจ ${'♥'.repeat(health)}${'♡'.repeat(Math.max(0, maxHealth - health))}`);
    this.progressLabel.setText(progress > 0 ? `กำลังเปิด ${Math.round(progress * 100)}%` : 'กดค้างไว้');
    this.muteButton.setText(muted ? 'เสียงปิด' : 'เสียงเปิด');
    if (catState === CAT_STATES.WARNING || catState === CAT_STATES.PEEK) {
      this.statusLabel.setText('ระวัง! แมวกำลังมองมา');
    } else if (catState === CAT_STATES.WATCH) {
      this.statusLabel.setText('แมวกำลังจับตาดู!');
    }
  }

  setStatus(message) {
    this.statusLabel.setText(message);
  }

  setResultMessage(screenName, message) {
    const screen = this.screens.get(screenName);
    screen?.resultMessage?.setText(message);
  }
}
