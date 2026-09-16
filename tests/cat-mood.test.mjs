import test from 'node:test';
import assert from 'node:assert/strict';

import { createGameConfig } from '../src/config/gameConfig.js';
import { CatController } from '../src/game/CatController.js';
import { MoodManager } from '../src/game/MoodManager.js';

test('rapid taps raise mood through the four readable levels', () => {
  const mood = new MoodManager(createGameConfig());

  assert.equal(mood.snapshot().level, 'sleepy');
  mood.recordRapidTap();
  assert.equal(mood.snapshot().level, 'annoyed');
  mood.recordRapidTap();
  assert.equal(mood.snapshot().level, 'angry');
  assert.equal(mood.snapshot().value, 100);
});

test('mood decays one level at two seconds and then every 1.5 seconds', () => {
  const mood = new MoodManager(createGameConfig());
  mood.recordRapidTap();
  mood.recordRapidTap();

  mood.update(1999);
  assert.equal(mood.snapshot().value, 100);
  mood.update(1);
  assert.equal(mood.snapshot().value, 50);
  mood.update(1499);
  assert.equal(mood.snapshot().value, 50);
  mood.update(1);
  assert.equal(mood.snapshot().value, 25);
  mood.update(3000);
  assert.equal(mood.snapshot().value, 0);
});

test('mood decay carries overshoot across multiple level boundaries', () => {
  const mood = new MoodManager(createGameConfig());
  mood.recordRapidTap();
  mood.recordRapidTap();

  mood.update(5000);
  assert.equal(mood.snapshot().value, 0);
  assert.equal(mood.snapshot().level, 'sleepy');
});

test('full angry Mood drops to the annoyed level on its first decay step', () => {
  const mood = new MoodManager(createGameConfig());
  mood.setValue(100);

  mood.update(2000);

  assert.equal(mood.snapshot().value, 50);
  assert.equal(mood.snapshot().level, 'annoyed');
  assert.equal(mood.snapshot().intervalScale, 0.7);
});

test('mood clamps at both ends and exposes a discrete interval scale', () => {
  const mood = new MoodManager(createGameConfig());

  for (const [value, level, scale] of [
    [0, 'sleepy', 1],
    [24, 'sleepy', 1],
    [25, 'curious', 0.85],
    [49, 'curious', 0.85],
    [50, 'annoyed', 0.7],
    [74, 'annoyed', 0.7],
    [75, 'angry', 0.55],
    [100, 'angry', 0.55],
  ]) {
    mood.setValue(value);
    assert.equal(mood.snapshot().level, level);
    assert.equal(mood.snapshot().intervalScale, scale);
  }

  mood.setValue(1000);
  assert.equal(mood.snapshot().value, 100);
  mood.setValue(-100);
  assert.equal(mood.snapshot().value, 0);
  assert.equal(createGameConfig({ moodMax: 200 }).moodMax, 100);
});

test('cat pacing uses Mood level scale while WATCH probability stays independent', () => {
  const config = createGameConfig({
    catIntervalProgressScaleMin: 1,
    watchProbability: 0.5,
    catWatchProbabilityAtMaxProgress: 0.5,
  });
  let intervalScale = 1;
  const cat = new CatController({}, config, {
    getProgress: () => ({ activeCount: 0, totalCount: 4 }),
    getMoodIntervalScale: () => intervalScale,
    getMoodLevel: () => 'sleepy',
  });

  assert.equal(cat.getProgressAdjustedInterval(1000), 1000);
  assert.equal(cat.getWatchProbability(), 0.5);

  intervalScale = 0.55;
  assert.equal(cat.getProgressAdjustedInterval(1000), 550);
  assert.equal(cat.getWatchProbability(), 0.5);
});

test('rapid tap notifies the mood system exactly once per threshold event', () => {
  const config = createGameConfig({ rapidTapThreshold: 2 });
  let rapidTapEvents = 0;
  const cat = new CatController({}, config, {
    onRapidTap: () => { rapidTapEvents += 1; },
  });

  assert.equal(cat.recordRapidTap(), false);
  assert.equal(cat.recordRapidTap(), true);
  assert.equal(rapidTapEvents, 1);
});
