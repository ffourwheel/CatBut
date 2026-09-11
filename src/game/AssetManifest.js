import { CAT_STATES } from './constants.js';

export const ASSET_KEYS = Object.freeze({
  background: 'background',
  backgroundForeground: 'in_background_overlay',
  tableBack: 'table_back',
  tableFront: 'table_front',
  cat: Object.fromEntries(Object.values(CAT_STATES).map((state) => [state, `cat_hole_${state}`])),
  buttons: {
    off: 'button_off',
    holding: 'button_off',
    on: 'button_on',
  },
  ui: {
    heartFull: 'heart_full',
    heartEmpty: 'heart_empty',
    star: 'star_icon',
    catPaw: 'cat_paw',
    warningBubble: 'warning_bubble',
    warningMark: 'warning_mark',
    soundOn: 'sound_on',
    soundOff: 'sound_off',
    pause: 'pause_icon',
  },
});

export const ASSET_MANIFEST = Object.freeze({
  background: '/assets/background.png',
  in_background_overlay: '/assets/in_background_overlay.png',
  table_back: '/assets/table_back.png',
  table_front: '/assets/table_front.png',
  ...Object.fromEntries(
    Object.values(CAT_STATES).map((state) => [
      `cat_hole_${state}`,
      state === CAT_STATES.WARNING ? '/assets/cat_hole_hidden.png' : `/assets/cat_hole_${state}.png`,
    ]),
  ),
  button_off: '/assets/ui/button_off.png',
  button_on: '/assets/ui/button_on.png',
  btn_off: '/assets/ui/button_off.png',
  btn_holding: '/assets/ui/button_off.png',
  btn_on: '/assets/ui/button_on.png',
  heart_full: '/assets/ui/heart_full.png',
  heart_empty: '/assets/ui/heart_empty.png',
  heart: '/assets/ui/heart_full.png',
  star_icon: '/assets/ui/star_icon.png',
  star: '/assets/ui/star_icon.png',
  cat_paw: '/assets/ui/cat_paw.png',
  warning_bubble: '/assets/ui/warning_bubble.png',
  warning_mark: '/assets/ui/warning.png',
  sound_on: '/assets/ui/sound_on.png',
  sound_off: '/assets/ui/sound_off.png',
  pause_icon: '/assets/ui/pause_icon.png',
});

export function preloadContractAssets(scene, { useRealAssets = false } = {}) {
  if (!useRealAssets) return;

  Object.entries(ASSET_MANIFEST).forEach(([key, path]) => {
    scene.load.image(key, path);
  });
}
