import assert from 'node:assert/strict';
import test from 'node:test';

import { createGameConfig } from '../src/config/gameConfig.js';
import { ButtonManager } from '../src/game/ButtonManager.js';

function createMockScene() {
  const handler = {
    get(target, prop) {
      if (prop in target) return target[prop];
      return () => dummyProxy;
    },
  };
  const dummyProxy = new Proxy({}, handler);

  return {
    textures: {
      exists: () => false,
    },
    add: new Proxy({}, {
      get: () => () => dummyProxy,
    }),
    input: {
      on: () => {},
    },
  };
}

test('ButtonManager tracks active hold progress and decaying progress accurately', () => {
  const config = createGameConfig({
    holdDuration: 1000,
    decayDuration: 2800,
    buttonCount: 4,
  });

  const scene = createMockScene();
  const manager = new ButtonManager(scene, config, {
    canStartHold: () => true,
  });

  // 1. Initially 0
  assert.deepEqual(manager.getActiveHoldProgress(), {
    progress: 0,
    isHolding: false,
    buttonId: null,
  });

  // 2. Begin hold on button 0
  const started = manager.beginHold(0, 1);
  assert.equal(started, true);

  // Advance 500ms -> 50% progress
  manager.update(500, true);
  const midHold = manager.getActiveHoldProgress();
  assert.equal(midHold.isHolding, true);
  assert.equal(midHold.buttonId, 0);
  assert.ok(Math.abs(midHold.progress - 0.5) < 0.01);

  // 3. Release pointer -> decay starts
  manager.endPointer(1);
  const released = manager.getActiveHoldProgress();
  assert.equal(released.isHolding, false);
  assert.equal(released.buttonId, 0);
  assert.ok(Math.abs(released.progress - 0.5) < 0.01);

  // Advance 700ms (1/4 of decay duration 2800ms)
  // Progress should drop by ~0.25, leaving ~0.25
  manager.update(700, true);
  const midDecay = manager.getActiveHoldProgress();
  assert.equal(midDecay.isHolding, false);
  assert.equal(midDecay.buttonId, 0);
  assert.ok(Math.abs(midDecay.progress - 0.25) < 0.02, `Expected ~0.25 progress, got ${midDecay.progress}`);

  // Advance another 1000ms -> drops to 0
  manager.update(1000, true);
  const decayed = manager.getActiveHoldProgress();
  assert.equal(decayed.isHolding, false);
  assert.equal(decayed.progress, 0);
  assert.equal(decayed.buttonId, null);
});
