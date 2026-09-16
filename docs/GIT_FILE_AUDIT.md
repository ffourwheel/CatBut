# Git upload file audit

Checked: 2026-09-16

## Results

- Tracked files inspected: 264.
- Source files: 29; unreachable from src/main.js: 0.
- Assets without runtime or preview references: 13 (10.47 MiB).
- Assets used only by prototypes: 1.
- Tests: 54 passed, 0 failed. Production build passed with a bundle-size warning.
- Deleted the 13 unused assets listed below (10.47 MiB). No Git commit/push performed.

## Deleted assets with no runtime or preview references

These assets were deleted after user approval. Historical design documents may still discuss these superseded assets. Detection includes dynamic cat state paths, manifest imports, CSS fonts and prototype paths.

- `assets/background_composite.png`
- `assets/cat-rig/cat_reach_arm_left.png`
- `assets/cat-rig/cat_reach_arm_right.png`
- `assets/cat-rig/cat_reach_body.png`
- `assets/cat-rig/cat_reach_head.png`
- `assets/cat-rig/cat_reach_v3_forearm_left.png`
- `assets/cat-rig/cat_reach_v3_forearm_right.png`
- `assets/cat-rig/cat_reach_v3_upper_arm_left.png`
- `assets/cat-rig/cat_reach_v3_upper_arm_right.png`
- `assets/ui/button_base_off.png`
- `assets/ui/button_base_on.png`
- `assets/ui/heart.png`
- `assets/ui/star.png`

## Prototype-only assets

- `assets/cat_hole_warning.png`

## Development material outside the runtime

- reference/: 34 images, 40.92 MiB; design references. Some images are used by prototype/real-image-assembly-example.html. Keep if preserving design history.
- prototype/: 2 standalone assembly previews.
- dev/cat-rig-preview.html: active animation tuning preview; keep for development.
- .agents/: 100 skill files; development tooling, optional for the game repository.
- skills-lock.json: skill installation metadata; optional together with .agents/.
- docs/, CONTEXT.md, CATKUB_SUMMARY.md, AI_WORK_SPLIT.md: documentation; not dead game code.
- tests/: keep to validate gameplay.
- package-lock.json: keep for reproducible dependency installation.

## Git ignore status

node_modules/ and dist/ are ignored and not tracked. Deleted assets appear as deletions in Git; development material listed above is already tracked. Adding them to .gitignore alone will not remove them from future commits. Existing published history, if any, is unaffected by later cleanup.

## Deployment issue resolved

AssetManifest.js now imports all runtime PNGs with ?url, including dynamic cat states. Vite emits hashed files or embeds small images into the bundle. A production build regression test verifies image contents are included.

## Identical file contents (SHA-256)

Duplicates may serve different paths. Do not remove files that still have consumers without updating those references.

- `assets/background.png`
- `reference/background.png`

- `assets/cat_hole_hidden.png`
- `assets/cat_hole_hide.png`
- `assets/cat_hole_warning.png`

- `assets/ui/button_base_off.png`
- `assets/ui/button_off.png`

- `assets/ui/button_base_on.png`
- `assets/ui/button_on.png`

- `assets/ui/combo_x2.png`
- `reference/combo-x2.png`

- `assets/ui/combo_x3.png`
- `reference/combo-x3.png`

- `assets/ui/combo_x4.png`
- `reference/combo-x4.png`

- `assets/ui/health_bar.png`
- `reference/HealthBar.png`

- `assets/ui/heart.png`
- `assets/ui/star.png`
- `assets/ui/heart_full.png`

- `assets/ui/score_bar.png`
- `reference/ScoreBar.png`

- `assets/ui/star.png`
- `assets/ui/star_icon.png`

- `assets/ui/warning.png`
- `assets/ui/warning_bubble.png`

## Limits

Static file reference and import inspection, not a browser gameplay verification or proof that every exported function is used. Dependencies/build output were checked through Git ignore status rather than auditing vendor internals. Manifest assets are considered used even if a current visual mode does not display them.


