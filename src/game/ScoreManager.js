export class ScoreManager {
  constructor(config, onChange = () => {}) {
    this.config = config;
    this.onChange = onChange;
    this.reset();
  }

  reset() {
    this.score = 0;
    this.combo = this.config.comboStart;
    this.onChange(this.snapshot());
  }

  resetCombo() {
    this.combo = this.config.comboStart;
    this.onChange(this.snapshot());
  }

  awardActivation({ isReactivation, reactivationCount = 0 }) {
    const baseScore = isReactivation
      ? Math.max(
          this.config.reactivationFloor,
          this.config.reactivationBaseScore - reactivationCount * this.config.reactivationStep,
        )
      : this.config.newActivationScore;
    const multiplier = this.combo;
    const points = baseScore * multiplier;

    this.score += points;
    this.combo = Math.min(this.config.comboMax, this.combo + 1);
    this.onChange(this.snapshot({ points, baseScore, multiplier, isReactivation }));
    return { points, baseScore, multiplier, isReactivation };
  }

  addBonus(points) {
    this.score += points;
    this.onChange(this.snapshot({ points, bonus: true }));
    return points;
  }

  snapshot(extra = {}) {
    return {
      score: this.score,
      combo: this.combo,
      ...extra,
    };
  }
}
