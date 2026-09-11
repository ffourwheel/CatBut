export class AudioManager {
  constructor() {
    this.muted = false;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  play(_cue) {
    if (this.muted) return;
    // Audio hooks are intentionally quiet until AI-2 supplies the sound assets.
  }
}
