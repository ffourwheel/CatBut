# CatKub — AI Work Split

เอกสารนี้ใช้แบ่งงานให้ AI สองตัวทำงานคู่ขนาน โดยลดการแก้ไฟล์ทับกันและใช้ Modular Table + Cat Assembly Contract เดียวกัน

## สรุปสั้น

- **AI-1: SYSTEM / GAMEPLAY** เป็นเจ้าของ Logic, State Machine, Input, Score และ Integration
- **AI-2: UX/UI + ASSET** เป็นเจ้าของ Visual Direction, HUD, Screen Flow, Copy และ Asset Preparation
- AI-1 ต้องประกาศ Assembly Contract ก่อน
- หลัง Contract นิ่ง ทั้งสอง AI ทำงานคู่ขนานได้
- AI-1 เป็นผู้รวม Asset และ UI เข้ากับ Gameplay ตอนท้าย

## Ownership Boundary

### AI-1 — SYSTEM / GAMEPLAY DEVELOPMENT

รับผิดชอบ:

- Phaser 3 + Vite + Vanilla JavaScript
- Responsive 9:16 และ Input Mouse/Touch
- `catTableContainer`
- `tableBack`, `catState`, `tableFront`
- Button State และ Press-and-Hold
- Progress Decay
- Cat State Machine และ Cat Event Scheduler
- WATCH, ATTACK, SABOTAGE และ Cooldown
- Health, Score, Combo, Win, Game Over, Retry และ Pause
- Debug Config และ Acceptance Test Notes
- เชื่อม Asset/UX ที่ AI-2 ส่งมอบเข้าเกมจริง

ไฟล์ที่ AI-1 เป็นเจ้าของ:

```text
src/game/**
src/main.js
src/config/**
index.html
package.json
vite.config.*
```

AI-1 ไม่ควรแก้โครงสร้าง Visual หรือสร้าง Asset ใหม่เอง ยกเว้น Placeholder ที่จำเป็นต่อการทดสอบ

### AI-2 — UX/UI DESIGN + ASSET PREPARATION

รับผิดชอบ:

- Visual Direction แบบ Cozy Cat Café
- Layout 9:16
- HUD: Score, Combo, Hearts, Progress และ Warning
- Start, Tutorial, Gameplay, Pause, Stage Clear และ Game Over
- Thai Copy และ Mali Typography
- Button Feedback และ Cat Feedback
- Animation/FX Specification
- เตรียม Asset แยกตาม Anchor Contract
- ตรวจภาพทุก State ว่าหลุมและ Perspective ตรงกัน
- ส่ง Asset Manifest และข้อจำกัดของ Asset ให้ AI-1

ไฟล์ที่ AI-2 เป็นเจ้าของ:

```text
assets/**
src/ui/**
src/styles/**
docs/design/**
```

AI-2 ไม่ควรแก้ Game Logic, Cat State Machine, Score หรือ Input Handling

### Shared Read-Only

ทั้งสอง AI อ่านได้ แต่ไม่ควรแก้โดยพลการ:

```text
CONTEXT.md
CATKUB_SUMMARY.md
AI_WORK_SPLIT.md
reference/**
prototype/**
```

หากต้องเปลี่ยนกติกา ต้องบันทึกข้อเสนอแยกก่อน แล้วให้ผู้ดูแลโปรเจกต์ยืนยัน

## ลำดับการทำงาน

### Phase 0 — AI-1 เริ่มก่อน

AI-1 ทำสิ่งต่อไปนี้ให้เสร็จก่อน:

1. สร้างโครงโปรเจกต์ Phaser/Vite
2. สร้าง `catTableContainer`
3. ประกาศ Canvas, Anchor, Origin และ Depth
4. ทำ Loader สำหรับชื่อ Asset ตาม Contract
5. ทำ Placeholder Assembly ที่สลับ Cat State ได้
6. เขียนไฟล์ `docs/design/ASSEMBLY_CONTRACT.md` หรือส่วน Contract ในเอกสารส่งมอบ

ผลลัพธ์ที่ต้องส่งให้ AI-2:

- Canvas Size: `1024 × 1024`
- Anchor: Center of Hole `(512, 512)`
- Origin: `(0.5, 0.5)`
- Depth: BACK `10`, MIDDLE `20`, FRONT `30`
- รายชื่อ Asset ที่ Loader รอรับ
- ห้ามเปลี่ยน Transform ระหว่าง State

### Phase 1 — AI-1 และ AI-2 ทำคู่ขนาน

AI-1 ทำ Core Gameplay ด้วย Placeholder:

- Button Hold
- Progress Decay
- Cat Warning/Watch
- Attack/Sabotage
- Health/Score/Combo

AI-2 ทำงาน Visual และ Asset:

- Wireframe และ HUD
- Screen Flow
- Thai Copy
- Table Back/Front
- Cat Hole States
- Button และ FX Specification

### Phase 2 — AI-2 ส่งมอบให้ AI-1

AI-2 ต้องส่ง:

- Asset Files
- Asset Manifest
- Canvas/Anchor Verification
- State-to-Feedback Matrix
- Font/Color/Spacing Tokens
- รายการไฟล์ที่ยังเป็น Placeholder

### Phase 3 — AI-1 Integration

AI-1 ทำสิ่งต่อไปนี้:

1. เปลี่ยน Placeholder เป็น Asset จริง
2. ตรวจว่าเปลี่ยนเฉพาะ `catState.texture`
3. เชื่อม HUD และ Screen Flow
4. เชื่อม Audio/FX
5. ทดสอบ Mobile และ Desktop
6. ส่ง Build ให้ AI-2 ตรวจ Visual อีกครั้ง

### Phase 4 — Final Review

- AI-2 ตรวจตำแหน่ง, Scale, Perspective, Typography และความชัดของ Warning
- AI-1 ตรวจ State Transition, Input, Timing, Score และ Edge Cases
- ผู้ดูแลโปรเจกต์ตัดสินใจเรื่องที่ขัดแย้งกัน

## Shared Assembly Contract

```text
catTableContainer
├── tableBack  → table_back.png       → Depth 10
├── catState   → cat_hole_[state].png → Depth 20
└── tableFront → table_front.png      → Depth 30
```

ทุก Layer ต้องใช้:

```text
Canvas: 1024 × 1024
Anchor: Center of Hole
Anchor Position: 512, 512
Origin: 0.5, 0.5
Scale: 1, 1
Rotation: 0
```

เมื่อ State เปลี่ยน:

```text
tableBack  ไม่เปลี่ยน
catState   เปลี่ยนเฉพาะ Texture
tableFront ไม่เปลี่ยน
```

## Prompt สำหรับ AI-1

```text
คุณรับผิดชอบ SYSTEM / GAMEPLAY DEVELOPMENT ของ CatKub เท่านั้น

อ่าน CONTEXT.md, CATKUB_SUMMARY.md และ AI_WORK_SPLIT.md ก่อนเริ่มงาน

สร้างระบบ Phaser 3 + Vite + Vanilla JavaScript โดยเริ่มจาก catTableContainer ที่มี 3 Layer:
tableBack, catState, tableFront

ใช้ Canvas 1024×1024, Anchor Center of Hole ที่ (512,512), Origin (0.5,0.5)
และ Depth 10/20/30 ตามลำดับ

เมื่อเปลี่ยน Cat State ให้เปลี่ยนเฉพาะ catState.texture ห้ามเปลี่ยน X, Y,
Scale, Rotation, Origin หรือ Transform ของโต๊ะและหลุม

ทำ Core Gameplay ตาม Summary: Press-and-Hold, Progress Decay, Warning,
WATCH, ATTACK, SABOTAGE, Health, Score, Combo, Win, Game Over, Retry และ Pause

ใช้ Placeholder ได้ และอย่าแก้ไฟล์ใน src/ui, src/styles หรือ assets นอกจากจำเป็นต่อการเชื่อมระบบ
ส่งมอบรายการไฟล์ที่สร้าง/แก้, วิธีรัน และวิธีตรวจว่า Layer ไม่กระโดด
```

## Prompt สำหรับ AI-2

```text
คุณรับผิดชอบ UX/UI DESIGN + ASSET PREPARATION ของ CatKub เท่านั้น

อ่าน CONTEXT.md, CATKUB_SUMMARY.md และ AI_WORK_SPLIT.md ก่อนเริ่มงาน

ออกแบบ Visual และเตรียม Asset สำหรับเกม 9:16 แนว Cozy Cat Café
ใช้ภาษาไทยและฟอนต์ Mali

เตรียม Table Back, Table Front และ cat_hole_[state] ทุก State
โดยใช้ Canvas 1024×1024 และ Anchor Center of Hole ที่ (512,512)
ทุก Cat State ต้องมีหลุม, Perspective, Scale และ Anchor ตรงกัน

ห้ามขยับโต๊ะหรือหลุมตาม Action ของแมว แขน/อุ้งเท้าใน ATTACK และ SABOTAGE
ให้ยื่นออกจาก Anchor เดิมเท่านั้น

ออกแบบ HUD, Warning, Button Feedback, Start, Tutorial, Pause,
Stage Clear และ Game Over พร้อม Thai Copy และ State-to-Feedback Matrix

อย่าแก้ Game Logic, Cat State Machine, Score หรือ Input Handling
ส่งมอบ Asset Manifest, รายการไฟล์, Anchor Verification และข้อจำกัดของ Asset ให้ AI-1
```

## Definition of Done สำหรับการแบ่งงาน

- AI-1 สามารถรัน Gameplay ได้แม้ยังใช้ Placeholder
- AI-2 มี Asset/UX ที่ตรงกับ Contract และตรวจ Anchor แล้ว
- ไม่มี AI ตัวใดแก้ไฟล์ขอบเขตของอีกตัวโดยไม่ได้รับอนุญาต
- AI-1 นำ Asset จริงมาแทน Placeholder ได้โดยไม่แก้ Transform
- เปลี่ยน Cat State แล้วโต๊ะและหลุมไม่กระโดด
- HUD และ Warning อ่านได้บนจอมือถือ
- Core Gameplay ผ่าน Acceptance Criteria ใน `CATKUB_SUMMARY.md`
