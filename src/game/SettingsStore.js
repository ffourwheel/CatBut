import { GAME_PRESETS } from '../config/gameConfig.js';

export const SETTINGS_STORAGE_KEY = 'catkub.settings.v1';

export const DEFAULT_SETTINGS = Object.freeze({
  muted: false,
  difficulty: 'normal',
});

function getDefaultStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch (_error) {
    return null;
  }
}

function normalizeSettings(raw = {}) {
  const difficulty = Object.hasOwn(GAME_PRESETS, raw.difficulty)
    ? raw.difficulty
    : DEFAULT_SETTINGS.difficulty;

  return {
    muted: raw.muted === true,
    difficulty,
  };
}

/**
 * Central settings module for UI and gameplay adapters.
 * Persistence is best-effort so the game still works in private browsing or tests.
 */
export class SettingsStore {
  constructor({ storage = getDefaultStorage() } = {}) {
    this.storage = storage;
    this.listeners = new Set();
    this.values = this.load();
  }

  get(key) {
    return this.values[key];
  }

  snapshot() {
    return { ...this.values };
  }

  set(key, value) {
    if (!Object.hasOwn(DEFAULT_SETTINGS, key)) return false;

    const nextValues = normalizeSettings({ ...this.values, [key]: value });
    if (nextValues[key] === this.values[key]) return false;

    this.values = nextValues;
    this.save();
    this.listeners.forEach((listener) => listener(this.snapshot(), key));
    return true;
  }

  subscribe(listener) {
    if (typeof listener !== 'function') return () => {};
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  reset() {
    this.values = normalizeSettings(DEFAULT_SETTINGS);
    this.save();
    this.listeners.forEach((listener) => listener(this.snapshot(), null));
  }

  load() {
    if (!this.storage) return normalizeSettings(DEFAULT_SETTINGS);

    try {
      const saved = JSON.parse(this.storage.getItem(SETTINGS_STORAGE_KEY) ?? '{}');
      return normalizeSettings({ ...DEFAULT_SETTINGS, ...saved });
    } catch (_error) {
      return normalizeSettings(DEFAULT_SETTINGS);
    }
  }

  save() {
    if (!this.storage) return;

    try {
      this.storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.values));
    } catch (_error) {
      // Persistence is optional; keep the in-memory setting active.
    }
  }
}
