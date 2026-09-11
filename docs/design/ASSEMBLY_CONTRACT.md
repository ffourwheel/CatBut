# CatKub Assembly Contract

เอกสารนี้เป็น Shared Contract ระหว่าง SYSTEM / GAMEPLAY กับ UX/UI + ASSET

## Canvas และ Anchor

- Canvas: `1024 × 1024`
- Anchor: Center of Hole ที่ `(512, 512)`
- ทุก Layer ใช้ Origin `(0.5, 0.5)`
- Scale `(1, 1)`
- Rotation `0`

## Layer Structure

```text
catTableContainer
├── tableBack  → table_back.png       → Depth 10
├── catState   → cat_hole_[state].png → Depth 20
└── tableFront → table_front.png      → Depth 30
```

Runtime object names ต้องเป็น `catTableContainer`, `tableBack`, `catState` และ `tableFront`

## State Switching

เมื่อ Cat State เปลี่ยน ให้เปลี่ยนเฉพาะ Texture ของ `catState`:

- `tableBack` ไม่เปลี่ยน
- `catState` เปลี่ยน Texture เท่านั้น
- `tableFront` ไม่เปลี่ยน
- ห้ามเปลี่ยน X, Y, Scale, Rotation หรือ Origin ระหว่าง State

## Required Asset Keys

```text
table_back
table_front
cat_hole_hidden
cat_hole_warning
cat_hole_peek
cat_hole_watch
cat_hole_attack
cat_hole_sabotage
cat_hole_hide
```

## Placeholder Rule

ระบบ Gameplay ต้องรันได้โดยไม่ต้องรอ Asset จริง โดยใช้ Placeholder Texture ที่สร้างใน Runtime และใช้ Asset Loader keys ชุดเดียวกัน เมื่อ Asset จริงพร้อมใช้งาน ให้เปลี่ยนเฉพาะแหล่ง Texture โดยไม่เปลี่ยน Transform
