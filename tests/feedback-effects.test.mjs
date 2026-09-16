import assert from 'node:assert/strict';
import test from 'node:test';

import { FEEDBACK_EFFECTS, FeedbackFX } from '../src/ui/FeedbackEffects.js';

function createScratchHarness() {
  const tweens = [];
  const rectangles = [];
  const images = [];
  const makeDisplayObject = (object) => ({
    ...object,
    setAlpha(value) {
      this.alpha = value;
      return this;
    },
    setDepth(value) {
      this.depth = value;
      return this;
    },
    setOrigin() { return this; },
    setScale(value) {
      this.scale = value;
      return this;
    },
    setFrame(value) {
      this.frame = value;
      return this;
    },
    destroy() { this.destroyed = true; },
  });

  const scene = {
    scale: { gameSize: { height: 1024 } },
    textures: { exists: () => true },
    add: {
      rectangle: (_x, _y, _width, _height, color, fillAlpha) => {
        const rectangle = makeDisplayObject({ color, fillAlpha, alpha: 1 });
        rectangles.push(rectangle);
        return rectangle;
      },
      image: () => {
        const image = makeDisplayObject({});
        images.push(image);
        return image;
      },
    },
    time: {
      addEvent: () => ({ remove() {} }),
      delayedCall: () => {},
    },
    tweens: {
      add: (config) => {
        tweens.push(config);
        return config;
      },
    },
  };

  return { scene, tweens, rectangles, images };
}

test('claw cutscene vignette uses a visible fill while fading its object alpha', () => {
  const harness = createScratchHarness();

  FeedbackFX.triggerClawScratch(harness.scene);

  assert.equal(harness.rectangles.length, 1);
  assert.equal(harness.rectangles[0].fillAlpha, 1);
  assert.equal(harness.tweens[0].targets, harness.rectangles[0]);
  assert.deepEqual(harness.tweens[0].alpha, { from: 0, to: FEEDBACK_EFFECTS.catAttack.clawScratch.overlayAlpha });
});
