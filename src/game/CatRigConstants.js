// Shared visual geometry for the connected Cat Reach Rig. Values are in the
// 1024px game coordinate system after each asset's base scale is applied.
export const CAT_RIG_GEOMETRY = Object.freeze({
  // 0.28 keeps every button on the ring within a <=1.24x arm stretch, so
  // the reach limb stays short and chunky instead of telescoping.
  bodyScale: 0.28,
  // The arm shares the body's art scale so its chunky strokes stay
  // proportional to the torso at every rig size.
  armScale: 0.28,
  // Head offsets keep the previous visual center after the scale change
  // (prior offsets plus the larger art-space head center offset).
  headY: -55,
  sleepHeadY: -35,
  // The shoulder sits on the upper chest, well inside the torso silhouette,
  // so the arm's fur shoulder pad always overlaps the body during rotation.
  shoulder: Object.freeze({ x: 64, y: -46 }),
  arms: Object.freeze({
    left: Object.freeze({
      armOrigin: Object.freeze({ x: 0.8, y: 0.07 }),
      // Paw art offset (620, 700) multiplied by the current arm scale.
      restVector: Object.freeze({ x: -173.6, y: 196 }),
    }),
    right: Object.freeze({
      armOrigin: Object.freeze({ x: 0.2, y: 0.1 }),
      restVector: Object.freeze({ x: 173.6, y: 196 }),
    }),
  }),
});
