import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ASSEMBLY_DEPTH,
  TABLE_BACK_OFFSET_Y,
  TABLE_FRONT_OFFSET_Y,
  TABLE_HOLE_OFFSET_Y,
  TABLE_LAYER_GAP_Y,
  HOLE_CAT_OFFSET_Y,
  HOLE_CAT_SCALE,
} from '../src/game/constants.js';

test('table assembly renders Back, Hole Cat, then Front in visual order', () => {
  assert.ok(ASSEMBLY_DEPTH.BACK < ASSEMBLY_DEPTH.MIDDLE);
  assert.ok(ASSEMBLY_DEPTH.MIDDLE < ASSEMBLY_DEPTH.FRONT);
  assert.ok(ASSEMBLY_DEPTH.FRONT < ASSEMBLY_DEPTH.BUTTONS);
});

test('table layers separate vertically while Hole Cat keeps its current anchor', () => {
  assert.equal(TABLE_BACK_OFFSET_Y, -155);
  assert.equal(TABLE_FRONT_OFFSET_Y, TABLE_LAYER_GAP_Y);
  assert.equal(TABLE_HOLE_OFFSET_Y, -60);
  assert.equal(HOLE_CAT_OFFSET_Y, -20);
  assert.equal(HOLE_CAT_SCALE, 1.15);
  assert.ok(HOLE_CAT_OFFSET_Y > TABLE_HOLE_OFFSET_Y);
  assert.ok(TABLE_FRONT_OFFSET_Y > 0);
  assert.ok(TABLE_BACK_OFFSET_Y < TABLE_FRONT_OFFSET_Y);
});
