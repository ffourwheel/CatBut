import { CAT_STATES } from './constants.js';
import { ASSET_KEYS } from './AssetKeys.js';
import scoreBarUrl from '../../assets/ui/score_bar.png?url';
import healthBarUrl from '../../assets/ui/health_bar.png?url';

export { ASSET_KEYS };

export const ASSET_MANIFEST = Object.freeze({
  background: '/assets/background.png',
  in_background_overlay: '/assets/in_background_overlay.png',
  table_back: '/assets/table_back.png',
  table_front: '/assets/table_front.png',
  table_round_base_v1: '/assets/table_round_base_v1.png',
  sabotage_paw: '/assets/sabotage_paw.png',
  ...Object.fromEntries(
    Object.values(CAT_STATES).map((state) => [
      `cat_hole_${state}`,
      state === CAT_STATES.WARNING ? '/assets/cat_hole_hidden.png' : `/assets/cat_hole_${state}.png`,
    ]),
  ),
  ...Object.fromEntries(
    Object.values(CAT_STATES).map((state) => [
      `cat_round_${state}`,
      state === CAT_STATES.WARNING || state === CAT_STATES.HIDE
        ? '/assets/cat_round_hidden_v1.png'
        : `/assets/cat_round_${state}_v1.png`,
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
  home_card: '/assets/ui/home_card.png',
  btn_start_game: '/assets/ui/btn_start_game.png',
  btn_start_game_hover: '/assets/ui/btn_start_game_hover.png',
  score_bar: scoreBarUrl,
  health_bar: healthBarUrl,
  combo_x2: '/assets/ui/combo_x2.png',
  combo_x3: '/assets/ui/combo_x3.png',
  combo_x4: '/assets/ui/combo_x4.png',
  pause_panel: '/assets/ui/pause_panel.png',
  win_cat_peek: '/assets/ui/win_cat_peek.png',
  win_panel_bg: '/assets/ui/win_panel_bg.png',
  win_star: '/assets/ui/win_star.png',
});

export function preloadContractAssets(scene, { useRealAssets = false } = {}) {
  if (!useRealAssets) return;

  Object.entries(ASSET_MANIFEST).forEach(([key, path]) => {
    scene.load.image(key, path);
  });
}
