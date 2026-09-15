import test from 'node:test';
import assert from 'node:assert/strict';
import { createSabotageReachPlan, sampleReachSquash } from '../src/game/CatReach.js';
import {
  BUTTON_SLOT_LAYOUT,
  SABOTAGE_PAW_DEFAULT_ANGLE,
  SABOTAGE_PAW_REACH,
  TABLE_ANCHOR,
} from '../src/game/constants.js';

test('Sabotage reach plan resolves every button slot from one origin', () => {
  const origin = { x: 0, y: -20 };

  BUTTON_SLOT_LAYOUT.forEach((slot) => {
    const plan = createSabotageReachPlan({
      origin,
      target: {
        x: slot.x - TABLE_ANCHOR.x,
        y: slot.y - TABLE_ANCHOR.y,
      },
      pawReach: SABOTAGE_PAW_REACH,
      defaultAngle: SABOTAGE_PAW_DEFAULT_ANGLE,
    });

    assert.ok(Number.isFinite(plan.targetAngle));
    assert.ok(Number.isFinite(plan.rotation));
    assert.ok(plan.targetScale >= 0.3 && plan.targetScale <= 0.58);
    assert.ok(plan.distance > 0);
  });
});

test('Sabotage contact squash peaks before settling back to the authored scale', () => {
  const beforeContact = sampleReachSquash(0.5);
  const contact = sampleReachSquash(0.86);
  const settled = sampleReachSquash(1);

  assert.deepEqual(beforeContact, { scaleX: 1, scaleY: 1 });
  assert.ok(contact.scaleX > 1);
  assert.ok(contact.scaleY < 1);
  assert.deepEqual(settled, { scaleX: 1, scaleY: 1 });
});
