import { CAT_STATES } from './constants.js';
import scoreBarUrl from '../../assets/ui/score_bar.png?url';
import healthBarUrl from '../../assets/ui/health_bar.png?url';
import { ASSET_KEYS } from './AssetKeys.js';
import { MOOD_CUE_FRAME_SIZE } from '../ui/MoodCue.js';
import { CAT_CLAW_CUTSCENE_FRAME_SIZE } from '../ui/CatAttackCutscene.js';

export { ASSET_KEYS } from './AssetKeys.js';

export const ASSET_MANIFEST = Object.freeze({
  background: '/assets/background.png',
  in_background_overlay: '/assets/in_background_overlay.png',
  table_back: '/assets/table_back.png',
  table_front: '/assets/table_front.png',
  sabotage_paw: '/assets/sabotage_paw.png',
  cat_rig_head: '/assets/cat-rig/cat_rig_head.png',
  cat_rig_paws: '/assets/cat-rig/cat_rig_paws.png',
  cat_reach_body_v2: '/assets/cat-rig/cat_reach_v2_body.png',
  cat_reach_head_v2: '/assets/cat-rig/cat_reach_v2_head.png',
  cat_reach_sleep_head_v3: '/assets/cat-rig/cat_reach_v3_sleep_head.png',
  cat_reach_gaze_v3: '/assets/cat-rig/cat_reach_v3_gaze.png',
  cat_reach_arm_left_v2: '/assets/cat-rig/cat_reach_v2_arm_left.png',
  cat_reach_arm_right_v2: '/assets/cat-rig/cat_reach_v2_arm_right.png',
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
  cat_mood_bubbles: '/assets/ui/cat_mood_bubbles.png',
  cat_claw_cutscene: '/assets/ui/cat_claw_cutscene.png',
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
    if (key === ASSET_KEYS.ui.catMoodBubbles) {
      scene.load.spritesheet(key, path, {
        frameWidth: MOOD_CUE_FRAME_SIZE,
        frameHeight: MOOD_CUE_FRAME_SIZE,
      });
      return;
    }
    if (key === ASSET_KEYS.ui.catClawCutscene) {
      scene.load.spritesheet(key, path, {
        frameWidth: CAT_CLAW_CUTSCENE_FRAME_SIZE,
        frameHeight: CAT_CLAW_CUTSCENE_FRAME_SIZE,
      });
      return;
    }
    scene.load.image(key, path);
  });
}
