export const CAT_MOOD_LEVELS = Object.freeze([
  Object.freeze({ key: 'sleepy', label: 'ง่วง', min: 0 }),
  Object.freeze({ key: 'curious', label: 'สนใจ', min: 25 }),
  Object.freeze({ key: 'annoyed', label: 'หงุดหงิด', min: 50 }),
  Object.freeze({ key: 'angry', label: 'โมโห', min: 75 }),
]);

export class MoodManager {
  constructor(config, onChange = () => {}) {
    this.config = config;
    this.onChange = onChange;
    this.reset();
  }

  reset() {
    this.value = 0;
    this.decayRemaining = this.config.moodDecayDelay;
    this.emitChange({ reason: 'reset', levelChanged: false, direction: null });
  }

  update(delta) {
    if (this.value <= 0 || delta <= 0) return this.snapshot({ levelChanged: false, direction: null });

    this.decayRemaining -= delta;
    if (this.decayRemaining > 0) {
      return this.snapshot({ levelChanged: false, direction: null });
    }

    const overdue = Math.max(0, -this.decayRemaining);
    const interval = Math.max(1, this.config.moodLevelDecayInterval);
    const levelsToDrop = 1 + Math.floor(overdue / interval);
    this.decayRemaining = interval - (overdue % interval);
    return this.setValue(this.valueAfterDecay(levelsToDrop), {
      reason: 'decay',
      direction: 'down',
    });
  }

  valueAfterDecay(levelsToDrop) {
    let value = this.value;
    for (let index = 0; index < levelsToDrop && value > 0; index += 1) {
      const levelIndex = CAT_MOOD_LEVELS.findIndex((level) => level.key === this.getLevelForValue(value).key);
      value = levelIndex > 0 ? (CAT_MOOD_LEVELS[levelIndex - 1].min / 100) * this.config.moodMax : 0;
    }
    return value;
  }

  recordRapidTap() {
    return this.setValue(this.value + this.config.moodRapidTapGain, {
      reason: 'rapid-tap',
      direction: 'up',
    });
  }

  getLevel() {
    return this.getLevelForValue(this.value);
  }

  getLevelForValue(value) {
    const scaledValue = this.config.moodMax > 0
      ? (value / this.config.moodMax) * 100
      : 0;
    return [...CAT_MOOD_LEVELS].reverse().find((level) => scaledValue >= level.min)
      ?? CAT_MOOD_LEVELS[0];
  }

  setValue(value, { reason = 'set', direction = null } = {}) {
    const previousLevelKey = this.getLevel().key;
    this.value = Math.max(0, Math.min(this.config.moodMax, value));
    const level = this.getLevel();
    const levelChanged = level.key !== previousLevelKey;
    if (reason === 'rapid-tap') {
      this.decayRemaining = this.config.moodDecayDelay;
    }
    return this.emitChange({ reason, direction, levelChanged });
  }

  getIntervalScale() {
    const scales = this.config.moodIntervalScaleByLevel ?? {};
    return scales[this.getLevel().key] ?? 1;
  }

  snapshot(extra = {}) {
    const level = this.getLevel();
    return {
      value: this.value,
      max: this.config.moodMax,
      level: level.key,
      label: level.label,
      intervalScale: this.getIntervalScale(),
      ...extra,
    };
  }

  emitChange(extra = {}) {
    const snapshot = this.snapshot(extra);
    this.onChange(snapshot);
    return snapshot;
  }
}
