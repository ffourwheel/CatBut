import { CAT_EVENTS, CAT_STATES } from './constants.js';

export class CatController {
  constructor(scene, config, callbacks = {}) {
    this.scene = scene;
    this.config = config;
    this.callbacks = callbacks;
    this.running = false;
    this.paused = false;
    this.state = CAT_STATES.HIDDEN;
    this.phaseRemaining = 0;
    this.hiddenRemaining = 0;
    this.hiddenDuration = 0;
    this.eventResolved = false;
    this.safeRemaining = 0;
    this.cooldownRemaining = 0;
    this.sabotagePhase = 'idle';
    this.sabotageTargetId = null;
  }

  start() {
    this.running = true;
    this.paused = false;
    this.safeRemaining = 0;
    this.cooldownRemaining = 0;
    this.sabotagePhase = 'idle';
    this.sabotageTargetId = null;
    this.eventResolved = false;
    this.setState(CAT_STATES.HIDDEN);
    this.scheduleNextEvent();
  }

  stop() {
    this.running = false;
    this.paused = false;
    this.setState(CAT_STATES.HIDDEN);
    this.sabotagePhase = 'idle';
    this.sabotageTargetId = null;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  suppressFor(duration) {
    this.safeRemaining = Math.max(this.safeRemaining, duration);
  }

  update(delta) {
    if (!this.running || this.paused) return;
    if (this.safeRemaining > 0) {
      this.safeRemaining = Math.max(0, this.safeRemaining - delta);
      return;
    }

    if (this.cooldownRemaining > 0) this.cooldownRemaining = Math.max(0, this.cooldownRemaining - delta);

    if (this.state === CAT_STATES.HIDDEN) {
      this.hiddenRemaining -= delta;
      const pressureInterval = this.getProgressAdjustedInterval(this.config.catIntervalMax);
      this.hiddenRemaining = Math.min(
        this.hiddenRemaining,
        Math.max(this.cooldownRemaining, pressureInterval),
      );
      if (this.hiddenRemaining <= 0) this.enterWarning();
      return;
    }

    this.phaseRemaining -= delta;
    if (this.phaseRemaining > 0) return;

    switch (this.state) {
      case CAT_STATES.WARNING:
        this.enterPeek();
        break;
      case CAT_STATES.PEEK:
        this.chooseEvent();
        break;
      case CAT_STATES.WATCH:
      case CAT_STATES.ATTACK:
      case CAT_STATES.SABOTAGE:
        if (this.state === CAT_STATES.SABOTAGE && this.sabotagePhase === 'preview') {
          this.enterSabotage(this.sabotageTargetId);
        } else {
          this.enterHide();
        }
        break;
      case CAT_STATES.HIDE:
        this.finishEvent();
        break;
      default:
        break;
    }
  }

  onPlayerStartedHold() {
    if (this.state === CAT_STATES.WATCH && !this.eventResolved) this.requestAttack();
  }

  requestAttack() {
    if (this.state !== CAT_STATES.WATCH || this.eventResolved) return false;
    this.eventResolved = true;
    this.setState(CAT_STATES.ATTACK);
    this.phaseRemaining = this.config.attackRecovery;
    this.callbacks.onAttack?.();
    return true;
  }

  enterWarning() {
    this.eventResolved = false;
    this.setState(CAT_STATES.WARNING);
    this.phaseRemaining = this.config.warningDuration;
  }

  enterPeek() {
    this.setState(CAT_STATES.PEEK);
    this.phaseRemaining = this.config.peekDuration;
  }

  chooseEvent() {
    const forced = this.config.debug.forceCatEvent?.toLowerCase?.() ?? null;
    let event = forced;
    if (!event) {
      const randomValue = this.config.debug.disableRandomness ? 0 : Math.random();
      event = randomValue < this.getWatchProbability() ? CAT_EVENTS.WATCH : CAT_EVENTS.SABOTAGE;
    }

    if (event === CAT_EVENTS.SABOTAGE) {
      const targetSlotId = this.callbacks.getSabotageTarget?.();
      if (targetSlotId === null || targetSlotId === undefined) {
        this.enterWatch();
        return;
      }
      this.enterSabotagePreview(targetSlotId);
      return;
    }

    this.enterWatch();
  }

  enterWatch() {
    this.setState(CAT_STATES.WATCH);
    this.phaseRemaining = this.config.watchDuration;
    this.callbacks.onWatch?.();
  }

  enterSabotagePreview(targetSlotId) {
    this.eventResolved = true;
    this.sabotagePhase = 'preview';
    this.sabotageTargetId = targetSlotId;
    this.setState(CAT_STATES.SABOTAGE);
    this.phaseRemaining = this.config.sabotagePreviewDuration;
    this.callbacks.onSabotagePreview?.(targetSlotId);
  }

  enterSabotage(targetSlotId) {
    this.eventResolved = true;
    this.sabotagePhase = 'active';
    this.sabotageTargetId = targetSlotId;
    this.setState(CAT_STATES.SABOTAGE);
    this.phaseRemaining = this.config.sabotageDuration;
    this.cooldownRemaining = this.config.sabotageCooldown;
    this.callbacks.onSabotage?.(targetSlotId);
  }

  enterHide() {
    this.sabotagePhase = 'idle';
    this.setState(CAT_STATES.HIDE);
    this.phaseRemaining = this.config.hideDuration;
  }

  finishEvent() {
    this.setState(CAT_STATES.HIDDEN);
    this.sabotageTargetId = null;
    this.scheduleNextEvent();
  }

  scheduleNextEvent() {
    const range = this.config.catIntervalMax - this.config.catIntervalMin;
    const random = this.config.debug.disableRandomness ? 0 : Math.random();
    const interval = this.config.catIntervalMin + Math.round(range * random);
    this.hiddenDuration = Math.max(this.getProgressAdjustedInterval(interval), this.cooldownRemaining);
    this.hiddenRemaining = this.hiddenDuration;
    this.eventResolved = false;
  }

  getProgressPressure() {
    const progress = this.callbacks.getProgress?.() ?? {};
    const activeCount = Math.max(0, progress.activeCount ?? 0);
    const totalCount = Math.max(0, progress.totalCount ?? 0);
    const denominator = Math.max(1, totalCount - 1);
    return Math.max(0, Math.min(1, activeCount / denominator));
  }

  getProgressAdjustedInterval(interval) {
    const minimumScale = Math.max(0.1, Math.min(1, this.config.catIntervalProgressScaleMin ?? 1));
    const scale = 1 - (1 - minimumScale) * this.getProgressPressure();
    return Math.max(1, Math.round(interval * scale));
  }

  getWatchProbability() {
    const baseProbability = Math.max(0, Math.min(1, this.config.watchProbability ?? 0.6));
    const minimumProbability = Math.max(
      0,
      Math.min(baseProbability, this.config.catWatchProbabilityAtMaxProgress ?? baseProbability),
    );
    return baseProbability - (baseProbability - minimumProbability) * this.getProgressPressure();
  }

  setState(state) {
    this.state = state;
    this.callbacks.onStateChange?.(state);
  }

  getTimerInfo() {
    if (this.state === CAT_STATES.HIDDEN) {
      return {
        remaining: Math.max(0, this.hiddenRemaining),
        duration: Math.max(1, this.hiddenDuration || this.config.catIntervalMax),
      };
    }

    const durationByState = {
      [CAT_STATES.WARNING]: this.config.warningDuration,
      [CAT_STATES.PEEK]: this.config.peekDuration,
      [CAT_STATES.WATCH]: this.config.watchDuration,
      [CAT_STATES.ATTACK]: this.config.attackRecovery,
      [CAT_STATES.SABOTAGE]: this.sabotagePhase === 'preview'
        ? this.config.sabotagePreviewDuration
        : this.config.sabotageDuration,
      [CAT_STATES.HIDE]: this.config.hideDuration,
    };

    return {
      remaining: Math.max(0, this.phaseRemaining),
      duration: Math.max(1, durationByState[this.state] ?? this.config.watchDuration),
    };
  }
}
