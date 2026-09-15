# Cat Animation Rig Plan

สถานะ: วางแผนเพื่ออนุมัติก่อนลงมือแก้ Implementation

## เป้าหมาย

เปลี่ยนการแสดงผล Cat จากการสลับภาพ `cat_hole_[state].png` เป็น Animation แบบต่อเนื่องที่มีน้ำหนักและดูเป็นธรรมชาติ โดยใช้ 2D Rig ที่ประกอบจาก Layer แยก, Timeline สำหรับท่าหลัก และ IK สำหรับการยื่นไปยัง Button Slot ทั้ง 8 จุด

แผนนี้รักษากติกา Gameplay เดิมไว้ทั้งหมด โดยเปลี่ยนเฉพาะ seam ระหว่าง `CatController` กับภาพที่แสดงผล

## ขอบเขตที่ล็อกแล้ว

- ใช้ Gameplay เดิม: Warning, Watch, Attack, Sabotage, Cooldown, Score, Combo และ Health ไม่เปลี่ยนความหมาย
- ใช้ 2D Rig ที่พัฒนาใน Phaser/โค้ดของโปรเจกต์เอง ไม่เพิ่ม Runtime Animation ภายนอกในระยะแรก
- รองรับเฉพาะ Button Slot ถาวร 8 จุด (`slot-1` ถึง `slot-8`)
- ปรับ Button Slot ให้เรียงรอบโต๊ะตาม 8 ทิศ ห่างกัน 45 องศา ตามภาพอ้างอิง
- ทิศของ `slotId` เป็นข้อมูลหลัก แต่ Animation ต้องคำนวณจากตำแหน่งจริงของ Slot ไม่กระจายค่ามุมไว้หลายจุด
- การเคลื่อนที่ของแขนและอุ้งเท้าเป็นแบบต่อเนื่องด้วย IK
- ท่าหลักใช้ Timeline: Idle, Peek, Watch, Attack และ Hide
- Direction Pose ของหัว/ใบหน้าใช้ 8 ทิศ และเปลี่ยนผ่านแบบนุ่มนวล ไม่กระโดดเป็นภาพทันที
- ระหว่าง Sabotage ผู้เล่นยังกด Button อื่นได้เหมือนเดิม
- เก็บระบบ Texture State เดิมไว้เป็น Fallback ระหว่าง Migration และกรณี Asset Rig ไม่ครบ
- ต้องรองรับ Chrome Android, Safari iPhone และ Chrome Desktop ที่ประมาณ 60 FPS
- ต้องมีเอกสาร Plan, ADR, Glossary และ Assembly Contract ที่สอดคล้องกัน

## คำศัพท์และโมเดลโดเมน

| คำ | ความหมายในแผนนี้ |
|---|---|
| Cat Animation | การเปลี่ยนท่าทางของ Cat ตามเวลาอย่างต่อเนื่อง รวม Idle, State Transition และ Action |
| Cat Rig | โครงสร้างลำดับชั้นของส่วนภาพและจุดหมุนที่ใช้ควบคุม Cat Animation |
| Animation Target | จุดกึ่งกลางของ Button Slot ที่ Cat ต้องเคลื่อนไปหา |
| Direction Pose | ชุดท่าหัว/ใบหน้าที่สร้างไว้สำหรับหนึ่งใน 8 ทิศของ Button Slot |
| Reach | การเคลื่อนไหวจาก Cat Root ไปยัง Animation Target โดยใช้ IK |
| Occlusion | การบังส่วนของ Cat ด้วยขอบโต๊ะหรือ Hole Mask เพื่อให้ดูเหมือนยื่นออกจากรูจริง |

คำว่า `Cat State` ยังคงใช้สำหรับสถานะ Gameplay ใน `CatController` ส่วน `Cat Animation` หมายถึงภาพเคลื่อนไหวที่แสดงสถานะนั้น ไม่ควรใช้สองคำนี้แทนกัน

## สถาปัตยกรรมเป้าหมาย

```text
CatController
    │  state + event + slotId
    ▼
CatAnimation interface
    ├── RigAnimationAdapter       (เป้าหมายหลัก)
    └── TextureStateFallback      (ระหว่าง Migration/Asset ไม่ครบ)
            │
            ▼
        CatRig
        ├── CatRoot
        │   ├── Body
        │   ├── Neck / Head
        │   ├── Eye_L / Eye_R
        │   ├── Ear_L / Ear_R
        │   ├── UpperArm
        │   ├── Forearm
        │   ├── Paw
        │   └── Shadow
        ├── HoleMask
        ├── PawBehind
        ├── PawFront
        └── FX
```

`CatController` ไม่ควรรู้เรื่องมุม, Pivot, Bone, Easing หรือ Texture ที่ใช้จริง ส่วน `CatAnimation` เป็น deep module ที่ซ่อนรายละเอียดเหล่านี้ไว้หลัง Interface ขนาดเล็ก

### Interface เป้าหมาย

ชื่อจริงอาจปรับได้ระหว่าง Implementation แต่ต้องคงความรับผิดชอบประมาณนี้:

```text
setState(state)
reachTo(slotId, targetPoint)
playAttack()
hide()
reset()
update(delta)
```

ผู้เรียกส่ง `state`, `slotId` และตำแหน่งเป้าหมายเท่านั้น การหา Direction Pose, การแก้ความยาวแขน, การบังโต๊ะ, การ Blend และการยกเลิก Tween อยู่ภายใน Module

## แผนงานตาม Phase

### Phase 0 — ล็อก Contract และเตรียม Migration

- [ ] อนุมัติเอกสารแผนนี้
- [ ] บันทึก ADR เรื่องการเปลี่ยนจาก Texture State เป็น 2D Rig
- [ ] เพิ่มคำศัพท์ Cat Animation, Cat Rig, Animation Target, Direction Pose, Reach และ Occlusion ใน `CONTEXT.md`
- [ ] แก้ `docs/design/ASSEMBLY_CONTRACT.md` ให้รองรับ Rig Layer โดยยังรักษา Canvas และ Hole Anchor เดิม
- [ ] แก้ `docs/design/ASSET_MANIFEST.md` ให้แยก Runtime Rig Asset ออกจาก Fallback Asset
- [ ] ล็อกว่า `CatController` เป็นเจ้าของ Gameplay State และ `CatAnimation` เป็นเจ้าของภาพเคลื่อนไหว

### Phase 1 — ปรับ Button Slot ให้เป็น 8 ทิศ

- [ ] แทนที่ตำแหน่งใน `src/game/constants.js` ด้วยตำแหน่ง 8 จุดรอบโต๊ะที่ห่างกัน 45 องศา
- [ ] รักษา `slot-1` ถึง `slot-8` ให้ถาวรและเรียงตามทิศที่กำหนดในเอกสาร
- [ ] ทำตาราง Mapping ระหว่าง `slotId`, ตำแหน่ง, ทิศ, Direction Pose และค่าเริ่มต้นของ Reach
- [ ] ตรวจว่า Preset 4–8 ปุ่มยังเลือกจาก Slot เดิมโดยไม่สลับลำดับ
- [ ] ปรับ `ButtonManager` เฉพาะส่วนตำแหน่งและการให้ Target Point หากจำเป็น โดยไม่เปลี่ยนกติกา Hold หรือ Sabotage
- [ ] อัปเดต Prototype Assembly ให้มีมุมมองตรวจสอบ 8 ทิศและตำแหน่งปุ่มใหม่

### Phase 2 — เตรียม Source Asset แบบ Layered

- [ ] สร้าง Source File แบบ Layered จากภาพอ้างอิงใหม่ ไม่พยายามตัด PNG รวมอย่างเดียว
- [ ] แยก `body`, `head`, `eyes`, `ears`, `neck`, `upper-arm`, `forearm`, `paw`, `shadow` และ FX
- [ ] วาดส่วนที่ถูกบังให้ครบ เพื่อให้ขยับแล้วไม่เกิดรูหรือขอบขาด
- [ ] สร้าง Direction Pose ของหัว/ใบหน้า 8 ทิศ
- [ ] สร้าง Runtime Export เป็น PNG โปร่งใสและคง Pivot/Anchor ที่กำหนด
- [ ] สร้าง `HoleMask`, `PawBehind` และ `PawFront` สำหรับการบังขอบโต๊ะ
- [ ] ตั้งชื่อไฟล์และ Key ให้แยก Source, Runtime และ Fallback อย่างชัดเจน
- [ ] ตรวจสี, ขนาด, Alpha, Pivot และขอบภาพก่อนนำเข้าเกม

ตัวอย่างโครงสร้าง Asset เป้าหมาย:

```text
reference/source/cat_rig.psd
assets/cat/rig/body.png
assets/cat/rig/head_dir_01.png ... head_dir_08.png
assets/cat/rig/eye_dir_01.png  ... eye_dir_08.png
assets/cat/rig/ear_l.png
assets/cat/rig/ear_r.png
assets/cat/rig/upper_arm.png
assets/cat/rig/forearm.png
assets/cat/rig/paw.png
assets/cat/rig/hole_mask.png
assets/cat/rig/shadow.png
assets/cat/fallback/cat_hole_[state].png
```

### Phase 3 — สร้าง Cat Rig Runtime

- [ ] สร้างโครงสร้าง `CatRoot` และ Child Layer ใน `PlaceholderArt.js` หรือ Module ใหม่ที่แยกความรับผิดชอบชัดเจน
- [ ] สร้างจุดหมุนและ Pivot สำหรับ Neck, UpperArm, Forearm และ Paw
- [ ] สร้าง 2-bone IK สำหรับ UpperArm → Forearm → Paw
- [ ] สร้าง Solver ที่รับ Target Point และคืน Rotation/Length ที่จำเป็น
- [ ] จำกัดมุมแขนและความยาวไม่ให้พับผิดธรรมชาติ
- [x] ทำระบบ Direction Pose 8 ทิศสำหรับ Head/Face (Blockout)
- [x] ทำ Blend หรือ Crossfade สั้น ๆ ตอนเปลี่ยน Direction Pose (Blockout)
- [ ] ทำระบบ Layer Order สำหรับ Hole Mask, PawBehind, PawFront และ FX
- [ ] ทำ `RigAnimationAdapter` ตาม Interface ของ CatAnimation
- [ ] ทำ `TextureStateFallback` ที่ใช้ Assembly เดิมเมื่อ Rig Asset โหลดไม่ครบ

### Phase 4 — สร้าง Motion และ Animation Clip

- [x] ทำ Idle Loop: หายใจ, กระพริบตา, หูกระดิกเล็กน้อย (Blockout)
- [ ] ทำ Warning: หู/ตาและหัวเปลี่ยนท่าก่อนเข้า Watch
- [x] ทำ Peek: ลำตัวและหัวเลื่อนขึ้นจากรูแบบมีแรงเฉื่อย (Blockout)
- [x] ทำ Watch: หยุดนิ่งพร้อม Micro Motion (Blockout)
- [x] ทำ Attack: มี Anticipation, พุ่ง และ Recovery (Blockout)
- [x] ทำ Hide: หดกลับลงรูพร้อม Follow-through (Blockout)
- [ ] ทำ Sabotage Preview: หันหัว/เตรียมไหล่ไปยัง Direction Pose เป้าหมาย
- [ ] ทำ Sabotage Reach: ใช้ IK ยื่นแขนไปยัง Button Target
- [ ] ทำ Contact: Paw Squash/Stretch และ Button Feedback โดยไม่ทำให้ Target หลุด
- [ ] ทำ Retract: ดึงแขนกลับเข้ารูพร้อมคืน Pose อย่างนุ่มนวล
- [x] ทำ Transition ระหว่าง Clip ด้วยการ Blend ไม่ใช่เปลี่ยนภาพกระทันหัน (Blockout)
- [x] รวม Duration และ Easing ของ Motion Clip ไว้ใน Config (Blockout)

### Phase 5 — เชื่อมกับ Gameplay

- [ ] แก้ `GameScene.js` ให้ส่ง Event และ `slotId` เข้า `CatAnimation`
- [ ] ย้าย Logic คำนวณมุม, ระยะ, Scale และ Tween ของ `sabotagePaw` ออกจาก `GameScene`
- [ ] ให้ `CatController` ส่ง State/Target ต่อไปโดยไม่รู้รายละเอียด Rig
- [ ] ให้ `ButtonManager` เป็นแหล่งข้อมูล Button Slot และ Target Point
- [ ] คง Preview 300 ms ก่อน Reach และคงการกดปุ่มอื่นระหว่าง Sabotage
- [ ] คง Attack Recovery และ Input Lock เฉพาะกรณี Attack
- [ ] ยกเลิก Animation ที่ค้างเมื่อ Pause, Retry, Stage Clear หรือ Game Over
- [ ] ทำ Fallback เมื่อ Runtime Rig Asset โหลดไม่ครบหรือเกิด Error
- [ ] คง Audio/UX Callback เดิมให้เล่นตาม Event เดิม

### Phase 6 — ทดสอบและตรวจคุณภาพ

- [ ] ทดสอบ Math ของ 8 Direction และ Mapping `slotId`
- [ ] ทดสอบ IK ให้ Paw จบตรงกลาง Button Target
- [ ] ทดสอบการเปลี่ยนทิศใกล้กันและทิศตรงข้าม
- [ ] ทดสอบการบังด้วย Hole Mask และ Table Front ทุก Slot
- [ ] ทดสอบว่าผู้เล่นกดปุ่มอื่นได้ระหว่าง Sabotage
- [ ] ทดสอบ Pause/Resume ไม่ทำให้ Rig ข้ามตำแหน่งหรือ Tween ค้าง
- [ ] ทดสอบ Fallback เมื่อ Asset บางไฟล์หาย
- [ ] ทดสอบไม่มี Cat Event ซ้อนกัน
- [ ] ทดสอบ Stage Clear และ Game Over ระหว่าง Animation
- [ ] ทดสอบ Touch/Mouse บนอุปกรณ์จริง
- [ ] ตรวจ Performance ที่ 60 FPS และตรวจ Memory ของ Texture
- [ ] ทำ Visual QA Screenshot สำหรับทั้ง 8 ทิศและทุก Cat Event

### Phase 7 — Polish หลัง Core Animation ผ่าน

- [ ] ปรับ Weight, Overshoot, Anticipation และ Follow-through
- [ ] ปรับสี/เงา/ขอบของ Layer ให้ไม่แยกจากกันเมื่อขยับ
- [ ] เพิ่ม FX เฉพาะจังหวะ Contact และ Sabotage
- [ ] ปรับ Direction Pose ให้บุคลิกแมวสม่ำเสมอทั้ง 8 ทิศ
- [ ] ลด Cost ของ Rig บนอุปกรณ์มือถือถ้าพบ Frame Drop
- [ ] ลบหรือปิด Fallback เฉพาะเมื่อ Rig Asset และ Test ผ่านครบทุกกรณี

## ไฟล์ที่คาดว่าจะต้องแก้หรือเพิ่ม

### แก้ไข

- `src/game/constants.js` — 8 Button Slot แบบ 45 องศาและ Direction Mapping
- `src/game/GameScene.js` — เปลี่ยนจากการควบคุม Paw โดยตรงเป็นการเรียก CatAnimation
- `src/game/PlaceholderArt.js` — สร้าง Rig/Layer หรือแยกไปยัง Module ใหม่
- `src/game/AssetManifest.js` — โหลด Rig Asset และ Fallback Asset
- `src/game/AssetKeys.js` — เพิ่ม Keys ของ Cat Rig, Direction Pose และ Mask
- `docs/design/ASSEMBLY_CONTRACT.md` — Contract ใหม่ของ Rig และ Occlusion
- `docs/design/ASSET_MANIFEST.md` — Manifest ของ Source/Runtime/Fallback
- `prototype/modular-table-cat-assembly.html` — Preview ของ Rig, Direction และ Layer Order

### เพิ่ม

- `src/game/CatAnimation.js` — Interface และ Orchestrator ของ Animation
- `src/game/CatRig.js` — โครงสร้าง Layer, Bone และ Pivot
- `src/game/CatRigIK.js` — 2-bone IK และข้อจำกัดมุม/ระยะ
- `src/game/CatAnimationMath.js` — Direction, Distance, Blend และ Target Math
- `src/game/CatAnimationFallback.js` — Adapter สำหรับ Texture State เดิม
- `src/game/CatAnimationConfig.js` — Timing, Easing, Direction และ Rig Limits
- `tests/cat-animation-math.test.mjs` — Unit Test ของทิศทางและ Target
- `tests/cat-animation-state.test.mjs` — Test State/Clip/Cancel/Fallback
- `tests/cat-rig-ik.test.mjs` — Test IK และข้อจำกัดของแขน
- `docs/adr/0003-continuous-cat-animation-rig.md` — Architectural Decision Record

### Asset ที่ต้องสร้าง

- Source Layered Cat Rig
- Runtime Body/Head/Eye/Ear/Arm/Forearm/Paw/Shadow
- Head/Face Direction Pose 8 ทิศ
- Hole Mask และ Paw Occlusion Layers
- Fallback State Textures ชุดเดิมที่ยังคงใช้งานได้

## Dependency และลำดับการทำงาน

```text
Contract/ADR
    ↓
8 Button Slot + Mapping
    ↓
Layered Source Asset ─────┐
                          ├── Cat Rig Runtime
Placeholder Rig ──────────┘          ↓
                              Animation Clips + IK
                                      ↓
                              Gameplay Integration
                                      ↓
                              Test + Visual QA
                                      ↓
                                  Polish
```

สิ่งที่ทำขนานกันได้:

- เตรียม Source Asset กับสร้าง IK Math
- ทำ Animation Clip Spec กับเขียน Unit Test
- อัปเดต Prototype กับทำ Fallback Adapter

สิ่งที่ต้องรอ:

- Runtime Rig ต้องรอ Pivot และ Layer Asset ที่ยืนยันแล้ว
- Gameplay Integration ต้องรอ Interface ของ CatAnimation
- Visual Polish ต้องรอ Occlusion และ 8 Direction Pose ผ่าน QA

## Acceptance Criteria

### Gameplay Invariants

- `CatController` ยังตัดสินใจ Cat Event และ Gameplay State เหมือนเดิม
- Sabotage ปิดได้ครั้งละหนึ่ง Activated Button
- ผู้เล่นยังแตะ Button อื่นได้ระหว่าง Sabotage
- Attack เท่านั้นที่ใช้ Input Lock ตามกติกาเดิม
- Pause, Retry, Stage Clear และ Game Over ยกเลิก Animation ค้างได้ครบ

### Animation

- Cat มี Idle Motion ต่อเนื่องโดยไม่ต้องสลับภาพ State เป็นตัวขับหลัก
- Reach ไปยัง 8 Button Slot ได้โดยใช้ Rig เดียวกัน
- Paw หยุดที่กึ่งกลาง Button Target โดยคลาดเคลื่อนไม่เกิน 4 px ใน Canvas Space
- ทิศใกล้กันเปลี่ยนอย่างต่อเนื่อง และทิศตรงข้ามใช้ Direction Pose ที่เหมาะสม
- ไม่มีการกระโดดของ Hole, Table, Cat Root หรือ Anchor ระหว่าง Action
- ไม่มีขอบขาดหรือทะลุโต๊ะจาก Occlusion ในทั้ง 8 ทิศ
- Timing, Easing และ IK Limits ปรับได้โดยไม่แก้ Gameplay Logic

### Reliability และ Performance

- ถ้า Rig Asset โหลดไม่ครบ เกมยังเล่นได้ด้วย Fallback
- ไม่มี Cat Event ซ้อนกัน
- ผ่าน Unit Test ของ Direction, Target, IK, Cancel และ Fallback
- รักษาเป้าหมายประมาณ 60 FPS บน Browser/Device ที่กำหนด
- ไม่มี Texture ที่ไม่ได้ใช้ถูกโหลดเข้าหน่วยความจำโดยไม่จำเป็น

## ความเสี่ยงและการรับมือ

| ความเสี่ยง | ผลกระทบ | การรับมือ |
|---|---|---|
| PNG เดิมไม่มีข้อมูลส่วนที่ถูกบัง | ขยับแล้วเกิดรูหรือขอบขาด | วาด Layer ใหม่จาก Source ไม่ตัดภาพเดิมอย่างเดียว |
| หันหลังด้วย 2D แล้วดูไม่สมจริง | Face และ Perspective ผิด | สร้าง Direction Pose ใหม่ 8 ทิศ และไม่หมุนภาพหน้าเดิม 180° |
| IK ทำให้แขนพับผิดรูป | ภาพดูเป็นยางหรือทะลุโต๊ะ | จำกัดมุม, ความยาว และทำ Pose Test ทุก Slot |
| Rig ซับซ้อนเกิน Gameplay | ดูแลยากและ Frame Drop | ใช้ 2-bone IK เฉพาะแขน, จำกัด Mesh Deform และใช้ Container เท่าที่จำเป็น |
| ย้าย Slot กระทบ Asset/UX | ปุ่มหรือภาพไม่ตรงกัน | ล็อก Slot Mapping กลางและทดสอบ Anchor/Position ทุกครั้ง |
| Animation ใหม่ทำให้ Input เปลี่ยน | Core Loop เสีย | แยก CatAnimation ออกจาก CatController และคง Fallback จนกว่า QA จะผ่าน |

## สิ่งที่ไม่รวมในแผนนี้

- ระบบ 3D เต็มรูปแบบ
- การรองรับปุ่มแบบสุ่มตำแหน่งนอก 8 Slot
- การรองรับผู้เล่นหลายคน
- การสร้าง Animation Editor ใหม่ในเกม
- การเปลี่ยนกติกา Cat Event, Score, Combo หรือ Health
- การลบ Fallback ก่อนที่ Rig และ QA จะผ่านครบ

## Definition of Ready ก่อนเริ่ม Implementation

- แผนนี้ได้รับการยืนยัน
- ADR และ Glossary ถูกบันทึกแล้ว
- ตาราง 8 Slot และ Direction Mapping ถูกล็อก
- รายการ Layer/Pivot ของ Asset ได้รับการยืนยัน
- มีตัวอย่าง Target Pose สำหรับอย่างน้อย 2 ทิศตรงข้ามกัน
- มี Test Cases ของ IK, Occlusion และ Input ระหว่าง Sabotage

## Definition of Done

แผนนี้ถือว่าดำเนินการครบเมื่อ Cat Rig ใหม่ใช้งานจริงใน GameScene, Animation ทั้งหมดผ่าน Acceptance Criteria, Fallback ถูกทดสอบ, เอกสารและ Asset Manifest ตรงกับ Runtime และไม่มีการเปลี่ยนแปลง Gameplay โดยไม่ได้รับการตัดสินใจใหม่

## Execution Paths

รายละเอียดการทำงานแบบทีละขั้น, จุดหยุดตรวจ และจุดปรับแก้อยู่ใน [Cat Animation Rig — Execution Paths](cat-animation-rig-execution-paths.md)
