import { createCatRigBlockoutPose } from './CatRig.js';
import {
  CAT_MOTION_CLIPS,
  CAT_MOTION_CONFIG,
} from './CatAnimationConfig.js';
import {
  getDirectionPoseDefinition,
  getDirectionPoseForSlot,
} from './CatDirectionPose.js';

const TRANSFORM_KEYS = Object.freeze([
  'x',
  'y',
  'rotation',
  'scaleX',
  'scaleY',
]);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function easeValue(name, value) {
  if (name === 'easeIn') return value * value;
  if (name === 'easeOut') return 1 - ((1 - value) ** 2);
  if (name === 'easeInOut') {
    return value < 0.5
      ? 2 * value * value
      : 1 - (((-2 * value + 2) ** 2) / 2);
  }
  return value;
}

function cloneTransform(transform) {
  return { ...transform };
}

function capturePose(rig) {
  return new Map(rig.snapshot().map(({ id, ...transform }) => [id, transform]));
}

function clonePose(pose) {
  return new Map([...pose.entries()].map(([id, transform]) => [id, cloneTransform(transform)]));
}

function interpolateOffset(from, to, amount) {
  const result = {};
  const keys = new Set([...Object.keys(from), ...Object.keys(to)]);
  keys.forEach((key) => {
    result[key] = (from[key] ?? 0) + ((to[key] ?? 0) - (from[key] ?? 0)) * amount;
  });
  return result;
}

function sampleTrack(track, time) {
  if (!track?.length) return {};
  if (time <= track[0].time) return { ...track[0].offset };

  const last = track[track.length - 1];
  if (time >= last.time) return { ...last.offset };

  for (let index = 1; index < track.length; index += 1) {
    const next = track[index];
    if (time > next.time) continue;
    const previous = track[index - 1];
    const span = Math.max(0.0001, next.time - previous.time);
    const normalized = clamp((time - previous.time) / span, 0, 1);
    const eased = easeValue(next.ease, normalized);
    return interpolateOffset(previous.offset, next.offset, eased);
  }

  return { ...last.offset };
}

function offsetToTransform(base, offset) {
  const result = cloneTransform(base);
  ['x', 'y', 'rotation'].forEach((key) => {
    if (offset[key] !== undefined) result[key] = base[key] + offset[key];
  });
  ['scaleX', 'scaleY'].forEach((key) => {
    if (offset[key] !== undefined) result[key] = base[key] * (1 + offset[key]);
  });
  return result;
}

function cloneOffsetMap(offsets) {
  return Object.fromEntries(
    Object.entries(offsets).map(([partId, offset]) => [partId, { ...offset }]),
  );
}

function blendOffsetMaps(from, to, amount) {
  const blended = {};
  const partIds = new Set([...Object.keys(from), ...Object.keys(to)]);
  partIds.forEach((partId) => {
    blended[partId] = interpolateOffset(from[partId] ?? {}, to[partId] ?? {}, amount);
  });
  return blended;
}

function applyDirectionOffsets(pose, offsets) {
  const result = clonePose(pose);
  Object.entries(offsets).forEach(([partId, offset]) => {
    const base = result.get(partId);
    if (base) result.set(partId, offsetToTransform(base, offset));
  });
  return result;
}

export function sampleCatMotionClip(clip, time, authoredPose) {
  const sampled = clonePose(authoredPose);
  Object.entries(clip.tracks).forEach(([partId, track]) => {
    const base = authoredPose.get(partId);
    if (!base) return;
    sampled.set(partId, offsetToTransform(base, sampleTrack(track, time)));
  });
  return sampled;
}

function blendPose(from, to, amount) {
  const blended = new Map();
  from.forEach((fromTransform, id) => {
    const toTransform = to.get(id) ?? fromTransform;
    const transform = {};
    TRANSFORM_KEYS.forEach((key) => {
      transform[key] = fromTransform[key] + (toTransform[key] - fromTransform[key]) * amount;
    });
    blended.set(id, transform);
  });
  return blended;
}

function applyPose(rig, pose) {
  pose.forEach((transform, id) => {
    rig.setLocalTransform(id, transform);
  });
}

export function createCatAnimation({
  rig = createCatRigBlockoutPose(),
  clips = CAT_MOTION_CLIPS,
  config = CAT_MOTION_CONFIG,
} = {}) {
  rig.resetPose();
  const authoredPose = capturePose(rig);
  let active = null;
  let transition = null;
  let lastClip = null;
  let directionPoseName = 'down';
  let directionTransition = null;

  const getClip = (name) => {
    const clip = clips[name];
    if (!clip) throw new Error(`Unknown Cat Motion Clip: ${name}`);
    return clip;
  };

  const getDirection = (name) => {
    const definition = getDirectionPoseDefinition(name);
    if (!definition) throw new Error(`Unknown Cat Direction Pose: ${name}`);
    return definition;
  };

  const resolveDirectionName = (directionOrSlot) => (
    getDirectionPoseDefinition(directionOrSlot)?.name
    ?? getDirectionPoseForSlot(directionOrSlot)
    ?? (() => {
      throw new Error(`Unknown Cat Direction or Slot: ${directionOrSlot}`);
    })()
  );

  const getDirectionOffsets = () => {
    if (!directionTransition) return getDirection(directionPoseName).offsets;
    const amount = clamp(
      directionTransition.elapsed / directionTransition.duration,
      0,
      1,
    );
    return blendOffsetMaps(directionTransition.from, directionTransition.to, amount);
  };

  const applyCurrentFrame = () => {
    const motionPose = active
      ? sampleCatMotionClip(getClip(active.name), active.elapsed, authoredPose)
      : authoredPose;
    const targetPose = applyDirectionOffsets(motionPose, getDirectionOffsets());
    if (!transition) {
      applyPose(rig, targetPose);
      return;
    }

    const amount = clamp(transition.elapsed / transition.duration, 0, 1);
    applyPose(rig, blendPose(transition.from, targetPose, amount));
    if (amount >= 1) transition = null;
  };

  const getState = () => ({
    activeClip: active?.name ?? null,
    elapsed: active?.elapsed ?? 0,
    duration: active ? getClip(active.name).duration : 0,
    loop: active?.loop ?? false,
    transitioning: Boolean(transition),
    lastClip,
    directionPose: directionPoseName,
    directionTransitioning: Boolean(directionTransition),
  });

  return {
    play(name, { blendMs = config.transitionDuration, loop } = {}) {
      const clip = getClip(name);
      const from = capturePose(rig);
      active = {
        name,
        elapsed: 0,
        loop: loop ?? clip.loop,
      };
      lastClip = name;
      transition = blendMs > 0
        ? { elapsed: 0, duration: blendMs, from }
        : null;
      applyCurrentFrame();
      return getState();
    },

    faceTo(directionOrSlot, { blendMs = config.transitionDuration } = {}) {
      const nextName = resolveDirectionName(directionOrSlot);
      const from = cloneOffsetMap(getDirectionOffsets());
      const to = cloneOffsetMap(getDirection(nextName).offsets);
      directionPoseName = nextName;
      directionTransition = blendMs > 0
        ? { elapsed: 0, duration: blendMs, from, to }
        : null;
      applyCurrentFrame();
      return getState();
    },

    update(deltaMs) {
      if (!active && !directionTransition) return getState();
      const delta = Math.max(0, Number.isFinite(deltaMs) ? deltaMs : 0);
      const clip = active ? getClip(active.name) : null;

      if (active) {
        active.elapsed += delta;
        if (active.loop) {
          active.elapsed %= clip.duration;
        } else if (active.elapsed >= clip.duration) {
          active.elapsed = clip.duration;
        }
      }

      if (transition) transition.elapsed += delta;
      if (directionTransition) directionTransition.elapsed += delta;
      applyCurrentFrame();

      if (directionTransition && directionTransition.elapsed >= directionTransition.duration) {
        directionTransition = null;
      }
      if (active && !active.loop && active.elapsed >= clip.duration) {
        active = null;
        transition = null;
      }
      return getState();
    },

    cancel() {
      active = null;
      transition = null;
      applyCurrentFrame();
      return getState();
    },

    reset() {
      active = null;
      transition = null;
      directionPoseName = 'down';
      directionTransition = null;
      lastClip = null;
      rig.resetPose();
      return getState();
    },

    snapshot() {
      return rig.snapshot();
    },

    getState,
  };
}
