import { BUTTON_POSITIONS } from './constants.js';

const BUTTON_COLORS = {
  off: 0xd9a46f,
  holding: 0xf2c14e,
  on: 0x67b887,
  outline: 0x704c42,
  progress: 0xfff4dc,
};

export class ButtonManager {
  constructor(scene, config, { canStartHold = () => true, onComplete = () => {}, onHoldStart = () => {} } = {}) {
    this.scene = scene;
    this.config = config;
    this.canStartHold = canStartHold;
    this.onComplete = onComplete;
    this.onHoldStart = onHoldStart;
    this.buttons = [];
    this.heldButtonId = null;
    this.pointerId = null;
    this.createButtons();
    this.bindPointerEvents();
  }

  createButtons() {
    const count = this.config.debug.forceButtonCount ?? this.config.buttonCount;
    const layer = this.scene.add.container(0, 0).setDepth(40);
    this.layer = layer;

    for (let index = 0; index < count; index += 1) {
      const position = BUTTON_POSITIONS[index % BUTTON_POSITIONS.length];
      const visual = this.scene.add.graphics();
      const hitTarget = this.scene.add.circle(position.x, position.y, 92, 0xffffff, 0.001)
        .setInteractive({ useHandCursor: true });
      const label = this.scene.add.text(position.x, position.y, String(index + 1), {
        color: '#4c3030',
        fontFamily: 'Trebuchet MS, Noto Sans Thai, sans-serif',
        fontSize: '42px',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      const button = {
        id: index,
        x: position.x,
        y: position.y,
        radius: 66,
        visual,
        hitTarget,
        label,
        progress: 0,
        activated: false,
        activationCount: 0,
        reactivationCount: 0,
      };

      hitTarget.on('pointerdown', (pointer) => {
        this.beginHold(index, pointer.id);
      });
      layer.add([visual, label, hitTarget]);
      this.buttons.push(button);
      this.renderButton(button);
    }
  }

  bindPointerEvents() {
    this.scene.input.on('pointerup', (pointer) => this.endPointer(pointer.id));
    this.scene.input.on('pointerupoutside', (pointer) => this.endPointer(pointer.id));
    this.scene.input.on('pointercancel', (pointer) => this.endPointer(pointer.id));
  }

  beginHold(buttonId, pointerId) {
    if (!this.canStartHold() || this.heldButtonId !== null || this.pointerId !== null) return false;

    const button = this.buttons[buttonId];
    if (!button || button.activated) return false;

    this.heldButtonId = buttonId;
    this.pointerId = pointerId;
    this.onHoldStart(button);
    return true;
  }

  endPointer(pointerId) {
    if (this.pointerId !== pointerId) return;
    this.heldButtonId = null;
    this.pointerId = null;
    this.renderAll();
  }

  cancelCurrent() {
    this.heldButtonId = null;
    this.pointerId = null;
    this.renderAll();
  }

  update(delta, active = true) {
    if (!active) return;

    if (this.heldButtonId !== null) {
      const button = this.buttons[this.heldButtonId];
      if (!button || button.activated) {
        this.cancelCurrent();
        return;
      }

      button.progress = Math.min(1, button.progress + delta / this.config.holdDuration);
      if (button.progress >= 1) {
        const isReactivation = button.activationCount > 0;
        const reactivationCount = button.reactivationCount;
        button.activated = true;
        button.activationCount += 1;
        if (isReactivation) button.reactivationCount += 1;
        this.heldButtonId = null;
        this.pointerId = null;
        this.onComplete({ button, isReactivation, reactivationCount });
      }
    }

    this.buttons.forEach((button) => {
      if (!button.activated && button.id !== this.heldButtonId && button.progress > 0) {
        button.progress = Math.max(0, button.progress - delta / this.config.decayDuration);
      }
    });
    this.renderAll();
  }

  sabotage(buttonId) {
    const button = this.buttons[buttonId];
    if (!button || !button.activated) return false;
    button.activated = false;
    button.progress = 0;
    this.renderButton(button);
    return true;
  }

  getSabotageTarget() {
    const heldId = this.heldButtonId;
    const available = this.buttons.filter((button) => button.activated && button.id !== heldId);
    if (available.length === 0) return null;
    const index = this.config.debug.disableRandomness ? 0 : Math.floor(Math.random() * available.length);
    return available[index].id;
  }

  areAllActivated() {
    return this.buttons.length > 0 && this.buttons.every((button) => button.activated);
  }

  isHolding() {
    return this.heldButtonId !== null;
  }

  reset() {
    this.heldButtonId = null;
    this.pointerId = null;
    this.buttons.forEach((button) => {
      button.progress = 0;
      button.activated = false;
      button.activationCount = 0;
      button.reactivationCount = 0;
    });
    this.renderAll();
  }

  setVisible(visible) {
    this.layer?.setVisible(visible);
  }

  getProgress() {
    if (this.heldButtonId === null) return 0;
    return this.buttons[this.heldButtonId]?.progress ?? 0;
  }

  renderAll() {
    this.buttons.forEach((button) => this.renderButton(button));
  }

  renderButton(button) {
    const isHolding = button.id === this.heldButtonId;
    const color = button.activated
      ? BUTTON_COLORS.on
      : isHolding
        ? BUTTON_COLORS.holding
        : BUTTON_COLORS.off;
    const graphics = button.visual;
    graphics.clear();
    graphics.fillStyle(color, 1);
    graphics.fillCircle(button.x, button.y, button.radius);
    graphics.lineStyle(12, BUTTON_COLORS.outline, 1);
    graphics.strokeCircle(button.x, button.y, button.radius);

    if (!button.activated && button.progress > 0) {
      graphics.lineStyle(12, BUTTON_COLORS.progress, 1);
      graphics.beginPath();
      graphics.arc(button.x, button.y, button.radius + 15, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * button.progress, false);
      graphics.strokePath();
    }

    if (button.activated) {
      graphics.fillStyle(0xffffff, 0.35);
      graphics.fillCircle(button.x - 20, button.y - 24, 12);
    }
  }
}
