# Cat Motion Animation Plan

## Goal

เปลี่ยนการแสดงแมวจากการสลับภาพตาม `Cat State` เป็น Animation ที่ลื่นไหลและเป็นธรรมชาติ โดยไม่เปลี่ยน Core Gameplay, timer, score หรือกติกาการแตะปุ่ม

คำศัพท์ที่ใช้ในแผนนี้:

- **Cat State**: สถานะเกมที่ `CatController` เป็นผู้ตัดสิน เช่น `HIDDEN`, `WARNING`, `PEEK`, `WATCH`, `ATTACK`, `SABOTAGE` และ `HIDE`
- **Cat Rig**: ชุดส่วนประกอบภาพของตัวแมวที่แยกจากกันและประกอบเป็นแมว โดยไม่รวม Hole/rim
- **Cat Motion Animation**: การเคลื่อนไหวของ Cat Rig ระหว่าง Cat State ซึ่งเป็น presentation layer และไม่เปลี่ยนกติกาเกม

## Current Gap

ปัจจุบัน `GameScene.handleCatState()` เรียก `assembly.setCatState()` ซึ่งเปลี่ยน texture ของ `catState` โดยตรง ภาพ `cat_hole_*` รวม Hole/rim กับแมวไว้ในภาพเดียว จึงไม่เหมาะกับการ tween ทั้งภาพ เพราะจะทำให้ขอบ Hole เคลื่อนตาม

`FeedbackEffects.js` มีค่าการเคลื่อนไหวที่ออกแบบไว้แล้วบางส่วน แต่ยังไม่มี controller ที่เล่น Cat Motion Animation จริง

## Prototype Status

implementation รอบใหม่เสร็จแล้ว:

- ระหว่าง tune motion runtime ใช้ **Code-drawn Cat Rig** เป็นค่าเริ่มต้น เพื่อให้เห็นเส้นเชื่อม, จุดหมุน, ลำดับการเอื้อม และการแยก Hole จากตัวแมวได้ชัดเจนโดยไม่ต้องรอ asset ภาพชุดใหม่
- raster Cat Rig เดิมยังคงเป็น fallback ผ่าน `useVectorCat: false` และไม่กระทบ contract ของ Cat Motion Animation

- `cat_reach_v2_body.png` และ `cat_reach_v2_head.png` เป็น transparent layers หลักของลูกแมวที่กลม อ้วน ตัวเตี้ย และคอสั้น
- `cat_reach_v3_sleep_head.png`, `cat_reach_v3_gaze.png` และแขนชิ้นเดียว v2 เพิ่ม Sleep Idle, target gaze และการเอื้อมแบบต่อเนื่องจากไหล่ถึงอุ้งเท้า
- `PlaceholderArt` ประกอบ Cat Reach Rig แยกจาก static Hole/table และเก็บ `cat_hole_*` เป็น fallback
- `CatAnimationController` ขับ body/head/sleep-head/gaze, target gaze, weight shift, compact single-piece near-arm reach, breathing/sway และ pause/resume
- ระยะเอื้อมใช้แขนสั้นแบบ compact และหมุนลำตัว/จุด shoulder ตามเป้าหมายก่อนส่งแขนออก ปุ่มไกลให้ลำตัวเอนตามเพิ่ม (adaptive lunge สูงสุด `58px`) เพื่อให้อุ้งเท้าลงกึ่งกลางปุ่มทุก slot
- แขนใช้สัดส่วนใหญ่เท่าตัว (`armScale = 0.24`) มีศอกงอเล็กน้อย แผ่นขนไหล่ไร้เส้นขอบทับลำตัว และ layer เรียง body → arms → head (ADR 0010)
- ช่วงเล็งเป้าหมาย หัวเอียงนำและดวงตานำหัวตามปุ่ม ส่วนแขนที่ไม่ได้ใช้ห้อยแนบอก ไม่ชี้ไปที่อื่น
- `GameScene` ใช้แขนที่ต่อจาก shoulder เป็น visual หลัก และซ่อน `sabotagePaw` เก่าเมื่อ rig ใหม่โหลดครบ
- ช่วง Sabotage ใช้จังหวะ preview `160ms` (เท้าแตะปุ่มแล้ว) → reach `120ms` (หมุนนำ ยืดตาม แล้วบีบกดตามทิศ shoulder→button) → contact/กด `80ms` → ถอนกลับผ่าน `HIDE` `220ms`
- หน้าตรวจท่าสำหรับ dev: `dev/cat-rig-preview.html` (`aim/press/hold/state` ต่อ slot)

ตา/หูแยกเป็น layer เพิ่มเติมยังเป็น polish pass ในอนาคต แต่ไม่จำเป็นต่อการแก้ปัญหาแขนลอย เพราะหัวและแขนปัจจุบันมีจุดเชื่อมกับลำตัวชัดเจนแล้ว

## Target Architecture

```text
CatController
  └─ authoritative Cat State + gameplay timing

CatAnimationController
  ├─ receives previousState → nextState
  ├─ selects transition spec and motion priority
  ├─ blends from the current pose when interrupted
  ├─ pauses/resumes active tweens
  └─ drives Cat Rig only

Cat Rig
  ├─ static Hole/rim layer outside the rig
  ├─ catRoot/body + shoulder sockets
  ├─ head/face + sleep variant
  ├─ gaze overlay → leads target look
  ├─ near compact arm + paw → selected by target side
  └─ far arm → tucked/hidden during reach
```

แนะนำไฟล์ในระยะ implementation:

- `src/game/CatRig.js`: สร้างชิ้นส่วน, pivot, anchor และ fallback
- `src/game/CatAnimationController.js`: state transition, priority, interrupt, pause/resume
- `src/game/CatAnimationSpecs.js`: keyframe และ path ของแต่ละ transition
- `assets/cat-rig/`: ภาพโปร่งใสของชิ้นส่วน Cat Rig

`CatController` และ `ButtonManager` ไม่ควรรับผิดชอบ tween ของภาพแมว ส่วน `UIManager` รับผิดชอบ warning/status/flash เท่านั้น

## Asset Plan

สร้าง asset ใหม่ให้รักษาสไตล์แมวลายเทาและแสงแบบชุดปัจจุบัน แต่แยกเป็นภาพโปร่งใสที่มี anchor เดียวกับ canvas `1024 × 1024`:

1. `cat_reach_body_v2` สำหรับการขึ้นลง, breathing และถ่ายน้ำหนัก
2. `cat_reach_head_v2` และ `cat_reach_sleep_head_v3` สำหรับ awake/sleep expression และการหันหน้า
3. `cat_reach_gaze_v3` เป็นชั้นตาแยกที่นำสายตาไปยังเป้าหมาย
4. `cat_reach_arm_left/right_v2` เป็นแขนชิ้นเดียวแบบสั้น ต่อจาก shoulder ถึง paw โดยไม่มีรอยต่อกลางแขน
5. `sabotage_paw` เก็บไว้เป็น fallback เมื่อ asset ชุดใหม่โหลดไม่ครบ

ชุด `cat_reach_upper_arm_*_v3` และ `cat_reach_forearm_*_v3` ยังเก็บไว้เป็น reference/legacy asset เท่านั้น ไม่ใช้เป็นแขนหลักของ runtime เพราะรอยต่อหลายข้อทำให้ silhouette ดูผิดรูปเมื่อเคลื่อนไหว

Hole/rim ต้องคงเป็น layer นิ่งเสมอ ภาพ `cat_hole_*` เดิมยังเก็บไว้เป็น fallback และ reference ระหว่างเตรียม asset ใหม่

## Motion Rules

### Coordinate and Path

- เก็บตำแหน่งและ path ด้วย normalized coordinate `0..1`
- แปลงเป็น canvas coordinate ตอนสร้าง Cat Rig
- ใช้ authored keyframes และ easing/Bezier path ที่กำหนดต่อ transition
- ใช้ secondary motion ขนาดเล็กกว่าการเคลื่อนหลักเสมอ
- หลีกเลี่ยง physics เต็มรูปแบบ เพื่อให้จังหวะอ่านง่ายและ deterministic

### Sleep Idle

- `HIDDEN` ใน gameplay แสดงเป็น `Sleep Idle`: หลับตา ก้มหน้าลงเล็กน้อย และหายใจช้า ๆ ให้เห็นบางส่วนอยู่ใน Hole
- เมื่อเริ่ม Warning ให้ sleep head fade เป็น awake head แล้วเปิดทางให้ gaze นำการหันหน้า
- `WATCH`: breathing ลด amplitude, head tilt เล็กน้อย, blink และ gaze ยังทำงาน
- Randomness จำกัดเฉพาะ secondary motion เช่น nod/ear-like sway ไม่ให้เปลี่ยน gameplay หรือทำให้ภาพสั่น

### State Transitions

| Transition / State | Motion | Timing baseline |
|---|---|---:|
| `HIDDEN → WARNING` | หูสะดุ้ง, ตัวเกร็ง, เริ่ม bob เบา ๆ | `warningDuration = 500ms` |
| `WARNING → PEEK` | body/head rise ตาม path แล้ว settle อ่อน ๆ | `peekDuration = 650ms` |
| `PEEK → WATCH` | head settle, eye gaze, micro tilt และ stare tension | `watchDuration = 1000ms` |
| `WATCH → ATTACK` | squash → anticipation → lunge → recoil | `attackRecovery = 500ms` |
| `PEEK → SABOTAGE` | target highlight → มองเป้า → หันหัวและลำตัว/ไหล่ตามเป้า → เตรียมแขนด้านใกล้ | `sabotagePreviewDuration = 160ms`, turn `120ms`, reach `120ms`, contact `80ms` |
| `SABOTAGE` | shoulder follow-through → แขนต่อเนื่องเอื้อม → กดค้างสั้น ๆ → resolve | reach `120ms`, contact `80ms` |
| `WATCH/ATTACK/SABOTAGE → HIDE` | ถอนแขน → sink ลงตาม path กลับเข้ารู | `hideDuration = 220ms` |
| `HIDE → HIDDEN` | settle กลับเป็น idle pose | ต่อเนื่องจาก `HIDE` |

### Interruption and Priority

1. `ATTACK` และ `SABOTAGE` มี priority สูงสุด
2. เมื่อ State ใหม่เข้ามา ให้ capture pose ปัจจุบันแล้ว blend ไปยัง pose ใหม่ ไม่ snap กลับจุดเริ่มต้น
3. `Pause` หยุด Cat Motion Animation ทั้งหมด และ `Resume` ต่อจาก pose เดิม
4. การเปลี่ยน texture fallback ต้องไม่ย้าย Hole/rim หรือเปลี่ยน anchor ของ layer หลัก

ระหว่าง `WATCH` และ `SABOTAGE` ให้ดวงตามองไปยังทิศทาง Button Slot เป้าหมาย โดยจำกัดมุม gaze และไม่หมุนทั้งตัวแมวเกินกว่าที่อ่านเป็นธรรมชาติ

## Implementation Sequence

### Phase 1 — Asset and Contract

- แยก/สร้าง Cat Rig assets ตามรายการด้านบน
- ตรวจ anchor, origin, alpha และขอบเขตของแต่ละชิ้น
- เพิ่ม asset manifest และ fallback เมื่อ asset ใหม่ยังไม่พร้อม

### Phase 2 — Rig Assembly

- เพิ่ม static Hole/rim layer ที่อยู่นอก Cat Rig
- สร้าง pivot สำหรับ root, head, ears, paws และ eyes
- ทำ preview ที่สลับชิ้นส่วนและตรวจว่า Hole ไม่ขยับ

### Phase 3 — Animation Controller

- สร้าง `CatAnimationController`
- สร้าง `CatAnimationSpecs` แบบ data-driven
- รองรับ transition, blend, priority, interrupt, pause และ resume
- ย้าย animation responsibility ออกจาก `GameScene.handleCatState()` ให้เหลือแค่ส่ง state event

### Phase 4 — Gameplay Integration

- ต่อ `CatController.onStateChange` เข้ากับ Animation Controller
- คง duration/probability/timing ใน `gameConfig.js`
- คง target contract เดิม แต่ใช้แขนชิ้นเดียว `cat_reach_arm_left/right_v2` เป็นแขนหลัก และ `sabotagePaw` เป็น fallback เท่านั้น
- คง UI warning, status และ claw cutscene เป็น feedback แยกจาก Cat Rig โดยตัด attack flash กับ screen shake ออกเพื่อให้ภาพรอยข่วนเป็นจุดสนใจหลัก

### Phase 5 — QA and Tuning

- เพิ่ม transition harness สำหรับดูทุก State แบบหยุด/เล่นซ้ำได้
- ตรวจ interruption ทุกคู่สำคัญ เช่น `PEEK → ATTACK`, `WATCH → ATTACK`, `PEEK → SABOTAGE`, `SABOTAGE → HIDE`
- ตรวจ Pause/Resume ระหว่างทุก phase
- ตรวจ 60 FPS บน mobile viewport และหลีกเลี่ยง allocation/filter หนักใน update loop

## Acceptance Criteria

- Hole/rim/table ไม่ขยับเมื่อเปลี่ยนหรือ blend Cat State
- Animation ทุก State ต่อกันได้โดยไม่ snap ที่เห็นชัด
- `ATTACK` และ `SABOTAGE` override motion อื่นได้อย่างชัดเจน
- Pause/Resume ต่อจาก pose เดิมได้
- หัวและลำตัว gaze ไปยัง Sabotage Target โดยไม่ทำให้การอ่านปุ่มเสีย
- Gameplay timing, score, health และ input behavior เหมือนเดิม
- มี fallback ไปยังภาพ `cat_hole_*` เดิมเมื่อ Cat Rig asset ยังโหลดไม่ได้
- ผ่าน unit/integration tests และ visual preview โดยไม่เกิด console error
