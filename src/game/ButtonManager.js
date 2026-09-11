import { BUTTON_POSITIONS } from './constants.js';
import { ASSET_KEYS } from './AssetManifest.js';

const BUTTON_COLORS = {
  off: 0xd9a46f,
  holding: 0xf2c14e,
  on: 0x67b887,
  outline: 0x704c42,
  progress: 0xfff4dc,
};

export class ButtonManager {
  constructor(scene, config, {
    canStartHold = () => true,
    onComplete = () => {},
    onHoldStart = () => {},
    onHoldEnd = () => {},
    worldOffsetY = 0,
  } = {}) {
    this.scene = scene;
    this.config = config;
    this.canStartHold = canStartHold;
    this.onComplete = onComplete;
    this.onHoldStart = onHoldStart;
    this.onHoldEnd = onHoldEnd;
    this.worldOffsetY = worldOffsetY;
    this.buttons = [];
    this.heldButtonId = null;
    this.pointerId = null;
    this.createButtons();
    this.bindPointerEvents();
  }

  createButtons() {
    const count = this.config.debug.forceButtonCount ?? this.randomButtonCount();
    const layer = this.scene.add.container(0, 0).setDepth(40);
    this.layer = layer;

    for (let index = 0; index < count; index += 1) {
      const basePosition = BUTTON_POSITIONS[index % BUTTON_POSITIONS.length];
      const position = { x: basePosition.x, y: basePosition.y + this.worldOffsetY };
      const usesTextures = this.scene.textures.exists(ASSET_KEYS.buttons.off);
      const visual = usesTextures
        ? this.scene.add.image(position.x, position.y, ASSET_KEYS.buttons.off).setOrigin(0.5, 0.5).setScale(0.56)
        : this.scene.add.graphics();
      visual.baseScale = 0.56;
      const progressRing = this.scene.add.graphics();
      const hitTarget = this.scene.add.circle(position.x, position.y, 56, 0xffffff, 0.001)
        .setInteractive({ useHandCursor: true });
      const label = this.scene.add.text(position.x, position.y, String(index + 1), {
        color: '#4c3030',
        fontFamily: 'Mali, Trebuchet MS, sans-serif',
        fontSize: '28px',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      label.setVisible(false);

      const button = {
        id: index,
        x: position.x,
        y: position.y,
        radius: 46,
        visual,
        progressRing,
        usesTextures,
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
      layer.add([visual, progressRing, label, hitTarget]);
      this.buttons.push(button);
      this.renderButton(button);
    }
  }

  randomButtonCount() {
    const min = Math.max(1, Math.floor(this.config.buttonCountMin ?? this.config.buttonCount ?? 4));
    const max = Math.max(min, Math.floor(this.config.buttonCountMax ?? min));
    if (this.config.debug.disableRandomness) return min;
    return min + Math.floor(Math.random() * (max - min + 1));
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
    const button = this.buttons[this.heldButtonId];
    if (button) this.onHoldEnd(button);
    this.heldButtonId = null;
    this.pointerId = null;
    this.renderAll();
  }

  cancelCurrent() {
    const button = this.buttons[this.heldButtonId];
    if (button) this.onHoldEnd(button);
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
        this.onHoldEnd(button);
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

  getActivatedCount() {
    return this.buttons.filter((button) => button.activated).length;
  }

  getButtonCount() {
    return this.buttons.length;
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

    if (button.usesTextures) {
      const textureKey = button.activated
        ? ASSET_KEYS.buttons.on
        : ASSET_KEYS.buttons.off;
      button.visual.setTexture(textureKey);

      if (button.activated) {
        button.visual.setAlpha(1.0);
        button.visual.setScale(button.visual.baseScale * 1.05);
      } else if (isHolding) {
        button.visual.setAlpha(1.0);
        button.visual.setScale(button.visual.baseScale * 0.94);
      } else {
        button.visual.setAlpha(1.0);
        button.visual.setScale(button.visual.baseScale);
      }
    } else {
      const color = button.activated
        ? BUTTON_COLORS.on
        : isHolding
          ? BUTTON_COLORS.holding
          : BUTTON_COLORS.off;
      const graphics = button.visual;
      graphics.clear();
      graphics.fillStyle(color, 1);
      graphics.fillCircle(button.x, button.y, button.radius);
      graphics.lineStyle(8, BUTTON_COLORS.outline, 1);
      graphics.strokeCircle(button.x, button.y, button.radius);

      if (button.activated) {
        graphics.fillStyle(0xffffff, 0.35);
        graphics.fillCircle(button.x - 14, button.y - 16, 8);
      }
    }

    const ring = button.progressRing;
    ring.clear();
    if (!button.activated && button.progress > 0) {
      ring.lineStyle(8, 0x4caf50, 1.0);
      ring.beginPath();
      ring.arc(button.x, button.y, button.radius + 10, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * button.progress, false);
      ring.strokePath();

      ring.lineStyle(3, 0xffeb3b, 0.8);
      ring.beginPath();
      ring.arc(button.x, button.y, button.radius + 13, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * button.progress, false);
      ring.strokePath();
    }
  }
}
