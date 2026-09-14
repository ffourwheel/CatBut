# CatKub UI Tokens & Design System

> **Role**: AI-2 (UX/UI Design + Asset Preparation)  
> **Target Version**: CatKub v1.0.0  
> **Aesthetic Theme**: Cozy Cat Café  
> **Related Code**:  
> - CSS Variables: [src/styles/tokens.css](file:///d:/Codesmash/game/CatKub/src/styles/tokens.css)  
> - JS Constants: [src/ui/UITokens.js](file:///d:/Codesmash/game/CatKub/src/ui/UITokens.js)  
> - Font Loading: [src/styles/fonts.css](file:///d:/Codesmash/game/CatKub/src/styles/fonts.css)

---

## 1. Visual Theme & Philosophy

**CatKub** blends Japanese café aesthetics ("Kissaten") with accessible arcade party gameplay. The visual tone is warm, comforting, and tactile—evoking a sunlit wooden cat café with handcrafted timber furniture, soft pastel accents, and expressive hand-drawn illustrations.

Key tenets:
- **Warmth over Clinical Tech**: Soft rounded radii, organic timber grain, creamy paper textures.
- **Instant Readability**: High contrast between active game elements (matcha green, amber, crimson) and warm neutral backgrounds.
- **Tactile Feedback**: Interactive elements respond with spring physics, soft shadows, and dynamic glow rings.

---

## 2. Color Palette & Tokens

### 2.1 Brand & Neutral Tones

| Token Name | Hex Code | RGB / RGBA | Role / Application |
| :--- | :--- | :--- | :--- |
| `color-bg-cream` | `#FBF6EE` | `rgb(251, 246, 238)` | Warm milk cream base canvas background |
| `color-wood-light` | `#E8D5B5` | `rgb(232, 213, 181)` | Light maple wood / card backdrops |
| `color-wood-medium`| `#C69C6D` | `rgb(198, 156, 109)` | Honey oak accents / borders / unpressed button base |
| `color-wood-dark`  | `#8D5B35` | `rgb(141, 91, 53)` | Rich caramel wood / modal frames / button rims |
| `color-espresso`   | `#4A3728` | `rgb(74, 55, 40)` | Dark roast espresso / primary typography & outlines |
| `color-charcoal`   | `#2C1810` | `rgb(44, 24, 16)` | Deepest coffee bean / highest contrast text |

### 2.2 Gameplay & State Tones

| Token Name | Hex Code | RGB / RGBA | Role / Application |
| :--- | :--- | :--- | :--- |
| `color-active-matcha` | `#4CAF50` | `rgb(76, 175, 80)` | Button charging progress ring / active status |
| `color-caution-amber` | `#FF9800` | `rgb(255, 152, 0)` | Cat warning state / early release decay ring |
| `color-danger-crimson`| `#F44336` | `rgb(244, 67, 54)` | Cat attack strike / lost hearts / game over |
| `color-gold-star`     | `#FFD700` | `rgb(255, 215, 0)` | Completed button paw / combo badges / stage stars |
| `color-star-rim`      | `#FFA000` | `rgb(255, 160, 0)` | Stroke for golden stars & victory ribbons |
| `color-sky-accent`    | `#81D4FA` | `rgb(129, 212, 250)` | Secondary buttons / tutorial highlights |

### 2.3 Glassmorphism & Translucent Overlays

| Token Name | RGBA Code | Role / Application |
| :--- | :--- | :--- |
| `overlay-scrim-dark`  | `rgba(44, 24, 16, 0.75)` | Pause, Game Over, and Stage Clear modal backdrop |
| `overlay-scrim-light` | `rgba(251, 246, 238, 0.85)` | Tutorial card glass surface |
| `overlay-hud-bar`     | `rgba(255, 255, 255, 0.90)` | Top HUD header bar backdrop with soft blur |
| `overlay-bubble`      | `rgba(255, 255, 255, 0.95)` | Warning exclamation comic bubble |

---

## 3. Typography System (`Mali` Handwriting)

To maintain an inviting, handmade café character, CatKub uses the Google Font **Mali** (Thai + Latin) bundled locally in `assets/fonts/`.

### 3.1 Typeface Configuration

- **Family**: `'Mali', cursive, sans-serif`
- **Files**:
  - `assets/fonts/Mali-Regular.ttf` (Weight: 400)
  - `assets/fonts/Mali-Bold.ttf` (Weight: 700)

### 3.2 Type Scale Hierarchy

| Style Role | Font Size | Weight | Line Height | Letter Spacing | Usage in CatKub |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Title** | `48px` | 700 Bold | `1.2` | `-0.5px` | Main Title screen ("CatKub แมวแอบมอง") |
| **Heading 1** | `36px` | 700 Bold | `1.25` | `0px` | Modal banners ("ผ่านด่านสำเร็จ!", "หมดพลังแล้ว!") |
| **Heading 2** | `28px` | 700 Bold | `1.3` | `0px` | Section titles, Pause modal header |
| **Body Large** | `22px` | 700 Bold | `1.35` | `0px` | Action button labels ("เริ่มเล่น", "เล่นต่อ", "ด่านต่อไป") |
| **Body Regular** | `18px` | 400 Regular| `1.4` | `0px` | Tutorial instructional descriptions, dialog text |
| **HUD Stat** | `20px` | 700 Bold | `1.2` | `0.5px` | Score numbers, combo multipliers (`×3`) |
| **Caption / Micro** | `14px` | 400 Regular| `1.3` | `0px` | Tooltips, copyright, version tags |

---

## 4. Spacing Scale & Layout Grid

```text
4px   ─── space-xs    (Icon padding, badge borders)
8px   ─── space-sm    (Gap between stat icons and text)
12px  ─── space-md    (HUD internal padding, pill margins)
16px  ─── space-lg    (Standard element separation)
24px  ─── space-xl    (Modal card internal padding)
32px  ─── space-2xl   (Screen edges, button spacing)
48px  ─── space-3xl   (Modal margin, hero section gap)
```

---

## 5. Safe Areas & Responsive Adaptation

CatKub is engineered for full cross-platform responsiveness on mobile web, tablets, and desktop browsers.

### 5.1 Mobile Portrait Safe Areas (9:16 Aspect Ratio)

- **Top Safe Area**: Minimum `44px` reserved for notch, camera punch-hole, and mobile browser address bars. The top HUD is anchored below `y = 44px`.
- **Bottom Safe Area**: Minimum `34px` reserved for iOS Home Indicator and Android navigation bars.
- **Side Safe Area**: `16px` left and right horizontal padding.

### 5.2 Desktop & Tablet Scaling

- **Phaser Scale Mode**: `Phaser.Scale.FIT` with `autoCenter: Phaser.Scale.CENTER_BOTH`.
- **Game Dimensions**: Virtual resolution of `1024 × 1024 px`.
- **Pillarboxing / Letterboxing**: Centered on wide aspect screens (16:9, 16:10, 21:9) with ambient café cream background filling the gutter margins.

---

## 6. Mobile Touch Target Ergonomics

To ensure fast, frustration-free finger interaction on touchscreens:

1. **Table Button Placement**:
   - Four interactive buttons located symmetrically around the center hole:
     - Top-Left: `(300, 300)`
     - Top-Right: `(724, 300)`
     - Bottom-Left: `(300, 724)`
     - Bottom-Right: `(724, 724)`
   - Distance from table center `(512, 512)`: **~300 px**, providing generous ~100px safety clearance from the center cat hole.
2. **Expanded Hit Areas (+25%)**:
   - Visual button radius: `48 px` (diameter `96 px`).
   - Interactive touch collider: Expanded by **+25%** to radius `60 px` (diameter `120 px`).
   - Prevents missed taps or accidental early touch-up triggers on small mobile screens.
3. **HUD Button Targets**:
   - Pause button and Sound toggle button rendered at `48 × 48 px` with expanded `56 × 56 px` hitzones.

---

## 7. Depth (Z-Index) Hierarchy

Every visual element is mapped to a strict depth hierarchy to prevent visual popping or z-fighting:

```text
Depth   Layer / Element Name           Description
─────   ────────────────────────────   ─────────────────────────────────────────────
  0     background                     Cozy café room background
 10     tableBack                      Table top wooden surface & rear perspective
 20     catState                       7-state cat texture inside center hole
 30     tableFront                     Table front rim, apron, and front legs
 40     tableButtons                   4 interactive wooden button bases
 45     buttonRings / buttonFX         Radial charging rings & touch feedback glow
100     HUDContainer                   Top bar, hearts, score, combo badge, controls
120     warningBubble                  Comic alert bubble above cat during WARNING
150     floatingParticles              Star bursts, sparkle particles, smoke puffs
200     modalBackdrop                  Dark mocha scrim overlay (alpha 0.75)
210     modalDialogContainer           Active modal card (Tutorial, Pause, Clear, Over)
300     toastAlerts                    High-priority system messages / banner alerts
```
