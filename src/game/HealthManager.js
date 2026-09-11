export class HealthManager {
  constructor(maxHealth, onChange = () => {}) {
    this.maxHealth = maxHealth;
    this.onChange = onChange;
    this.reset();
  }

  reset() {
    this.health = this.maxHealth;
    this.onChange(this.health);
  }

  damage(amount = 1) {
    this.health = Math.max(0, this.health - amount);
    this.onChange(this.health);
    return this.health;
  }

  isEmpty() {
    return this.health <= 0;
  }
}
