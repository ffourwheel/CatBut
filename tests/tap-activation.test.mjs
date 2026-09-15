import assert from 'node:assert/strict';
import test from 'node:test';

import { createGameConfig } from '../src/config/gameConfig.js';
import { ButtonManager } from '../src/game/ButtonManager.js';
import { CatController } from '../src/game/CatController.js';
import { ScoreManager } from '../src/game/ScoreManager.js';

function createButtonManager({ canActivate = () => true, onActivate = () => {} } = {}) {
  const manager = Object.create(ButtonManager.prototype);
  manager.config = createGameConfig({
    debug: { disableRandomness: true },
  });
  manager.canActivate = canActivate;
  manager.onActivate = onActivate;
  manager.buttons = [
    {
      id: 0,
      slotId: 'slot-1',
      activated: false,
      activationCount: 0,
      reactivationCount: 0,
      targeted: false,
    },
    {
      id: 1,
      slotId: 'slot-2',
      activated: false,
      activationCount: 0,
      reactivationCount: 0,
      targeted: false,
    },
  ];
  manager.renderButton = () => {};
  manager.renderAll = () => {};
  return manager;
}

test('tap activates a button immediately without an update or pointer release', () => {
  const activations = [];
  const manager = createButtonManager({
    onActivate: (result) => activations.push(result),
  });

  assert.equal(manager.activateButton(0), true);
  assert.equal(manager.buttons[0].activated, true);
  assert.equal(manager.buttons[0].activationCount, 1);
  assert.equal(activations.length, 1);
  assert.equal(manager.areAllActivated(), false);

  manager.update(5000);
  assert.equal(manager.buttons[0].activated, true);
});

test('sabotage targeting excludes the button just activated when another target exists', () => {
  const manager = createButtonManager();
  manager.buttons[0].activated = true;
  manager.buttons[1].activated = true;

  assert.equal(manager.getSabotageTarget('slot-2'), 'slot-1');
});

test('a rejected tap does not activate a button', () => {
  let canActivateCalls = 0;
  const manager = createButtonManager({
    canActivate: () => {
      canActivateCalls += 1;
      return false;
    },
  });

  assert.equal(manager.activateButton(0), false);
  assert.equal(canActivateCalls, 1);
  assert.equal(manager.buttons[0].activated, false);
});

test('a tap during WATCH triggers attack and does not activate the button', () => {
  let attackCount = 0;
  const cat = new CatController(null, createGameConfig(), {
    onAttack: () => {
      attackCount += 1;
    },
  });
  cat.start();
  cat.enterWatch();

  const manager = createButtonManager({
    canActivate: () => {
      if (cat.state === 'watch') {
        cat.requestAttack();
        return false;
      }
      return true;
    },
  });

  assert.equal(manager.activateButton(0), false);
  assert.equal(cat.state, 'attack');
  assert.equal(attackCount, 1);
  assert.equal(manager.buttons[0].activated, false);
});

test('tap pressure can start a cat sabotage reaction when the random roll allows it', () => {
  const config = createGameConfig({
    sabotagePreviewDuration: 300,
    tapReactionProbability: 1,
    debug: { disableRandomness: true },
  });
  const previews = [];
  const cat = new CatController(null, config, {
    onSabotagePreview: (slotId) => previews.push(slotId),
    getSabotageTarget: (excludedSlotId) => excludedSlotId === 'slot-2' ? 'slot-1' : null,
  });

  cat.start();
  assert.equal(cat.onPlayerActivated('slot-2'), true);
  assert.equal(cat.state, 'sabotage');
  assert.equal(cat.sabotagePhase, 'preview');
  assert.equal(cat.sabotageTargetId, 'slot-1');
  assert.deepEqual(previews, ['slot-1']);
});

test('a second reaction waits until the current sabotage action finishes', () => {
  const config = createGameConfig({
    sabotagePreviewDuration: 50,
    sabotageDuration: 100,
    hideDuration: 50,
    tapReactionProbability: 1,
    debug: { disableRandomness: true },
  });
  const previews = [];
  const cat = new CatController(null, config, {
    onSabotagePreview: (slotId) => previews.push(slotId),
    getSabotageTarget: (excludedSlotId) => excludedSlotId === 'slot-2' ? 'slot-1' : 'slot-2',
    isSabotageTargetAvailable: () => true,
  });

  cat.start();
  cat.onPlayerActivated('slot-2');
  cat.onPlayerActivated('slot-3');
  assert.equal(cat.queuedSabotageSlotId, 'slot-2');

  cat.update(50);
  cat.update(100);
  cat.update(50);

  assert.equal(cat.state, 'sabotage');
  assert.equal(cat.sabotagePhase, 'preview');
  assert.equal(cat.sabotageTargetId, 'slot-2');
  assert.deepEqual(previews, ['slot-1', 'slot-2']);
});

test('a tap does not always trigger a cat action', () => {
  const config = createGameConfig({
    tapReactionProbability: 0,
    debug: { disableRandomness: true },
  });
  const cat = new CatController(null, config, {
    getSabotageTarget: () => 'slot-1',
  });

  cat.start();
  assert.equal(cat.onPlayerActivated('slot-2'), false);
  assert.equal(cat.state, 'hidden');
});

test('two rapid taps force a sabotage reaction even when normal tap pressure misses', () => {
  const config = createGameConfig({
    tapReactionProbability: 0,
    rapidTapThreshold: 2,
    rapidTapWindow: 500,
    debug: { disableRandomness: false },
  });
  const cat = new CatController(null, config, {
    getSabotageTarget: () => 'slot-1',
  });

  cat.start();
  assert.equal(cat.onPlayerActivated('slot-2'), false);
  assert.equal(cat.onPlayerActivated('slot-3'), true);
  assert.equal(cat.state, 'sabotage');
  assert.equal(cat.sabotageTargetId, 'slot-1');
});

test('combo expires after two seconds without another activation', () => {
  const config = createGameConfig({ comboDuration: 2000 });
  const score = new ScoreManager(config);

  score.awardActivation({ isReactivation: false });
  assert.equal(score.combo, 2);
  score.update(1999);
  assert.equal(score.combo, 2);
  score.update(1);
  assert.equal(score.combo, 1);
});
