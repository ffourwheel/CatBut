import assert from 'node:assert/strict';
import test from 'node:test';

import { CAT_RIG_HIERARCHY, createCatRigBlockoutPose } from '../src/game/CatRig.js';

test('Cat Rig hierarchy keeps body and reach chains separate from the table', () => {
  assert.deepEqual(CAT_RIG_HIERARCHY, [
    { id: 'catRoot', parentId: null },
    { id: 'shadow', parentId: 'catRoot' },
    { id: 'body', parentId: 'catRoot' },
    { id: 'head', parentId: 'body' },
    { id: 'leftEar', parentId: 'head' },
    { id: 'rightEar', parentId: 'head' },
    { id: 'leftUpperArm', parentId: 'catRoot' },
    { id: 'leftForearm', parentId: 'leftUpperArm' },
    { id: 'leftPaw', parentId: 'leftForearm' },
    { id: 'rightUpperArm', parentId: 'catRoot' },
    { id: 'rightForearm', parentId: 'rightUpperArm' },
    { id: 'rightPaw', parentId: 'rightForearm' },
    { id: 'eyes', parentId: 'head' },
  ]);
});

test('rotating a parent changes child world transform and resetPose restores it', () => {
  const rig = createCatRigBlockoutPose();
  const initialEyes = rig.getWorldTransform('eyes');

  rig.setLocalTransform('head', { rotation: 0.35 });
  const rotatedEyes = rig.getWorldTransform('eyes');
  assert.notDeepEqual(rotatedEyes, initialEyes);

  rig.resetPose();
  assert.deepEqual(rig.getWorldTransform('eyes'), initialEyes);
});
