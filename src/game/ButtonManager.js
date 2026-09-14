import {
  ASSEMBLY_DEPTH,
  BUTTON_SLOT_IDS,
  BUTTON_SLOT_LAYOUT,
  BUTTON_SLOT_PRESETS,
} from './constants.js';
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
    this.activeSlotIds = [];
    this.createButtons();
    this.bindPointerEvents();
  }

  createButtons() {
    const previousCount = this.buttons?.length || null;
    const activeSlotIds = this.resolveActiveSlotIds(previousCount);
    this.activeSlotIds = activeSlotIds;
    if (!this.layer) {
      this.layer = this.scene.add.container(0, 0).setDepth(ASSEMBLY_DEPTH.BUTTONS);
    }

    activeSlotIds.forEach((slotId, index) => {
      const basePosition = BUTTON_SLOT_LAYOUT.find((slot) => slot.id === slotId);
      if (!basePosition) return;
      const position = { x: basePosition.x, y: basePosition.y + this.worldOffsetY };
      const usesTextures = this.scene.textures.exists(ASSET_KEYS.buttons.off);
      const visual = usesTextures
        ? this.scene.add.image(position.x, position.y, ASSET_KEYS.buttons.off).setOrigin(0.5, 0.5).setScale(0.56)
        : this.scene.add.graphics();
      visual.baseScale = 0.56;
      const progressRing = this.scene.add.graphics();
      const targetMarker = this.scene.add.graphics();
      const hitTarget = this.scene.add.circle(position.x, position.y, 60, 0xffffff, 0.001)
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
        slotId,
        x: position.x,
        y: position.y,
        radius: 46,
        visual,
        progressRing,
        targetMarker,
        usesTextures,
        hitTarget,
        label,
        progress: 0,
        activated: false,
        activationCount: 0,
        reactivationCount: 0,
        targeted: false,
      };

      hitTarget.on('pointerdown', (pointer) => {
        this.beginHold(index, pointer.id);
      });
      this.layer.add([targetMarker, visual, progressRing, label, hitTarget]);
      this.buttons.push(button);
      this.renderButton(button);
    });
  }

  resolveActiveSlotIds(previousCount = null) {
    const forcedSet = this.config.debug.forceButtonSet;
    if (Array.isArray(forcedSet) && forcedSet.length > 0) {
      return this.normalizeSlotIds(forcedSet);
    }

    const configuredSet = this.config.buttonSet;
    if (Array.isArray(configuredSet) && configuredSet.length > 0) {
      return this.normalizeSlotIds(configuredSet);
    }

    const count = this.config.debug.forceButtonCount ?? this.randomButtonCount(previousCount);
    const preset = this.config.buttonSetPresets?.[count] ?? BUTTON_SLOT_PRESETS[count];
    return this.normalizeSlotIds(preset ?? BUTTON_SLOT_IDS.slice(0, count));
  }

  normalizeSlotIds(slotIds) {
    const validSlotIds = new Set(BUTTON_SLOT_IDS);
    return [...new Set(slotIds)]
      .filter((slotId) => validSlotIds.has(slotId))
      .slice(0, BUTTON_SLOT_IDS.length);
  }

  randomButtonCount(previousCount = null) {
    const min = Math.max(1, Math.floor(this.config.buttonCountMin ?? this.config.buttonCount ?? 4));
    const max = Math.max(min, Math.floor(this.config.buttonCountMax ?? min));
    if (this.config.debug.disableRandomness || min === max) return min;

    let count = min + Math.floor(Math.random() * (max - min + 1));
    if (previousCount !== null && max > min && count === previousCount) {
      count = min + Math.floor(Math.random() * (max - min + 1));
    }
    return count;
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

  getButtonBySlotId(slotId) {
    return this.buttons.find((button) => button.slotId === slotId) ?? null;
  }

  setSabotageTarget(slotId) {
    this.buttons.forEach((button) => {
      button.targeted = Boolean(slotId && button.slotId === slotId);
    });
    this.renderAll();
    return this.getButtonBySlotId(slotId);
  }

  clearSabotageTarget() {
    this.buttons.forEach((button) => {
      button.targeted = false;
    });
    this.renderAll();
  }

  sabotage(slotId) {
    const button = this.getButtonBySlotId(slotId);
    if (!button || !button.activated) return false;
    button.activated = false;
    button.progress = 0;
    button.targeted = false;
    this.renderButton(button);
    return true;
  }

  getSabotageTarget() {
    const heldId = this.heldButtonId;
    const available = this.buttons.filter((button) => button.activated && button.id !== heldId);
    if (available.length === 0) return null;

    const forcedSlotId = this.config.debug.forceSabotageSlot;
    if (forcedSlotId && available.some((button) => button.slotId === forcedSlotId)) {
      return forcedSlotId;
    }

    const index = this.config.debug.disableRandomness ? 0 : Math.floor(Math.random() * available.length);
    return available[index].slotId;
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

  rebuildButtons() {
    this.cancelCurrent();
    if (this.layer) {
      this.layer.removeAll(true);
    }
    this.buttons = [];
    this.createButtons();
  }

  reset({ randomize = false } = {}) {
    if (randomize) {
      this.rebuildButtons();
      return;
    }
    this.heldButtonId = null;
    this.pointerId = null;
    this.buttons.forEach((button) => {
      button.progress = 0;
      button.activated = false;
      button.activationCount = 0;
      button.reactivationCount = 0;
      button.targeted = false;
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

    const marker = button.targetMarker;
    marker.clear();
    marker.setVisible(button.targeted);
    if (button.targeted) {
      marker.fillStyle(0xffcb5c, 0.16);
      marker.fillCircle(button.x, button.y, 78);
      marker.lineStyle(10, 0xffcb5c, 1);
      marker.strokeCircle(button.x, button.y, 76);
      marker.lineStyle(4, 0xfff4dc, 0.8);
      marker.strokeCircle(button.x, button.y, 86);
    }

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
