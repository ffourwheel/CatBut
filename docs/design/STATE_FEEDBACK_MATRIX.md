# CatKub State Feedback Matrix

> **Role**: AI-2 (UX/UI Design + Asset Preparation)  
> **Target Version**: CatKub v1.0.0  
> **Status**: Approved & Ready for AI-1 Integration  
> **Related Files**:  
> - Copywriting: [src/ui/CopyThai.js](file:///d:/Codesmash/game/CatKub/src/ui/CopyThai.js)  
> - Effects: [src/ui/FeedbackEffects.js](file:///d:/Codesmash/game/CatKub/src/ui/FeedbackEffects.js)  
> - Tokens: [src/ui/UITokens.js](file:///d:/Codesmash/game/CatKub/src/ui/UITokens.js)

---

## 1. Overview & Multi-Sensory Design Principles

CatKub’s core loop relies on **fast tap timing and high-stakes risk vs. reward** wrapped in a comforting **Cozy Cat Café** aesthetic.
To deliver intuitive, arcade-feel readability on mobile devices without cognitive overload, every state change synchronizes across four sensory channels:

1. **Visual Cues**: Clear contrast shifts, target highlights, comic warning bubbles, screen shakes, and celebratory particle bursts.
2. **Audio Hooks**: Distinct event IDs mapped to cozy café sound effects (purrs, meows, bell chimes, paw swipes, wood taps).
3. **Motion / Tweens**: Tactile spring physics, squash & stretch, and camera vibration parameters.
4. **Thai Typography**: Warm, friendly, culturally natural Thai micro-copy rendered with the `Mali` typeface.

---

## 2. Interactive Button State Matrix

The four interactive wooden buttons sit on the café table surface at `(300, 300)`, `(724, 300)`, `(300, 724)`, and `(724, 724)`.

| State | Visual Feedback | Audio Cue Hook | Animation / Tween Parameters | Thai Copy / Tooltip |
| :--- | :--- | :--- | :--- | :--- |
| **OFF**<br>`(Idle / Ready)` | `btn_off` texture. Warm caramel wood base with soft ambient glow. | `sfx_button_tap_soft` (Cozy wooden click on first touch) | Tap feedback: quick press/pop and subtle glow. | "แตะเพื่อเปิด!" |
| **ON**<br>`(Activated)` | `btn_on` texture. Golden paw print center emblem. Solid gold ring outline. Emits 8–12 golden star particles outwards. | `sfx_button_complete` (Crisp golden café order bell ding / chime) | Punch scale to `1.15` then settles to `1.0` (`Back.easeOut`, 200ms). Golden ring pulse. | "สำเร็จ! 1/4" (นับตามปุ่ม) |
| **SABOTAGED**<br>`(Cat Swipe)` | Button texture dims, red claw scratch mark flashes across face. Button returns to OFF. | `sfx_cat_sabotage_swipe` (Mischievous cat paw swipe + soft wood rattle) | Rapid rotational wobble: `[-8°, +8°, -4°, 0°]` over 240ms (`Sine.easeInOut`). Red flash tint `#F44336` for 180ms. | "โดนแมวกวนแล้ว!" |

---

## 3. Cat State Matrix (Center Hole Layer)

Rendered at Depth 20 between `tableBack` (Depth 10) and `tableFront` (Depth 30). Center anchor is locked at `(512, 512)`.

| State | Visual Feedback | Audio Cue Hook | Animation / Motion Parameters | Thai Status / Warning |
| :--- | :--- | :--- | :--- | :--- |
| **HIDDEN** | `cat_hole_hidden` texture. Hole interior is shadowed. Cat is completely submerged inside. Safe to press buttons. | `None` / Ambient café BGM | Static texture. No camera shake. | "แมวยังไม่เห็น..." |
| **WARNING** | `cat_hole_warning` texture. Cat ears twitching above rim. Animated `warning_bubble` with comic sweat drops / "!" pops above hole. | `sfx_cat_warning_purr` (Low tension rustling / soft warning purr alert) | Cat bobbing vertically `y = 512 ± 3px` (`Sine.easeInOut`, 300ms loop). Warning bubble scales `0 → 1.1 → 1.0` (`Back.easeOut`, 180ms). | "ระวังนะ! แมวเริ่มได้ยิน!" |
| **PEEK** | `cat_hole_peek` texture. Cat head half raised, wide curious round eyes scanning the café table. | `sfx_cat_peek_meow` (Short, high-pitched curious kitten squeak / meow) | Quick vertical peek-up tween (`Cubic.easeOut`, 120ms). Head tilt `±1.5°`. | "แมวเริ่มมองหา..." |
| **WATCH**<br>`(DANGER)` | `cat_hole_watch` texture. Cat fully raised, piercing direct glare. Golden eye glint FX. **High Danger: Tapping a button triggers instant strike!** | `sfx_cat_watch_stinger` (Tense violin / pizzicato sharp stinger + tense cat growl) | Instant lock freeze. Cat scale scales up slightly to `1.025` for intimidation (`Power2.easeOut`, 80ms). Pulsing red vignette around screen edge. | "แมวจ้องอยู่! อย่าแตะปุ่มตอนนี้!" |
| **ATTACK** | `cat_hole_attack` texture. Fast lunge forward with claws extended. Red edge fade, three claw scratches, and the damaged heart reacts in the HUD. | `sfx_cat_attack_shriek` (Angry cat shriek / strike slap sound) | Camera shake `intensity = 0.014, duration = 250ms`; coral flash fades over 180ms; claw scratch overlay appears for roughly 250–350ms. | "กดตอนแมวจ้อง! เสีย ♥ 1 ดวง" |
| **SABOTAGE** | `cat_hole_sabotage` texture. Cat paw reaches out laterally toward an active button to reset it. | `sfx_cat_mischief` (Playful villainous meow + paw swipe thud) | Paw swipe tween toward target button coordinate (`Quad.easeInOut`, 220ms). Button triggers SABOTAGED state. | "แมวแอบปิดปุ่ม!" |
| **HIDE** | `cat_hole_hide` texture. Cat plunges back down into hole. 3 downward motion retreat lines visible. Safe again. | `sfx_cat_retreat_whoosh` (Soft quick whoosh / slide down sound) | Rapid downward sink transition back to `cat_hole_hidden` (`Cubic.easeIn`, 160ms). | "แมวมุดกลับแล้ว! ปลอดภัย!" |

Cat Mood uses a generated floating bubble cue: sleepy uses `Z`, curious uses `?`, annoyed uses twitch marks, and angry uses a red-orange comic anger symbol. The cue is a UI layer that follows the head anchor without inheriting Cat Rig rotation or scale; the action Warning cue remains in front, and the Mood cue is hidden while the cat faces away during SABOTAGE or HIDE. The HUD keeps a compact four-segment Mood pill as fallback.

---

## 4. Game Flow & Screen Transition Matrix

| Game State | Screen / Overlay | Key UI Elements | Audio Cue Hook | Primary Call to Action |
| :--- | :--- | :--- | :--- | :--- |
| **START** | Start Screen | Warm café background, floating logo "CatKub แมวแอบมอง", highest score record badge, pulsing "เริ่มเล่น" button. | `bgm_cafe_cozy` (Acoustic guitar + warm café piano BGM loop) | **เริ่มเล่น** (`btn_start`) |
| **TUTORIAL** | Micro-Tutorial Modal | 3 swipeable/clickable cards:<br>1. **แตะครั้งเดียวเปิดปุ่ม** (Tap to activate)<br>2. **แมวจ้องให้ชะลอการแตะ** (Wait while watched)<br>3. **ครบ 4 ปุ่มชนะ!** (Complete all 4 to win) | `sfx_tutorial_page_flip` (Soft paper rustle / card flip) | **เข้าใจแล้ว! ลุยเลย** (`btn_tutorial_ready`) |
| **GAMEPLAY** | In-Game HUD | Top Bar: Hearts (`3/3`), compact Score display, Combo badge (`×1`..`×4`), Progress indicator (`0/4`..`4/4`), four-level Cat Mood meter, Pause button, Sound toggle. | In-game dynamic audio mix | Interactive game loop |
| **PAUSE** | Pause Modal | Mocha translucent backdrop (`rgba(44, 24, 16, 0.75)`), "พักชั่วคราว", Resume button, Restart button, BGM/SFX sliders. | `sfx_pause_open` / `sfx_pause_close` | **เล่นต่อ** (`btn_resume`) / **เริ่มใหม่** (`btn_restart`) |
| **STAGE_CLEAR** | Victory Modal | Golden ribbon banner "ผ่านด่านสำเร็จ!", 3 bouncing stars, Score summary breakdown, Combo bonus, "ด่านต่อไป" button. | `sfx_stage_clear_jingle` (Triumphant brass chime & purring fanfar) | **ด่านต่อไป** (`btn_next_stage`) |
| **GAME_OVER** | Defeat Modal | Tearful whimsical cat illustration, "หมดพลังแล้ว!", Final score record, Best combo, "เล่นอีกครั้ง" pulsing button. | `sfx_game_over_jingle` (Whimsical playful sad trombone / meow sigh) | **เล่นอีกครั้ง** (`btn_retry`) |

---

## 5. Multi-Sensory Synchronization Timing Guidelines

1. **Cat Warning to Watch Grace Period**:
   - When transitioning from `WARNING` to `WATCH`, provide a visual anticipation buffer of **300ms–500ms** (ears twitch + warning bubble pops).
   - A tap during `WARNING` remains allowed; a tap during `WATCH` triggers `ATTACK`.
2. **Autonomous Action Readability**:
   - Start Cat Events from the random timer as the primary source of action. A successful activation may trigger Tap Pressure, but it must not happen every time.
   - Keep the final `Sabotage Target` highlight readable before the paw reaches it, and never overlap two paw animations.
3. **Audio-Visual Haptic Parity**:
   - On mobile devices supporting the Web Vibration API (`navigator.vibrate`), fire a `25ms` light vibration on tap and a heavy `100ms` pulse on `ATTACK`.
