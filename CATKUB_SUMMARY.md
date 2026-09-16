# CatKub — Design & Prototype Summary

เอกสารสรุปนี้รวบรวม Requirement, Design Decision และแนวทางพัฒนา Prototype ของเกม CatKub รวมถึงระบบประกอบโต๊ะและแมวแบบ 3 Layer

## 1. Game Overview

CatKub เป็นเกม 2D Arcade Stealth สำหรับ Web ที่ผู้เล่นต้องแตะปุ่มไฟบนโต๊ะเพื่อเปิดให้ครบ ขณะเดียวกันแมวในรูตรงกลางจะคอยตรวจจับผู้เล่นหรือแกล้งปิดปุ่มที่เปิดแล้ว

Core Loop:

```text
แตะเปิดปุ่ม → อ่าน Cat Action ที่สุ่มออกมา → หลบ WATCH และรับมือ SABOTAGE → Reactivation เมื่อถูกปิด → ทำซ้ำจนเปิดครบ
```

เป้าหมายของ Prototype คือทำให้ผู้เล่นรู้สึกว่า:

> “แตะปุ่มต่อเลย หรือรอจังหวะแมวก่อนจะเสี่ยงแตะ?”

## 2. Source Materials

- Requirement: `C:/Users/Punlawat.S/Downloads/cat_button_stealth_game_prompt.md`
- Visual References: `reference/gameplay-1.png`, `reference/gameplay-2.png`, `reference/gameplay-3.png`
- Table/Cat Reference: `reference/cat-1.png`
- Domain Glossary: `CONTEXT.md`

ภาพ Reference ใช้กำหนด Visual Direction และ Layout เท่านั้น ส่วนกติกา Gameplay ให้ยึดข้อสรุปในเอกสารนี้

## 3. Final Design Decisions

### Gameplay

| Topic | Decision |
|---|---|
| Tap Activation | แตะครั้งเดียวแล้วเปิดปุ่มทันที |
| Autonomous Cat Action | แมวสุ่ม WATCH หรือ SABOTAGE จาก Timer พื้นฐานทุกประมาณ 0.5–0.85 วินาที และมีช่วงพักขั้นต่ำ 0.5 วินาที |
| Tap Pressure | การเปิดปุ่มมีโอกาส 40% ที่จะเร่ง SABOTAGE แต่ไม่เกิดทุกครั้ง |
| Anti-Mash | แตะ 2 ครั้งภายใน 500ms จะเร่ง SABOTAGE แน่นอน และรอให้ Cat Action จบก่อนตัดสิน Stage Clear |
| Cat Warning | เตือนล่วงหน้าก่อนเข้า WATCH |
| Cat Watch | เข้า WATCH แล้วตรวจจับทันที และโจมตีได้ครั้งเดียวต่อ Cat Event |
| Cat Sabotage | ปิดได้เฉพาะปุ่มที่เป็น ON แล้ว ครั้งละ 1 ปุ่ม |
| Sabotage Cooldown | ตาม Difficulty config (ปกติ 0.8 วินาที) และมีช่วงพักขั้นต่ำ 0.5 วินาที |
| Cat Probability | Normal WATCH 60% ตอนเริ่ม และลดได้ถึง 35% / SABOTAGE 40–65% ตาม Stage Progress; Hard WATCH 70% |
| No Active Button | หากไม่มีปุ่ม ON ให้เลือก WATCH เสมอ |
| Player Health | เริ่มต้น 3 Hearts |
| Attack Recovery | ล็อก Input ประมาณ 0.5 วินาที |
| Combo | เพิ่มจากการเปิดปุ่มใหม่ และรีเซ็ตเมื่อถูกโจมตี |
| Combo Cap | สูงสุด x4 |
| Reactivation | เปิดปุ่มที่ถูก Sabotage ซ้ำได้ โดยคะแนนลดตามจำนวนครั้งและยังเพิ่ม Combo |
| Combo Duration | คอมโบหมดอายุหลังไม่มีการเปิดปุ่มสำเร็จ 2 วินาที |
| Score | ปุ่มใหม่ +10 × Combo, Reactivation +5 ถึง +1 × Combo และ Stage Clear Bonus 0 |
| Cat Mood | เพิ่มเฉพาะจาก Rapid Tap ครั้งละ 50; ง่วง/สนใจ/หงุดหงิด/โมโหเร่งระยะรอเป็น 100%/85%/70%/55% |
| Mood Cue | ใช้ generated 2×2 bubble spritesheet ลอยเหนือหัวแมว ติดตามหัวโดยไม่หมุนตาม Cat Rig; HUD ใช้ pill 4 ช่องเป็น fallback และ Mood จะ animate เฉพาะตอนเปลี่ยนระดับ |
| Attack Cutscene | ใช้ generated 2×2 claw spritesheet เล่นอุ้งเท้า → ปาด → รอยข่วน → ประกายจบ พร้อม vignette/fade |
| Win Priority | เปิดปุ่มครบก่อน Cat Event แรกจะรอให้แมวแสดงและจบ Event แรกก่อนจึงชนะ; หลังจากนั้นหยุด Cat Event เมื่อปุ่มครบ |
| Stage Scope | Prototype มี Stage เดียวที่รองรับ Difficulty Config |
| Pause | Freeze Timer, Cat State และ Progress ทั้งหมด |
| Resume | กลับมาเล่นพร้อมช่วงปลอดภัยประมาณ 0.5 วินาที |

### UX/UI

| Topic | Decision |
|---|---|
| Language | ภาษาไทยเป็นหลัก |
| Font | Mali แบบฝังไว้ในโปรเจกต์ |
| Visual Direction | Cozy Cat Café, โต๊ะไม้อุ่น ๆ, แมวน่ารักและเจ้าเล่ห์ |
| Warning Feedback | ใช้ Visual และ Audio ร่วมกัน ไม่พึ่งเสียงอย่างเดียว |
| Accessibility | ยังไม่รวมใน Prototype รุ่นแรก |
| Layout | 9:16 Portrait เป็นหลัก และรองรับ Desktop |
| Input | Touch/Mouse และรองรับทีละหนึ่ง Pointer |
| Tutorial | Micro Tutorial 3 ขั้นตอนแบบ Overlay |
| Screens | Start, Tutorial, Gameplay, Pause, Stage Clear, Game Over |
| Audio | เปิด Sound Effect เริ่มต้น พร้อมปุ่ม Mute |
| Cat Animation | ใช้ภาพแต่ละ State แล้วทำ Tween ไม่ต้องทำ Sprite หลายเฟรมใน Prototype |
| Browser Target | Chrome Android, Safari iPhone และ Chrome Desktop |

Working Title:

```text
CatKub — กดปุ่มให้ครบ ระวังแมว!
```

ข้อความหลัก:

- `แตะปุ่มให้ติดไฟ`
- `ระวัง! แมวกำลังจับตาดูนะ`
- `โดนจับแล้ว!`
- `แมวแกล้งปิดปุ่ม!`
- `เปิดครบแล้ว!`

## 4. Modular Table + Cat Assembly Contract

ระบบ Runtime ต้องประกอบจาก 3 Layer หลัก โดยทุก Layer ใช้ Canvas และ Anchor เดียวกัน

### Layer Order

```text
BACK   — table_back.png       — Depth 10
MIDDLE — cat_hole_[state].png — Depth 20
FRONT  — table_front.png      — Depth 30
```

Object Structure:

```text
catTableContainer
├── tableBack
├── catState
└── tableFront
```

### Anchor Contract

- Master Reference: `cat_hole_hidden.png`
- Canvas: `1024 × 1024`
- Anchor: Center of Hole
- Anchor Position: `(512, 512)`
- Origin: `(0.5, 0.5)`
- Scale: `(1, 1)`
- Rotation: `0`

### Required Cat State Assets

```text
cat_hole_hidden.png
cat_hole_warning.png
cat_hole_peek.png
cat_hole_watch.png
cat_hole_attack.png
cat_hole_sabotage.png
cat_hole_hide.png
```

ทุก State ต้องมี Canvas Size, ตำแหน่งหลุม, Perspective, Scale และ Anchor ตรงกัน สิ่งที่เปลี่ยนได้มีเฉพาะ Cat Pose, Expression, Action และ FX

### State Switching Rule

เมื่อแมวเปลี่ยน Action ให้เปลี่ยนเฉพาะ Texture ของ `catState`:

```text
tableBack คงเดิม
catState เปลี่ยน Texture
tableFront คงเดิม
```

ห้ามเปลี่ยน X, Y, Scale, Rotation, Origin หรือ Transform ของโต๊ะระหว่าง Gameplay

สำหรับ `ATTACK` และ `SABOTAGE` แขน/อุ้งเท้าสามารถยื่นออกจากรูได้ แต่ต้องขยายจาก Anchor เดิม ห้ามย้ายทั้ง Sprite

## 5. Workstream 1 — SYSTEM / GAMEPLAY DEVELOPMENT

### Implementation Order

1. สร้าง Phaser 3 + Vite + Vanilla JavaScript
2. ตั้งค่า Responsive 9:16 และ Prevent Browser Scroll
3. สร้าง `GameScene` และ `catTableContainer`
4. โหลดและประกอบ Table Back / Cat State / Table Front
5. สร้าง Button State และ Tap Activation
6. ทำ Pointer Session แบบแตะแล้วจบผลทันที
7. ทำ Cat State Machine และ Cat Event Scheduler
8. ทำ WATCH, ATTACK, SABOTAGE และ Cooldown
9. ทำ Health, Score, Combo และ Reactivation
10. ทำ Stage Controller สำหรับ Stage เดียว
11. ทำ Win, Game Over, Retry และ Pause
12. ทำ Audio/FX Hook
13. เพิ่ม Debug Config สำหรับปรับเวลาและ Probability
14. ทดสอบ Mobile Input และ Edge Cases

### Suggested Modules

```text
GameScene
ButtonManager
CatController
StageManager
ScoreManager
HealthManager
UIManager
AudioManager
```

อย่าแยกไฟล์ย่อยเกินจำเป็น ให้แต่ละ Module รับผิดชอบระบบที่มีความหมายต่อ Gameplay

## 6. Workstream 2 — UX/UI DESIGN

### Design Order

1. กำหนด Visual Direction, Color และ Typography
2. แยก Runtime Asset เป็น Table, Hole, Cat, Button, HUD และ FX
3. ออกแบบ HUD: Score, Combo, Hearts และ Progress
4. ออกแบบ Warning และ State Feedback ของแมว
5. ออกแบบ Button Feedback: Tap, ON, Sabotage และ Complete
6. ออกแบบ Start, Tutorial, Pause, Stage Clear และ Game Over
7. ทำ Thai Copy ด้วยฟอนต์ Mali
8. กำหนด Mobile Hit Area ใหญ่กว่าภาพจริงประมาณ 15–25%
9. ทำ Cat Pose Tween และ Button Animation
10. ทำ Mute, Safe Area และ Responsive Layout
11. ทดสอบความเข้าใจของ Warning, Progress และสถานะหัวใจ

### Feedback Matrix

| State | Visual | Audio |
|---|---|---|
| Tap Activation | Pop, Glow, Score Text | เสียงแตะ/เสียงสำเร็จ |
| Button Complete | Pop, Sparkle, Score Text | เสียงสำเร็จ |
| Warning | หู/ตาแมว, Warning Icon, Glow | เสียงเตือนสั้น |
| Watch | แมวจ้องชัดเจน | เสียงบรรยากาศ/เสียงค้าง |
| Attack | Screen Shake เบา ๆ, Heart ลด | เสียงตบ |
| Sabotage | Paw Animation, ปุ่มยุบ | เสียงแกล้ง |

## 7. Prototype Files

### Modular Assembly Logic Prototype

[prototype/modular-table-cat-assembly.html](prototype/modular-table-cat-assembly.html)

ใช้ Placeholder เมื่อไม่มี Asset จริง และมีความสามารถ:

- เปลี่ยน Cat State
- ดู Assembly แบบรวม
- ดู Layer แบบแยก
- ตรวจ Anchor และ Transform
- Guided Walkthrough
- Event Log

### Real Image Assembly Example

[prototype/real-image-assembly-example.html](prototype/real-image-assembly-example.html)

ใช้ `reference/cat-1.png` จริงซ้ำ 3 ครั้งด้วยตำแหน่งเดียวกัน แล้ว Clip พื้นที่เป็น BACK/MIDDLE/FRONT เพื่อสาธิตการประกอบอย่างง่าย

ข้อจำกัดของตัวอย่างนี้:

- ยังไม่ใช่ Asset แยกจริง
- ยังมี Cat Pose จริงเพียงภาพเดียว
- ใช้ CSS Clip เพื่ออธิบายหลักการเท่านั้น
- ยังไม่ใช่ Production Phaser Code

## 8. Asset Folder Contract

เมื่อมี Asset จริง ให้วางไว้ที่:

```text
assets/
├── table_back.png
├── table_front.png
├── cat_hole_hidden.png
├── cat_hole_warning.png
├── cat_hole_peek.png
├── cat_hole_watch.png
├── cat_hole_attack.png
├── cat_hole_sabotage.png
└── cat_hole_hide.png
```

ทุกไฟล์ต้องตรงกับ Master Reference ก่อนนำเข้าเกมจริง โดยเฉพาะตำแหน่งหลุมและขนาด Canvas

## 9. Prototype Acceptance Criteria

- เริ่มเกมได้
- แตะครั้งเดียวเพื่อเปิดปุ่มได้
- แตะใน WATCH แล้วถูกโจมตีโดยไม่เปิดปุ่ม
- แมวออก Cat Action เองจาก Timer และมี Tap Pressure เป็นบางครั้ง
- แมว Warning ก่อน WATCH
- ชะลอการแตะเพื่อหลบ WATCH ได้
- โดนแมวแล้วลดหัวใจเพียงครั้งเดียว
- แมว Sabotage ปุ่ม ON ได้ครั้งละ 1 ปุ่ม
- การกดรัวทำให้ Mood แมวเพิ่มและแสดง Feedback เหตุและผลชัดเจน
- Mood ลดเป็นระดับหลังไม่มีการกดรัว และไม่ทำให้ WATCH probability เปลี่ยนโดยตรง
- Cat Event เว้นช่วงขั้นต่ำ 500 มิลลิวินาที รวมถึง Sabotage ที่เข้าคิวจากการกดรัว
- Score และ Combo แสดงตลอดเวลา
- Combo รีเซ็ตเมื่อโดนโจมตี
- Sabotage ไม่รีเซ็ต Combo
- เปิดปุ่มสุดท้ายแล้วชนะทันที
- หัวใจหมดแล้วเข้า Game Over
- Retry ได้ทันที
- รองรับ Touch และ Mouse
- หน้าจอคงสัดส่วน 9:16
- ไม่มี Cat Event ซ้อนกัน
- เปลี่ยน Cat State แล้วโต๊ะและหลุมไม่กระโดด
- BACK/MIDDLE/FRONT ใช้ Anchor เดียวกัน

## 10. Out of Scope

ยังไม่ทำใน Prototype รุ่นแรก:

- Stage Select
- Speed Bonus
- Remaining Heart Bonus
- Accessibility Mode
- Shop หรือ Inventory
- Multiplayer
- Online Leaderboard
- Login System

## 11. Ownership & Handoff Order

งานไม่ควรรอให้ทุกอย่างเสร็จทีละส่วนทั้งหมด แต่ให้แบ่งเป็น Owner และส่งมอบตาม Dependency ดังนี้

| ลำดับ | ผู้รับผิดชอบหลัก | งาน | ส่งมอบให้ |
|---|---|---|---|
| 1 | Game Designer / Producer | ล็อกกติกา, Timing, Score, Combo และ Acceptance Criteria | Programmer, UX/UI, Artist |
| 2 | Gameplay Programmer | สร้าง Phaser/Vite, 9:16, `catTableContainer` และ 3-Layer Loader ด้วย Placeholder | UX/UI, Artist |
| 3 | UX/UI Designer | ทำ Wireframe, HUD, Screen Flow, Warning Feedback และ Thai Copy | Programmer, Artist |
| 4 | 2D Artist | ทำ `table_back`, `table_front`, `cat_hole_[state]` โดยอ้างอิง Anchor เดียวกัน | Programmer |
| 5 | Gameplay Programmer | เชื่อม Tap Activation, Cat State Machine, Attack, Sabotage, Score และ Win/Lose | QA, Designer |
| 6 | UI Programmer / UX/UI | นำ HUD, Tutorial, Pause, Clear และ Game Over เข้าเกมจริง | QA, Designer |
| 7 | Sound Designer / Programmer | ใส่ Warning, Attack, Sabotage, Score และ Stage Clear SFX | QA |
| 8 | QA / Playtester | ทดสอบ Mobile, Timing, Anchor, Layer Switching และความแฟร์ | Designer, Programmer |
| 9 | ทีมร่วมกัน | ปรับ Difficulty, Animation, FX และ Visual Polish หลัง Core Loop ผ่าน | Release Owner |

### Dependency ที่สำคัญ

- Programmer เริ่มทำระบบได้ทันทีด้วย Placeholder ไม่ต้องรอภาพจริง
- UX/UI เริ่มทำ Wireframe และ HUD ได้ทันทีหลังกติกาหลักนิ่ง
- Artist ต้องใช้ Anchor/Canvas ของ `cat_hole_hidden.png` เป็น Master และไม่ควรขยับตำแหน่งตามแต่ละ Action
- Sound ควรใส่หลัง State และ Event มีชื่อ/จังหวะที่แน่นอนแล้ว
- QA ควรเริ่มทันทีเมื่อมี Gameplay รอบแรก ไม่ต้องรอ Visual Polish

ถ้าทำคนเดียว ให้ทำตามลำดับเดียวกันนี้ โดยสลับบทบาทตาม Phase และใช้ Placeholder แทนการรอ Asset จริง

## 12. Next Recommended Step

1. เตรียม Asset แยกจริงตาม Asset Folder Contract
2. ตรวจทุกไฟล์เทียบกับ `cat_hole_hidden.png`
3. ย้าย Assembly Model จาก Prototype ไปยัง Phaser `catTableContainer`
4. เชื่อมเข้ากับ Button และ Cat Gameplay จริง
5. ทดสอบ Core Loop บนมือถือจริง
