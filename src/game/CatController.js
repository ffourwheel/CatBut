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
    this.eventResolved = false;
    this.safeRemaining = 0;
    this.cooldownRemaining = 0;
  }

  start() {
    this.running = true;
    this.paused = false;
    this.safeRemaining = 0;
    this.cooldownRemaining = 0;
    this.eventResolved = false;
    this.setState(CAT_STATES.HIDDEN);
    this.scheduleNextEvent();
  }

  stop() {
    this.running = false;
    this.paused = false;
    this.setState(CAT_STATES.HIDDEN);
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
        this.enterHide();
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
      event = randomValue < this.config.watchProbability ? CAT_EVENTS.WATCH : CAT_EVENTS.SABOTAGE;
    }

    if (event === CAT_EVENTS.SABOTAGE) {
      const targetId = this.callbacks.getSabotageTarget?.();
      if (targetId === null || targetId === undefined) {
        this.enterWatch();
        return;
      }
      this.enterSabotage(targetId);
      return;
    }

    this.enterWatch();
  }

  enterWatch() {
    this.setState(CAT_STATES.WATCH);
    this.phaseRemaining = this.config.watchDuration;
    this.callbacks.onWatch?.();
  }

  enterSabotage(targetId) {
    this.eventResolved = true;
    this.setState(CAT_STATES.SABOTAGE);
    this.phaseRemaining = this.config.sabotageDuration;
    this.cooldownRemaining = this.config.sabotageCooldown;
    this.callbacks.onSabotage?.(targetId);
  }

  enterHide() {
    this.setState(CAT_STATES.HIDE);
    this.phaseRemaining = this.config.hideDuration;
  }

  finishEvent() {
    this.setState(CAT_STATES.HIDDEN);
    this.scheduleNextEvent();
  }

  scheduleNextEvent() {
    const range = this.config.catIntervalMax - this.config.catIntervalMin;
    const random = this.config.debug.disableRandomness ? 0 : Math.random();
    const interval = this.config.catIntervalMin + Math.round(range * random);
    this.hiddenRemaining = Math.max(interval, this.cooldownRemaining);
    this.eventResolved = false;
  }

  setState(state) {
    this.state = state;
    this.callbacks.onStateChange?.(state);
  }
}
