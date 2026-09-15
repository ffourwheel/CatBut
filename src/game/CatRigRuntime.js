import Phaser from 'phaser';
import { CAT_RIG_BLOCKOUT_PARTS } from './CatRig.js';
import { solveTwoBoneIK } from './CatRigIK.js';
import { ASSEMBLY_DEPTH } from './constants.js';

const COLORS = Object.freeze({
  body: 0xc98958,
  head: 0xe2a36e,
  ear: 0xf3c293,
  limb: 0xb66f4c,
  paw: 0xf7d7bd,
  eye: 0x241a17,
  shadow: 0x1a100b,
  pivot: 0xffcf78,
  bone: 0xffcf78,
});

function drawVisual(graphics, visual, partId) {
  graphics.clear();

  if (visual.shape === 'ellipse') {
    graphics.fillStyle(partId === 'shadow' ? COLORS.shadow : COLORS[partId], 1);
    graphics.fillEllipse(0, 0, visual.width, visual.height);
    return;
  }

  if (visual.shape === 'triangle') {
    graphics.fillStyle(COLORS.ear, 1);
    graphics.fillTriangle(
      0,
      -visual.height / 2,
      -visual.width / 2,
      visual.height / 2,
      visual.width / 2,
      visual.height / 2,
    );
    return;
  }

  if (visual.shape === 'segment') {
    graphics.fillStyle(COLORS.limb, 1);
    graphics.fillRoundedRect(
      -visual.width / 2,
      0,
      visual.width,
      visual.length,
      visual.width / 2,
    );
    graphics.lineStyle(5, COLORS.bone, 0.9);
    graphics.lineBetween(0, 0, 0, visual.length);
    return;
  }

  if (visual.shape === 'circle') {
    graphics.fillStyle(COLORS.paw, 1);
    graphics.fillCircle(0, 0, visual.radius);
    return;
  }

  if (visual.shape === 'eyes') {
    graphics.fillStyle(COLORS.eye, 1);
    graphics.fillCircle(-visual.spacing / 2, 0, visual.radius);
    graphics.fillCircle(visual.spacing / 2, 0, visual.radius);
  }
}

function drawPivot(graphics, partId) {
  graphics.lineStyle(3, COLORS.pivot, 0.95);
  graphics.strokeCircle(0, 0, partId === 'catRoot' ? 10 : 6);
  graphics.lineBetween(-10, 0, 10, 0);
  graphics.lineBetween(0, -10, 0, 10);
}

function applyLocalTransform(node, local) {
  node.setPosition(local.x, local.y);
  node.setRotation(local.rotation);
  node.setScale(local.scaleX, local.scaleY);
}

export function createCatRigRuntime(scene, {
  parent,
  offsetY = 0,
  visible = true,
  showDebug = true,
} = {}) {
  const root = scene.add.container(0, offsetY)
    .setName('catRoot')
    .setDepth(ASSEMBLY_DEPTH.MIDDLE - 1)
    .setVisible(visible);
  const nodes = new Map([['catRoot', root]]);

  CAT_RIG_BLOCKOUT_PARTS.forEach((definition) => {
    if (definition.id === 'catRoot') {
      if (showDebug) {
        const rootPivot = scene.add.graphics();
        drawPivot(rootPivot, definition.id);
        root.add(rootPivot);
      }
      return;
    }

    const node = scene.add.container(0, 0).setName(definition.id);
    const visual = scene.add.graphics();
    drawVisual(visual, definition.visual, definition.id);
    node.add(visual);

    if (showDebug) {
      const pivot = scene.add.graphics();
      drawPivot(pivot, definition.id);
      node.add(pivot);
    }

    applyLocalTransform(node, definition.local);
    const parentNode = nodes.get(definition.parentId);
    if (!parentNode) throw new Error(`Cat Rig parent not found: ${definition.parentId}`);
    parentNode.add(node);
    nodes.set(definition.id, node);
  });

  parent?.add(root);

  return {
    root,
    parts: Object.fromEntries([...nodes.entries()]),
    reachTo(target, { side = 'auto', upperLength = 92, lowerLength = 92 } = {}) {
      const selectedSide = side === 'auto' ? (target.x < 0 ? 'left' : 'right') : side;
      const upperArmId = `${selectedSide}UpperArm`;
      const forearmId = `${selectedSide}Forearm`;
      const pawId = `${selectedSide}Paw`;
      const shoulder = {
        x: selectedSide === 'left' ? -82 : 82,
        y: 36,
      };
      const solution = solveTwoBoneIK({
        shoulder,
        target,
        upperLength,
        lowerLength,
        bendDirection: selectedSide === 'left' ? -1 : 1,
      });
      const upperArm = nodes.get(upperArmId);
      const forearm = nodes.get(forearmId);
      const paw = nodes.get(pawId);
      upperArm.setRotation(solution.upperAngle - Math.PI / 2);
      forearm.setPosition(0, upperLength);
      forearm.setRotation(solution.forearmAngle - solution.upperAngle);
      paw.setPosition(0, lowerLength);
      return { side: selectedSide, solution };
    },
    resetPose() {
      nodes.forEach((node, id) => {
        const definition = CAT_RIG_BLOCKOUT_PARTS.find((part) => part.id === id);
        if (!definition) return;
        applyLocalTransform(node, definition.local);
      });
      return this;
    },
    setVisible(nextVisible) {
      root.setVisible(nextVisible);
      return this;
    },
    setDebugVisible(nextVisible) {
      nodes.forEach((node, id) => {
        if (id === 'catRoot') return;
        const pivot = node.list[1];
        if (pivot) pivot.setVisible(nextVisible);
      });
      return this;
    },
  };
}
