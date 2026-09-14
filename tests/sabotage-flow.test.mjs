import assert from 'node:assert/strict';
import test from 'node:test';

import { createGameConfig } from '../src/config/gameConfig.js';
import { CatController } from '../src/game/CatController.js';

test('sabotage hits the button before the cat enters hide', () => {
  const config = createGameConfig({
    catIntervalMin: 1,
    catIntervalMax: 1,
    warningDuration: 1,
    peekDuration: 1,
    watchDuration: 1,
    attackRecovery: 1,
    sabotagePreviewDuration: 300,
    sabotageDuration: 360,
    hideDuration: 200,
    sabotageCooldown: 1,
    watchProbability: 0,
    catWatchProbabilityAtMaxProgress: 0,
    debug: {
      disableRandomness: true,
      forceCatEvent: 'sabotage',
    },
  });

  let elapsed = 0;
  let sabotageHitAt = Number.POSITIVE_INFINITY;
  let pawTweenKilled = false;
  let buttonClosed = false;

  const cat = new CatController(null, config, {
    onStateChange: (state) => {
      if (state === 'hide') pawTweenKilled = true;
    },
    onSabotage: () => {
      sabotageHitAt = elapsed + config.sabotageHitDuration;
    },
    getSabotageTarget: () => 'slot-1',
  });

  cat.start();
  for (let step = 0; step < 400; step += 1) {
    elapsed += 10;
    cat.update(10);

    if (!pawTweenKilled && elapsed >= sabotageHitAt) {
      buttonClosed = true;
      break;
    }
  }

  assert.equal(buttonClosed, true);
});
