import {
  ASSEMBLY_DEPTH,
  TABLE_ANCHOR,
} from './constants.js';

const DEFAULT_TRANSFORM = Object.freeze({
  x: 0,
  y: 0,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
});

function part(id, parentId, local, pivot, depth, visual) {
  return Object.freeze({
    id,
    parentId,
    local: Object.freeze({ ...DEFAULT_TRANSFORM, ...local }),
    pivot: Object.freeze({ ...pivot }),
    depth,
    visual: Object.freeze({ ...visual }),
  });
}

/**
 * Placeholder-only contract for the first Cat Rig slice.
 *
 * The visual metadata is intentionally simple. It gives the Preview a stable
 * blockout to draw while keeping the future runtime rig free to replace the
 * shapes with layered art without changing parent or pivot semantics.
 */
export const CAT_RIG_BLOCKOUT_PARTS = Object.freeze([
  part('catRoot', null, {}, { x: 0, y: 0 }, ASSEMBLY_DEPTH.MIDDLE, {
    shape: 'root',
  }),
  part('shadow', 'catRoot', { x: 0, y: 156 }, { x: 0, y: 0 }, ASSEMBLY_DEPTH.BACK, {
    shape: 'ellipse',
    width: 260,
    height: 58,
  }),
  part('body', 'catRoot', { x: 0, y: 68 }, { x: 0, y: 0 }, ASSEMBLY_DEPTH.MIDDLE, {
    shape: 'ellipse',
    width: 210,
    height: 150,
  }),
  part('head', 'body', { x: 0, y: -70 }, { x: 0, y: 0 }, ASSEMBLY_DEPTH.MIDDLE + 1, {
    shape: 'ellipse',
    width: 224,
    height: 174,
  }),
  part('leftEar', 'head', { x: -64, y: -102, rotation: -0.18 }, { x: 0, y: 0 }, ASSEMBLY_DEPTH.MIDDLE + 2, {
    shape: 'triangle',
    width: 64,
    height: 90,
  }),
  part('rightEar', 'head', { x: 64, y: -102, rotation: 0.18 }, { x: 0, y: 0 }, ASSEMBLY_DEPTH.MIDDLE + 2, {
    shape: 'triangle',
    width: 64,
    height: 90,
  }),
  part('leftUpperArm', 'catRoot', { x: -82, y: 36, rotation: -0.28 }, { x: 0, y: 0 }, ASSEMBLY_DEPTH.MIDDLE + 3, {
    shape: 'segment',
    length: 92,
    width: 34,
  }),
  part('leftForearm', 'leftUpperArm', { x: 0, y: 84, rotation: -0.16 }, { x: 0, y: 0 }, ASSEMBLY_DEPTH.MIDDLE + 4, {
    shape: 'segment',
    length: 92,
    width: 38,
  }),
  part('leftPaw', 'leftForearm', { x: 0, y: 78 }, { x: 0, y: 0 }, ASSEMBLY_DEPTH.MIDDLE + 5, {
    shape: 'circle',
    radius: 42,
  }),
  part('rightUpperArm', 'catRoot', { x: 82, y: 36, rotation: 0.28 }, { x: 0, y: 0 }, ASSEMBLY_DEPTH.MIDDLE + 3, {
    shape: 'segment',
    length: 92,
    width: 34,
  }),
  part('rightForearm', 'rightUpperArm', { x: 0, y: 84, rotation: 0.16 }, { x: 0, y: 0 }, ASSEMBLY_DEPTH.MIDDLE + 4, {
    shape: 'segment',
    length: 92,
    width: 38,
  }),
  part('rightPaw', 'rightForearm', { x: 0, y: 78 }, { x: 0, y: 0 }, ASSEMBLY_DEPTH.MIDDLE + 5, {
    shape: 'circle',
    radius: 42,
  }),
  part('eyes', 'head', { x: 0, y: -24 }, { x: 0, y: 0 }, ASSEMBLY_DEPTH.MIDDLE + 6, {
    shape: 'eyes',
    spacing: 46,
    radius: 15,
  }),
]);

export const CAT_RIG_HIERARCHY = Object.freeze(
  CAT_RIG_BLOCKOUT_PARTS.map(({ id, parentId }) => Object.freeze({ id, parentId })),
);

const PART_BY_ID = new Map(CAT_RIG_BLOCKOUT_PARTS.map((definition) => [definition.id, definition]));

function createInitialTransforms() {
  return new Map(CAT_RIG_BLOCKOUT_PARTS.map(({ id, local }) => [id, { ...local }]));
}

function cloneTransform(transform) {
  return { ...transform };
}

export function createCatRigBlockoutPose() {
  let transforms = createInitialTransforms();

  const getPart = (id) => {
    const definition = PART_BY_ID.get(id);
    if (!definition) return null;
    return {
      ...definition,
      local: cloneTransform(transforms.get(id)),
      pivot: { ...definition.pivot },
      visual: { ...definition.visual },
    };
  };

  const getWorldTransform = (id) => {
    const current = getPart(id);
    if (!current) return null;
    if (!current.parentId) {
      return {
        x: TABLE_ANCHOR.x + current.local.x,
        y: TABLE_ANCHOR.y + current.local.y,
        rotation: current.local.rotation,
        scaleX: current.local.scaleX,
        scaleY: current.local.scaleY,
      };
    }

    const parent = getWorldTransform(current.parentId);
    const cos = Math.cos(parent.rotation);
    const sin = Math.sin(parent.rotation);
    const scaledX = current.local.x * parent.scaleX;
    const scaledY = current.local.y * parent.scaleY;

    return {
      x: parent.x + scaledX * cos - scaledY * sin,
      y: parent.y + scaledX * sin + scaledY * cos,
      rotation: parent.rotation + current.local.rotation,
      scaleX: parent.scaleX * current.local.scaleX,
      scaleY: parent.scaleY * current.local.scaleY,
    };
  };

  return {
    anchor: { x: TABLE_ANCHOR.x, y: TABLE_ANCHOR.y },
    getPart,
    getWorldTransform,
    setLocalTransform(id, patch) {
      if (!PART_BY_ID.has(id)) return false;
      transforms.set(id, {
        ...transforms.get(id),
        ...patch,
      });
      return true;
    },
    snapshot() {
      return CAT_RIG_BLOCKOUT_PARTS.map(({ id }) => ({
        id,
        ...cloneTransform(transforms.get(id)),
      }));
    },
    resetPose() {
      transforms = createInitialTransforms();
      return this.snapshot();
    },
  };
}
