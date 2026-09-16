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

test('sleepy mood bubble disappears as soon as the cat wakes up', () => {
  assert.equal(isMoodCueVisibleForCatState('hidden', 'sleepy'), true);
  assert.equal(isMoodCueVisibleForCatState('warning', 'sleepy'), false);
  assert.equal(isMoodCueVisibleForCatState('peek', 'sleepy'), false);
  assert.equal(isMoodCueVisibleForCatState('watch', 'sleepy'), false);
  assert.equal(isMoodCueVisibleForCatState('attack', 'sleepy'), false);
  assert.equal(isMoodCueVisibleForCatState('sabotage', 'sleepy'), false);
  assert.equal(isMoodCueVisibleForCatState('hide', 'sleepy'), false);
});

test('active mood bubbles only show while the cat is readable and facing the player', () => {
  ['curious', 'annoyed', 'angry'].forEach((level) => {
    assert.equal(isMoodCueVisibleForCatState('hidden', level), false, level);
    assert.equal(isMoodCueVisibleForCatState('warning', level), false, level);
    assert.equal(isMoodCueVisibleForCatState('peek', level), true, level);
    assert.equal(isMoodCueVisibleForCatState('watch', level), true, level);
    assert.equal(isMoodCueVisibleForCatState('attack', level), false, level);
    assert.equal(isMoodCueVisibleForCatState('sabotage', level), false, level);
    assert.equal(isMoodCueVisibleForCatState('hide', level), false, level);
  });
});

test('unknown Mood levels fall back to the readable sleepy cue', () => {
  assert.deepEqual(getMoodCue('not-a-level'), { frame: 0, label: 'ง่วง' });
});

test('mood cue animation only runs when the level actually changes', () => {
  assert.equal(shouldAnimateMoodCue({ level: 'annoyed', levelChanged: true }, 'curious'), true);
  assert.equal(shouldAnimateMoodCue({ level: 'annoyed', levelChanged: false }, 'annoyed'), false);
  assert.equal(shouldAnimateMoodCue({ level: 'annoyed', levelChanged: true }, 'annoyed'), false);
});
