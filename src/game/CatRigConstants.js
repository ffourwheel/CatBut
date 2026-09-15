// Shared visual geometry for the connected Cat Reach Rig. Values are in the
// 1024px game coordinate system after each asset's base scale is applied.
export const CAT_RIG_GEOMETRY = Object.freeze({
  bodyScale: 0.24,
  // The arm shares the body's art scale so its chunky strokes stay
  // proportional to the torso at every rig size.
  armScale: 0.24,
  headY: -54,
  sleepHeadY: -34,
  // The shoulder sits on the upper chest, well inside the torso silhouette,
  // so the arm's fur shoulder pad always overlaps the body during rotation.
  shoulder: Object.freeze({ x: 64, y: -46 }),
  arms: Object.freeze({
    left: Object.freeze({
      armOrigin: Object.freeze({ x: 0.8, y: 0.07 }),
      restVector: Object.freeze({ x: -148.8, y: 168 }),
    }),
    right: Object.freeze({
      armOrigin: Object.freeze({ x: 0.2, y: 0.1 }),
      restVector: Object.freeze({ x: 148.8, y: 168 }),
    }),
  }),
});
