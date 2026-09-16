# CatKub Asset Manifest

> **Role**: AI-2 (UX/UI Design + Asset Preparation)  
> **Target Version**: CatKub v1.0.0  
> **Status**: Verified & Ready for Integration  
> **Related Contract**: [ASSEMBLY_CONTRACT.md](file:///d:/Codesmash/game/CatKub/docs/design/ASSEMBLY_CONTRACT.md)

---

## 1. Executive Summary

This document catalogues all visual and typographic assets produced by **AI-2** for the web game **CatKub**.  
All assembly assets strictly adhere to the [CatKub Assembly Contract](file:///d:/Codesmash/game/CatKub/docs/design/ASSEMBLY_CONTRACT.md):
- **Canvas Dimensions**: `1024 × 1024 px`
- **Center of Hole (Anchor)**: Exactly at `(512, 512) px`
- **Assembly Origin**: `(0.5, 0.5)` for table/catState/Cat Rig root; arm child layers use their shoulder pivot
- **Assembly Scale**: `(1.0, 1.0)`
- **Assembly Rotation**: `0`
- **Color Format**: 32-bit RGBA PNG with alpha transparency
- **Color Space**: sRGB

---

## 2. Core Assembly Assets (Cat Table 3-Layer Stack)

These assembly textures form the interactive centerpiece of CatKub. They are designed to be rendered within `catTableContainer` at coordinate `(512, 512)`. When the layered Cat Rig is available, Cat Motion Animation changes only the transparent cat layers; targeted sabotage uses a connected body/head/arm rig so the table and hole never rotate.

> Interim layout note: the runtime currently uses a generated flat circular placeholder for `tableBack` with a slightly wider horizontal radius, plus a transparent `tableFront` layer. The supplied rectangular table textures remain available for a later visual pass.

| Asset Key | File Path | Dimensions | Origin | Depth | Role / Description | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `table_back` | `assets/table_back.png` | `1024 × 1024` | `(0.5, 0.5)` | 10 | Wooden table surface, inner hole rim, rear table perspective | Verified |
| `cat_hole_hidden` | `assets/cat_hole_hidden.png` | `1024 × 1024` | `(0.5, 0.5)` | 20 | Cat fully hidden inside hole (dark depth shadow, idle) | Verified |
| `cat_hole_warning` | `assets/cat_hole_warning.png` | `1024 × 1024` | `(0.5, 0.5)` | 20 | Cat ears poking out with warning sweat / vibration cues | Verified |
| `cat_hole_peek` | `assets/cat_hole_peek.png` | `1024 × 1024` | `(0.5, 0.5)` | 20 | Cat half-head curious peek over the hole rim | Verified |
| `cat_hole_watch` | `assets/cat_hole_watch.png` | `1024 × 1024` | `(0.5, 0.5)` | 20 | Cat fully raised, watchful glare directly at player | Verified |
| `cat_hole_attack` | `assets/cat_hole_attack.png` | `1024 × 1024` | `(0.5, 0.5)` | 20 | Cat lunging forward with claws bared (strike state) | Verified |
| `cat_hole_sabotage` | `assets/cat_hole_sabotage.png` | `1024 × 1024` | `(0.5, 0.5)` | 20 | Cat paw reaching outward to swipe and reset a button | Verified |
| `sabotage_paw` | `assets/sabotage_paw.png` | `1254 × 1254` | `(0.29, 0.34)` | 35 | Legacy fallback end-effector; hidden when the connected Cat Reach Rig is available | Fallback |
| `cat_hole_hide` | `assets/cat_hole_hide.png` | `1024 × 1024` | `(0.5, 0.5)` | 20 | Cat rapidly retracting down into hole with motion lines | Verified |
| `table_front` | `assets/table_front.png` | `1024 × 1024` | `(0.5, 0.5)` | 15 | Front table edge, front wooden apron, front legs | Verified |
| `cat_rig_head` | `assets/cat-rig/cat_rig_head.png` | `1024 × 1024` | `(0.5, 0.5)` | 31 | Previous transparent head layer retained as a fallback/reference | Legacy fallback |
| `cat_rig_paws` | `assets/cat-rig/cat_rig_paws.png` | `1024 × 1024` | `(0.5, 0.5)` | 31 | Previous transparent paws layer retained as a fallback/reference | Legacy fallback |
| `cat_reach_body_v2` | `assets/cat-rig/cat_reach_v2_body.png` | `1254 × 1254` | `(0.5, 0.5)` | 31 | Compact round gray-tabby torso with broad shoulder sockets; root of the connected reach rig | Integrated |
| `cat_reach_head_v2` | `assets/cat-rig/cat_reach_v2_head.png` | `1254 × 1254` | `(0.5, 0.5)` | 31 | Compact round face with a tiny neck nub for body connection and target gaze | Integrated |
| `cat_reach_sleep_head_v3` | `assets/cat-rig/cat_reach_v3_sleep_head.png` | `1254 × 1254` | `(0.5, 0.5)` | 31 | Closed-eye head variant used by visible Sleep Idle | Integrated |
| `cat_reach_gaze_v3` | `assets/cat-rig/cat_reach_v3_gaze.png` | `1254 × 1254` | `(0.5, 0.5)` | 31 | Independent eye overlay that leads the target gaze before the head turn | Integrated |
| `cat_reach_arm_left_v2` | `assets/cat-rig/cat_reach_v2_arm_left.png` | `1254 × 1254` | `(0.8, 0.07)` | 31 | Compact continuous viewer-left arm and paw, selected for left-side targets | Integrated |
| `cat_reach_arm_right_v2` | `assets/cat-rig/cat_reach_v2_arm_right.png` | `1254 × 1254` | `(0.2, 0.1)` | 31 | Compact continuous viewer-right arm and paw, selected for right-side targets | Integrated |
| `cat_reach_upper_arm_left_v3` | `assets/cat-rig/cat_reach_v3_upper_arm_left.png` | `1254 × 1254` | `(0.8, 0.07)` | 31 | Legacy/reference segmented arm; not used by the runtime reach | Legacy |
| `cat_reach_upper_arm_right_v3` | `assets/cat-rig/cat_reach_v3_upper_arm_right.png` | `1254 × 1254` | `(0.2, 0.07)` | 31 | Legacy/reference segmented arm; not used by the runtime reach | Legacy |
| `cat_reach_forearm_left_v3` | `assets/cat-rig/cat_reach_v3_forearm_left.png` | `1254 × 1254` | `(0.8, 0.06)` | 31 | Legacy/reference segmented arm; not used by the runtime reach | Legacy |
| `cat_reach_forearm_right_v3` | `assets/cat-rig/cat_reach_v3_forearm_right.png` | `1254 × 1254` | `(0.2, 0.06)` | 31 | Legacy/reference segmented arm; not used by the runtime reach | Legacy |

### Layer Hierarchy Reference

```text
catTableContainer (Anchor: 512, 512)
├── tableBack   → table_back.png        [Depth: 10]
├── catState    → cat_hole_[state].png  [Depth: 30, fallback]
├── catRig      → body + head + near/far arm [Depth: 31]
├── tableFront  → table_front.png       [Depth: 15]
└── sabotagePaw → legacy fallback only   [Depth: 35]
```

`cat_hole_sabotage.png`, `cat_rig_head.png`, `cat_rig_paws.png`, and `sabotage_paw.png` remain available as fallback/reference assets. Runtime uses the v2 body/head with the v3 sleep/gaze layers and a compact single-piece v2 arm, selecting the arm connected to the shoulder on the target side. The v3 upper-arm/forearm assets remain legacy/reference only.

---

## 3. Environment & Background Assets

| Asset Key | File Path | Dimensions | Origin | Depth | Role / Description | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `background` | `assets/background.png` | `1024 × 1024` | `(0.5, 0.5)` | 0 | Cozy Cat Café interior with warm lighting, shelves, plants, and café props | Verified |

---

## 4. UI Icons & Interactive Elements

All UI elements are provided as transparent PNGs tailored for mobile touch targets and high-DPI displays.

| Asset Key | File Path | Dimensions | Depth | Usage & Placement |
| :--- | :--- | :--- | :--- | :--- |
| `btn_off` | `assets/ui/button_base_off.png` | `128 × 128` | 40 | Unpressed button base on table surface |
| `btn_holding` | `assets/ui/button_base_holding.png` | `128 × 128` | 40 | Pressed/charging button base with glowing green ring |
| `btn_on` | `assets/ui/button_base_on.png` | `128 × 128` | 40 | Activated button with golden paw emblem |
| `heart_full` | `assets/ui/heart_full.png` | `64 × 64` | 100 | Active player life indicator in top HUD |
| `heart_empty` | `assets/ui/heart_empty.png` | `64 × 64` | 100 | Lost player life indicator in top HUD |
| `star_icon` | `assets/ui/star_icon.png` | `64 × 64` | 100 | Score and combo badge icon |
| `cat_paw` | `assets/ui/cat_paw.png` | `64 × 64` | 100 | UI accent, menu badge, button icon |
| `warning_bubble` | `assets/ui/warning_bubble.png` | `96 × 96` | 100 | Comic exclamation bubble above cat during WARNING |
| `cat_mood_bubbles` | `assets/ui/cat_mood_bubbles.png` | `1254 × 1254` (2×2 frames, 627px each) | 60 | Generated floating Mood bubbles: sleepy, curious, annoyed, angry |
| `sound_on` | `assets/ui/sound_on.png` | `64 × 64` | 100 | Sound enabled button icon (top right HUD) |
| `sound_off` | `assets/ui/sound_off.png` | `64 × 64` | 100 | Sound muted button icon (top right HUD) |
| `pause_icon` | `assets/ui/pause_icon.png` | `64 × 64` | 100 | Pause modal trigger button (top right HUD) |

---

## 5. Typography Assets (Thai & Latin)

Embedded fonts ensure consistent display across all browsers and operating systems without external Google Fonts dependencies.

| Font Name | File Path | Format | Weight | Role |
| :--- | :--- | :--- | :--- | :--- |
| `Mali-Regular` | `assets/fonts/Mali-Regular.ttf` | TrueType | 400 | Regular body text, HUD values, tutorial cards |
| `Mali-Bold` | `assets/fonts/Mali-Bold.ttf` | TrueType | 700 | Titles, modal headers, combo badges, primary buttons |

- **CSS Font-Face Definition**: Located in [src/styles/fonts.css](file:///d:/Codesmash/game/CatKub/src/styles/fonts.css).
- **Font Family Name**: `'Mali', cursive, sans-serif`

---

## 6. Verification & Quality Assurance Data

1. **Hole Center Precision**:
   - Source reference hole center: `(622.5, 625.0)` in `1254 × 1254` source.
   - Normalized transform: `scale = 0.8165869`, `dx = +3.6746`, `dy = +1.6332`.
   - Exported hole center across all 7 cat states: Exactly `(512.0, 512.0)`.
   - Maximum spatial deviation: `0.0 px`.

2. **Table Symmetry**:
   - Left rim outer edge: `x = 25 px`.
   - Right rim outer edge: `x = 1000 px`.
   - Geometric center: `x = 512.5 px` (deviation from canvas center < 0.5px).

3. **Memory Footprint**:
   - Total PNG asset file size on disk: ~9.2 MB.
   - Uncompressed 32-bit RGBA GPU texture memory: ~48 MB.
   - Verified well within mobile web browser 128 MB VRAM budgets.
