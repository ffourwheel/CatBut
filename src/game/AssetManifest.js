import backgroundUrl from '../../assets/background.png?url';
import in_background_overlayUrl from '../../assets/in_background_overlay.png?url';
import table_backUrl from '../../assets/table_back.png?url';
import table_frontUrl from '../../assets/table_front.png?url';
import sabotage_pawUrl from '../../assets/sabotage_paw.png?url';
import cat_rig_cat_rig_headUrl from '../../assets/cat-rig/cat_rig_head.png?url';
import cat_rig_cat_rig_pawsUrl from '../../assets/cat-rig/cat_rig_paws.png?url';
import cat_rig_cat_reach_v2_bodyUrl from '../../assets/cat-rig/cat_reach_v2_body.png?url';
import cat_rig_cat_reach_v2_headUrl from '../../assets/cat-rig/cat_reach_v2_head.png?url';
import cat_rig_cat_reach_v3_sleep_headUrl from '../../assets/cat-rig/cat_reach_v3_sleep_head.png?url';
import cat_rig_cat_reach_v3_gazeUrl from '../../assets/cat-rig/cat_reach_v3_gaze.png?url';
import cat_rig_cat_reach_v2_arm_leftUrl from '../../assets/cat-rig/cat_reach_v2_arm_left.png?url';
import cat_rig_cat_reach_v2_arm_rightUrl from '../../assets/cat-rig/cat_reach_v2_arm_right.png?url';
import cat_hole_hiddenUrl from '../../assets/cat_hole_hidden.png?url';
import ui_button_offUrl from '../../assets/ui/button_off.png?url';
import ui_button_onUrl from '../../assets/ui/button_on.png?url';
import ui_heart_fullUrl from '../../assets/ui/heart_full.png?url';
import ui_heart_emptyUrl from '../../assets/ui/heart_empty.png?url';
import ui_star_iconUrl from '../../assets/ui/star_icon.png?url';
import ui_cat_pawUrl from '../../assets/ui/cat_paw.png?url';
import ui_warning_bubbleUrl from '../../assets/ui/warning_bubble.png?url';
import ui_warningUrl from '../../assets/ui/warning.png?url';
import ui_cat_mood_bubblesUrl from '../../assets/ui/cat_mood_bubbles.png?url';
import ui_cat_claw_cutsceneUrl from '../../assets/ui/cat_claw_cutscene.png?url';
import ui_sound_onUrl from '../../assets/ui/sound_on.png?url';
import ui_sound_offUrl from '../../assets/ui/sound_off.png?url';
import ui_pause_iconUrl from '../../assets/ui/pause_icon.png?url';
import ui_home_cardUrl from '../../assets/ui/home_card.png?url';
import ui_btn_start_gameUrl from '../../assets/ui/btn_start_game.png?url';
import ui_btn_start_game_hoverUrl from '../../assets/ui/btn_start_game_hover.png?url';
import ui_combo_x2Url from '../../assets/ui/combo_x2.png?url';
import ui_combo_x3Url from '../../assets/ui/combo_x3.png?url';
import ui_combo_x4Url from '../../assets/ui/combo_x4.png?url';
import ui_pause_panelUrl from '../../assets/ui/pause_panel.png?url';
import ui_win_cat_peekUrl from '../../assets/ui/win_cat_peek.png?url';
import ui_win_panel_bgUrl from '../../assets/ui/win_panel_bg.png?url';
import ui_win_starUrl from '../../assets/ui/win_star.png?url';
import cat_hole_peekUrl from '../../assets/cat_hole_peek.png?url';
import cat_hole_watchUrl from '../../assets/cat_hole_watch.png?url';
import cat_hole_attackUrl from '../../assets/cat_hole_attack.png?url';
import cat_hole_sabotageUrl from '../../assets/cat_hole_sabotage.png?url';
import cat_hole_hideUrl from '../../assets/cat_hole_hide.png?url';
import { CAT_STATES } from './constants.js';
import scoreBarUrl from '../../assets/ui/score_bar.png?url';
import healthBarUrl from '../../assets/ui/health_bar.png?url';
import { ASSET_KEYS } from './AssetKeys.js';
import { MOOD_CUE_FRAME_SIZE } from '../ui/MoodCue.js';
import { CAT_CLAW_CUTSCENE_FRAME_SIZE } from '../ui/CatAttackCutscene.js';

export { ASSET_KEYS } from './AssetKeys.js';


// Imported URLs are emitted and hashed by Vite for production deployments.
const catStateUrls = Object.freeze({
  [CAT_STATES.HIDDEN]: cat_hole_hiddenUrl,
  [CAT_STATES.WARNING]: cat_hole_hiddenUrl,
  [CAT_STATES.PEEK]: cat_hole_peekUrl,
  [CAT_STATES.WATCH]: cat_hole_watchUrl,
  [CAT_STATES.ATTACK]: cat_hole_attackUrl,
  [CAT_STATES.SABOTAGE]: cat_hole_sabotageUrl,
  [CAT_STATES.HIDE]: cat_hole_hideUrl,
});

export const ASSET_MANIFEST = Object.freeze({
  background: backgroundUrl,
  in_background_overlay: in_background_overlayUrl,
  table_back: table_backUrl,
  table_front: table_frontUrl,
  sabotage_paw: sabotage_pawUrl,
  cat_rig_head: cat_rig_cat_rig_headUrl,
  cat_rig_paws: cat_rig_cat_rig_pawsUrl,
  cat_reach_body_v2: cat_rig_cat_reach_v2_bodyUrl,
  cat_reach_head_v2: cat_rig_cat_reach_v2_headUrl,
  cat_reach_sleep_head_v3: cat_rig_cat_reach_v3_sleep_headUrl,
  cat_reach_gaze_v3: cat_rig_cat_reach_v3_gazeUrl,
  cat_reach_arm_left_v2: cat_rig_cat_reach_v2_arm_leftUrl,
  cat_reach_arm_right_v2: cat_rig_cat_reach_v2_arm_rightUrl,
  ...Object.fromEntries(
    Object.values(CAT_STATES).map((state) => [
      `cat_hole_${state}`,
      catStateUrls[state],
    ]),
  ),
  button_off: ui_button_offUrl,
  button_on: ui_button_onUrl,
  btn_off: ui_button_offUrl,
  btn_holding: ui_button_offUrl,
  btn_on: ui_button_onUrl,
  heart_full: ui_heart_fullUrl,
  heart_empty: ui_heart_emptyUrl,
  heart: ui_heart_fullUrl,
  star_icon: ui_star_iconUrl,
  star: ui_star_iconUrl,
  cat_paw: ui_cat_pawUrl,
  warning_bubble: ui_warning_bubbleUrl,
  warning_mark: ui_warningUrl,
  cat_mood_bubbles: ui_cat_mood_bubblesUrl,
  cat_claw_cutscene: ui_cat_claw_cutsceneUrl,
  sound_on: ui_sound_onUrl,
  sound_off: ui_sound_offUrl,
  pause_icon: ui_pause_iconUrl,
  home_card: ui_home_cardUrl,
  btn_start_game: ui_btn_start_gameUrl,
  btn_start_game_hover: ui_btn_start_game_hoverUrl,
  score_bar: scoreBarUrl,
  health_bar: healthBarUrl,
  combo_x2: ui_combo_x2Url,
  combo_x3: ui_combo_x3Url,
  combo_x4: ui_combo_x4Url,
  pause_panel: ui_pause_panelUrl,
  win_cat_peek: ui_win_cat_peekUrl,
  win_panel_bg: ui_win_panel_bgUrl,
  win_star: ui_win_starUrl,
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
