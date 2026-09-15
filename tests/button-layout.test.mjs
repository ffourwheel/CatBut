import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BUTTON_RING_RADIUS_X,
  BUTTON_RING_RADIUS_Y,
  BUTTON_SLOT_LAYOUT,
  BUTTON_SLOT_PRESETS,
  TABLE_ANCHOR,
} from '../src/game/constants.js';

test('button slots form an eight-point clockwise ring around the cat hole', () => {
  assert.equal(BUTTON_SLOT_LAYOUT.length, 8);
  assert.deepEqual(BUTTON_SLOT_LAYOUT.map(({ id }) => id), [
    'slot-1',
    'slot-2',
    'slot-3',
    'slot-4',
    'slot-5',
    'slot-6',
    'slot-7',
    'slot-8',
  ]);

  BUTTON_SLOT_LAYOUT.forEach(({ x, y }, index) => {
    const angle = -Math.PI / 2 + index * (Math.PI * 2 / 8);
    const expectedX = TABLE_ANCHOR.x + Math.cos(angle) * BUTTON_RING_RADIUS_X;
    const expectedY = TABLE_ANCHOR.y + Math.sin(angle) * BUTTON_RING_RADIUS_Y;
    assert.ok(Math.abs(x - expectedX) < 0.000001);
    assert.ok(Math.abs(y - expectedY) < 0.000001);
  });

  assert.deepEqual(BUTTON_SLOT_LAYOUT[0], {
    id: 'slot-1',
    x: TABLE_ANCHOR.x,
    y: TABLE_ANCHOR.y - BUTTON_RING_RADIUS_Y,
  });
  assert.deepEqual(BUTTON_SLOT_LAYOUT[2], {
    id: 'slot-3',
    x: TABLE_ANCHOR.x + BUTTON_RING_RADIUS_X,
    y: TABLE_ANCHOR.y,
  });
  assert.deepEqual(BUTTON_SLOT_LAYOUT[4], {
    id: 'slot-5',
    x: TABLE_ANCHOR.x,
    y: TABLE_ANCHOR.y + BUTTON_RING_RADIUS_Y,
  });
  assert.deepEqual(BUTTON_SLOT_LAYOUT[6], {
    id: 'slot-7',
    x: TABLE_ANCHOR.x - BUTTON_RING_RADIUS_X,
    y: TABLE_ANCHOR.y,
  });
});

test('stage presets keep the existing 4-to-8 button range', () => {
  assert.deepEqual(BUTTON_SLOT_PRESETS[4], ['slot-1', 'slot-3', 'slot-5', 'slot-7']);
  assert.equal(BUTTON_SLOT_PRESETS[8].length, 8);
});
