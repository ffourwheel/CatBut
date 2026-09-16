import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameConfig } from '../src/config/gameConfig.js';

test('normal preset keeps the shorter cat pacing and readable warning windows', () => {
  const config = createGameConfig({ preset: 'normal' });

  assert.deepEqual(
    {
      catIntervalMin: config.catIntervalMin,
      catIntervalMax: config.catIntervalMax,
      warningDuration: config.warningDuration,
      peekDuration: config.peekDuration,
      watchDuration: config.watchDuration,
      watchProbability: config.watchProbability,
      catEventMinimumGap: config.catEventMinimumGap,
      buttonCount: config.buttonCount,
      buttonCountMin: config.buttonCountMin,
      buttonCountMax: config.buttonCountMax,
      sabotagePreviewDuration: config.sabotagePreviewDuration,
      sabotageReachDuration: config.sabotageReachDuration,
      sabotageHitDuration: config.sabotageHitDuration,
    },
    {
      catIntervalMin: 500,
      catIntervalMax: 850,
      warningDuration: 350,
      peekDuration: 400,
      watchDuration: 1000,
      watchProbability: 0.6,
      catEventMinimumGap: 500,
      buttonCount: 8,
      buttonCountMin: 8,
      buttonCountMax: 8,
      sabotagePreviewDuration: 160,
      sabotageReachDuration: 120,
      sabotageHitDuration: 80,
    },
  );
});

test('hard preset adds pressure without extending the post-sabotage pause', () => {
  const config = createGameConfig({ preset: 'hard' });

  assert.deepEqual(
    {
      catIntervalMin: config.catIntervalMin,
      catIntervalMax: config.catIntervalMax,
      warningDuration: config.warningDuration,
      peekDuration: config.peekDuration,
      watchProbability: config.watchProbability,
      buttonCount: config.buttonCount,
      buttonCountMin: config.buttonCountMin,
      buttonCountMax: config.buttonCountMax,
      sabotageCooldown: config.sabotageCooldown,
      sabotagePreviewDuration: config.sabotagePreviewDuration,
      sabotageReachDuration: config.sabotageReachDuration,
      sabotageHitDuration: config.sabotageHitDuration,
    },
    {
      catIntervalMin: 500,
      catIntervalMax: 700,
      warningDuration: 300,
      peekDuration: 350,
      watchProbability: 0.7,
      buttonCount: 8,
      buttonCountMin: 8,
      buttonCountMax: 8,
      sabotageCooldown: 900,
      sabotagePreviewDuration: 120,
      sabotageReachDuration: 100,
      sabotageHitDuration: 70,
    },
  );
});

test('easy preset also keeps the fixed eight-button target', () => {
  const config = createGameConfig({ preset: 'easy' });

  assert.equal(config.buttonCount, 8);
  assert.equal(config.buttonCountMin, 8);
  assert.equal(config.buttonCountMax, 8);
});
