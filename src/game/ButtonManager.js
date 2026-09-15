import {
  ASSEMBLY_DEPTH,
  BUTTON_SLOT_IDS,
  BUTTON_SLOT_LAYOUT,
  BUTTON_SLOT_PRESETS,
} from './constants.js';
import { ASSET_KEYS } from './AssetKeys.js';

const BUTTON_COLORS = {
  off: 0xd9a46f,
  on: 0x67b887,
  outline: 0x704c42,
};

export class ButtonManager {
  constructor(scene, config, {
    canActivate = () => true,
    onActivate = () => {},
    worldOffsetY = 0,
  } = {}) {
    this.scene = scene;
    this.config = config;
    this.canActivate = canActivate;
    this.onActivate = onActivate;
    this.worldOffsetY = worldOffsetY;
    this.buttons = [];
    this.activeSlotIds = [];
    this.createButtons();
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
        targetMarker,
        usesTextures,
        hitTarget,
        label,
        activated: false,
        activationCount: 0,
        reactivationCount: 0,
        targeted: false,
      };

      hitTarget.on('pointerdown', () => {
        this.activateButton(index);
      });
      this.layer.add([targetMarker, visual, label, hitTarget]);
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

  activateButton(buttonId) {
    const button = this.buttons[buttonId];
    if (!button || button.activated || !this.canActivate(button)) return false;

    const isReactivation = button.activationCount > 0;
    const reactivationCount = button.reactivationCount;
    button.activated = true;
    button.activationCount += 1;
    if (isReactivation) button.reactivationCount += 1;
    this.renderButton(button);
    this.onActivate({ button, isReactivation, reactivationCount });
    return true;
  }

  update(_delta, active = true) {
    if (active) this.renderAll();
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
    button.targeted = false;
    this.renderButton(button);
    return true;
  }

  getSabotageTarget(excludeSlotId = null) {
    const available = this.buttons.filter(
      (button) => button.activated && button.slotId !== excludeSlotId,
    );
    if (available.length === 0) return null;

    const forcedSlotId = this.config.debug.forceSabotageSlot;
    if (forcedSlotId && available.some((button) => button.slotId === forcedSlotId)) {
      return forcedSlotId;
    }

    const index = this.config.debug.disableRandomness ? 0 : Math.floor(Math.random() * available.length);
    return available[index].slotId;
  }

  isActivated(slotId) {
    return Boolean(this.getButtonBySlotId(slotId)?.activated);
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

  rebuildButtons() {
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
    this.buttons.forEach((button) => {
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

  renderAll() {
    this.buttons.forEach((button) => this.renderButton(button));
  }

  renderButton(button) {
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
      button.visual.setAlpha(1.0);
      button.visual.setScale(button.visual.baseScale * (button.activated ? 1.05 : 1));
    } else {
      const graphics = button.visual;
      graphics.clear();
      graphics.fillStyle(button.activated ? BUTTON_COLORS.on : BUTTON_COLORS.off, 1);
      graphics.fillCircle(button.x, button.y, button.radius);
      graphics.lineStyle(8, BUTTON_COLORS.outline, 1);
      graphics.strokeCircle(button.x, button.y, button.radius);

      if (button.activated) {
        graphics.fillStyle(0xffffff, 0.35);
        graphics.fillCircle(button.x - 14, button.y - 16, 8);
      }
    }
  }
}
