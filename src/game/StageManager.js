export class StageManager {
  constructor() {
    this.reset();
  }

  reset() {
    this.status = 'idle';
  }

  start() {
    this.status = 'playing';
  }

  pause() {
    if (this.status === 'playing') this.status = 'paused';
  }

  resume() {
    if (this.status === 'paused') this.status = 'playing';
  }

  clear() {
    this.status = 'clear';
  }

  gameOver() {
    this.status = 'game-over';
  }

  isPlaying() {
    return this.status === 'playing';
  }
}
