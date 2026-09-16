import assert from 'node:assert/strict';
import test from 'node:test';

import { createGameConfig } from '../src/config/gameConfig.js';
import { CatController } from '../src/game/CatController.js';
import { resolveButtonCompletion } from '../src/game/StageFlow.js';

test('the final button clears the stage before a cat reaction can be queued', () => {
  const events = [];

  const result = resolveButtonCompletion({
    allActivated: true,
    slotId: 'slot-4',
    onStageClear: () => events.push('stage-clear'),
    onPlayerActivated: () => events.push('cat-reaction'),
  });

  assert.equal(result, 'stage-clear');
  assert.deepEqual(events, ['stage-clear']);
});

test('a non-final button still forwards its activation to the cat reaction system', () => {
  const events = [];

  const result = resolveButtonCompletion({
    allActivated: false,
    slotId: 'slot-2',
    onStageClear: () => events.push('stage-clear'),
    onPlayerActivated: (slotId) => events.push(`cat-reaction:${slotId}`),
  });

  assert.equal(result, 'cat-reaction');
  assert.deepEqual(events, ['cat-reaction:slot-2']);
});

test('stage clear callback can stop a queued cat action before it runs', () => {
  const cat = new CatController(null, createGameConfig());
  cat.start();
  cat.queuedSabotageSlotId = 'slot-1';
  cat.pendingSabotageAfterGap = true;

  resolveButtonCompletion({
    allActivated: true,
    onStageClear: () => cat.stop(),
    onPlayerActivated: () => assert.fail('cat reaction should be cancelled'),
    slotId: 'slot-4',
  });

  assert.equal(cat.running, false);
  assert.equal(cat.queuedSabotageSlotId, null);
  assert.equal(cat.pendingSabotageAfterGap, false);
});
