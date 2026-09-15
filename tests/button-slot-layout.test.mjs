import assert from 'node:assert/strict';
import test from 'node:test';

import { BUTTON_SLOT_LAYOUT, TABLE_ANCHOR } from '../src/game/constants.js';

test('Button Slots occupy the eight fixed directions around the table', () => {
  assert.equal(BUTTON_SLOT_LAYOUT.length, 8);
  assert.deepEqual(TABLE_ANCHOR, { x: 512, y: 452 });

  const radius = Math.hypot(
    BUTTON_SLOT_LAYOUT[0].x - TABLE_ANCHOR.x,
    BUTTON_SLOT_LAYOUT[0].y - TABLE_ANCHOR.y,
  );
  const angles = BUTTON_SLOT_LAYOUT
    .map(({ x, y }) => {
      const radians = Math.atan2(y - TABLE_ANCHOR.y, x - TABLE_ANCHOR.x);
      const degrees = Math.round((radians * 180) / Math.PI);
      return (degrees + 360) % 360;
    })
    .sort((a, b) => a - b);

  assert.deepEqual(angles, [0, 45, 90, 135, 180, 225, 270, 315]);

  BUTTON_SLOT_LAYOUT.forEach(({ x, y }) => {
    const slotRadius = Math.hypot(x - TABLE_ANCHOR.x, y - TABLE_ANCHOR.y);
    assert.ok(Math.abs(slotRadius - radius) < 0.001);
  });
});
