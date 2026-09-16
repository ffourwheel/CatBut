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
      sabotagePreviewDuration: 240,
      sabotageReachDuration: 180,
      sabotageHitDuration: 120,
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
      buttonCountMin: 6,
      buttonCountMax: 8,
      sabotageCooldown: 900,
      sabotagePreviewDuration: 180,
      sabotageReachDuration: 150,
      sabotageHitDuration: 100,
    },
  );
});
