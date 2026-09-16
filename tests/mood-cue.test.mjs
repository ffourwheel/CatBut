import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MOOD_CUE_FRAMES,
  getMoodCue,
  isMoodCueVisibleForCatState,
  shouldAnimateMoodCue,
} from '../src/ui/MoodCue.js';

test('mood levels map to stable generated bubble frames and Thai labels', () => {
  assert.deepEqual(MOOD_CUE_FRAMES, {
    sleepy: 0,
    curious: 1,
    annoyed: 2,
    angry: 3,
  });
  assert.deepEqual(getMoodCue('sleepy'), { frame: 0, label: 'ง่วง' });
  assert.deepEqual(getMoodCue('curious'), { frame: 1, label: 'สนใจ' });
  assert.deepEqual(getMoodCue('annoyed'), { frame: 2, label: 'หงุดหงิด' });
  assert.deepEqual(getMoodCue('angry'), { frame: 3, label: 'โมโห' });
});

test('mood bubble stays readable except when the cat faces away', () => {
  assert.equal(isMoodCueVisibleForCatState('hidden'), true);
  assert.equal(isMoodCueVisibleForCatState('warning'), true);
  assert.equal(isMoodCueVisibleForCatState('peek'), true);
  assert.equal(isMoodCueVisibleForCatState('watch'), true);
  assert.equal(isMoodCueVisibleForCatState('attack'), true);
  assert.equal(isMoodCueVisibleForCatState('sabotage'), false);
  assert.equal(isMoodCueVisibleForCatState('hide'), false);
});

test('unknown Mood levels fall back to the readable sleepy cue', () => {
  assert.deepEqual(getMoodCue('not-a-level'), { frame: 0, label: 'ง่วง' });
});

test('mood cue animation only runs when the level actually changes', () => {
  assert.equal(shouldAnimateMoodCue({ level: 'annoyed', levelChanged: true }, 'curious'), true);
  assert.equal(shouldAnimateMoodCue({ level: 'annoyed', levelChanged: false }, 'annoyed'), false);
  assert.equal(shouldAnimateMoodCue({ level: 'annoyed', levelChanged: true }, 'annoyed'), false);
});
