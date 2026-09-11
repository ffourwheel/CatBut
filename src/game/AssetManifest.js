import { CAT_STATES } from './constants.js';

export const ASSET_KEYS = Object.freeze({
  tableBack: 'table_back',
  tableFront: 'table_front',
  cat: Object.fromEntries(Object.values(CAT_STATES).map((state) => [state, `cat_hole_${state}`])),
});

export const ASSET_MANIFEST = Object.freeze({
  table_back: '/assets/table_back.png',
  table_front: '/assets/table_front.png',
  ...Object.fromEntries(
    Object.values(CAT_STATES).map((state) => [`cat_hole_${state}`, `/assets/cat_hole_${state}.png`]),
  ),
});

export function preloadContractAssets(scene, { useRealAssets = false } = {}) {
  if (!useRealAssets) return;

  Object.entries(ASSET_MANIFEST).forEach(([key, path]) => {
    scene.load.image(key, path);
  });
}
