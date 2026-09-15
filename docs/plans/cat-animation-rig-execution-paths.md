# Cat Animation Rig — Execution Paths

เอกสารนี้เป็นคู่มือทำงานแบบทีละ Path สำหรับ [Cat Animation Rig Plan](cat-animation-rig-plan.md)

ผลการทำงานที่ผ่านแล้วบันทึกไว้ใน [Cat Animation Rig — Checkpoints](cat-animation-rig-checkpoints.md)

หลักการคือทำ Path เดียวให้ผ่านจุดตรวจ ก่อนเริ่ม Path ถัดไป ทุก Path ต้องเปิดเกมหรือ Preview ได้ และต้องเก็บ Texture State เดิมไว้เป็น Fallback จนกว่าจะผ่าน Path สุดท้าย

## ลำดับรวม

```text
Path 0  Baseline และจุดถอยกลับ
   ↓
Path 1  8 Button Slot และ Mapping
   ↓
Path 2  Asset Blockout และ Pivot
   ↓
Path 3  Cat Rig และ Transform Hierarchy
   ↓
Path 4  2-Bone IK สำหรับ Reach
   ↓
Path 5  Motion Clip พื้นฐาน
   ↓
Path 6  Direction Pose และการหัน
   ↓
Path 7  Sabotage Reach และ Occlusion
   ↓
Path 8  เชื่อม CatAnimation เข้ากับ Gameplay
   ↓
Path 9  QA, Performance และ Polish
```

## Path 0 — Baseline และจุดถอยกลับ

### เป้าหมาย

ทำให้รู้ว่าเกมก่อนเปลี่ยน Animation ทำงานอย่างไร และมีทางกลับไปใช้ระบบเดิมได้ตลอดช่วง Migration

### งาน

- บันทึกผล `npm test` และ `npm run build` เป็น Baseline
- ตรวจ Cat Event เดิม: Warning → Peek → Watch/Attack/Sabotage → Hide
- ตรวจ Button Slot, Sabotage Target และ Input ระหว่าง Sabotage
- บันทึก Screenshot หรือวิดีโอสั้นของ Cat State เดิมทั้ง 8 จุด
- เพิ่ม Feature Flag สำหรับเลือก `fallback` หรือ `rig` หากยังไม่มีจุดเลือก

### ไฟล์ที่แตะ

- `src/config/gameConfig.js`
- `src/game/GameScene.js`
- `tests/**`
- `docs/plans/cat-animation-rig-plan.md`

### ผลลัพธ์ที่ต้องได้

- มี Baseline สำหรับเทียบหลังทุก Path
- ระบบเดิมยังเปิดเกมและ Build ได้
- มีจุดกลับไปใช้ Texture State เดิมได้

### จุดหยุดปรับแก้

ถ้า Baseline มีปัญหา ให้แก้ปัญหาเดิมก่อน ไม่เริ่ม Rig จนกว่าจะรู้ว่า Failure มาจากระบบเดิมหรือการเปลี่ยนแปลงใหม่

## Path 1 — ล็อก 8 Button Slot และ Mapping

### เป้าหมาย

ทำให้ตำแหน่งปุ่มและทิศเป็นข้อมูลกลางชุดเดียวสำหรับ Gameplay และ Animation

### งาน

- ปรับ `BUTTON_SLOT_LAYOUT` ให้เป็น 8 ตำแหน่งรอบโต๊ะ ห่างกัน 45 องศา
- กำหนดลำดับ `slot-1` ถึง `slot-8` ตามทิศที่อ่านง่าย
- เพิ่มข้อมูล Direction, Angle และ Target Point ไว้ในที่เดียว
- ตรวจ Preset 4, 5, 6, 7 และ 8 ว่ายังเลือก Slot เดิมได้
- ไม่แตะ Hold, Progress, Score หรือ CatController ใน Path นี้

### ไฟล์ที่แตะ

- `src/game/constants.js`
- `src/game/ButtonManager.js` เฉพาะส่วน Position/Target Point
- `tests/button-hold-progress.test.mjs` หรือ Test ของ Slot ที่เพิ่มใหม่
- `prototype/modular-table-cat-assembly.html`

### ผลลัพธ์ที่ต้องได้

- Debug View แสดงปุ่มครบ 8 ทิศ
- ทุก `slotId` คืนตำแหน่งจริงได้เหมือนกันทั้ง Gameplay และ Animation
- การเปลี่ยนตำแหน่งปุ่มไม่ทำให้กติกาการกดค้างเปลี่ยน

### จุดหยุดปรับแก้

ถ้าตำแหน่งยังไม่ตรงภาพ ให้แก้เฉพาะค่าตำแหน่งใน Mapping กลาง ห้ามแก้โค้ด Animation เพื่อชดเชยตำแหน่งผิด

## Path 2 — สร้าง Asset Blockout และ Pivot

### เป้าหมาย

ทดสอบ Rig ด้วยชิ้นส่วนเรียบง่ายก่อนใช้ภาพแมวจริง เพื่อแยกปัญหา Geometry ออกจากปัญหา Art

### งาน

- ใช้ Placeholder สีพื้นแทน Body, Head, Arm, Forearm และ Paw
- วาง Pivot ของแต่ละชิ้นให้ถูกตำแหน่ง
- วาง Cat Root ให้ตรง Center of Hole
- สร้าง Hole Mask และ Table Front สำหรับทดสอบการบัง
- สร้าง Direction Marker สำหรับ 8 Target
- ยังไม่ทำขน, Texture, สี หรือรายละเอียดใบหน้า

### ไฟล์ที่แตะ

- `src/game/PlaceholderArt.js` หรือ `src/game/CatRig.js`
- `src/game/AssetKeys.js`
- `src/game/AssetManifest.js`
- `prototype/modular-table-cat-assembly.html`

### ผลลัพธ์ที่ต้องได้

- เห็นโครง Cat Rig เป็นชิ้นส่วนจริงในเกม
- หมุน Head, UpperArm, Forearm และ Paw แยกกันได้
- ไม่มีส่วนใดกระโดดเมื่อเปลี่ยน Parent หรือ Position

### จุดหยุดปรับแก้

ถ้า Pivot ผิด ให้แก้ Pivot และ Anchor ก่อนเริ่ม IK ห้ามแก้ด้วย Offset ที่กระจายหลายไฟล์

## Path 3 — สร้าง Cat Rig และ Transform Hierarchy

### เป้าหมาย

ให้ส่วนต่าง ๆ ขยับเป็นโครงกระดูกโดยยังไม่ต้องหา Target จริง

### งาน

- สร้าง `CatRoot`
- เพิ่ม Body, Neck, Head, Eyes, Ears, UpperArm, Forearm, Paw และ Shadow
- กำหนด Parent/Child ให้แขนขยับตามไหล่และมือขยับตามแขน
- กำหนดข้อจำกัด Rotation, Scale และระยะของแต่ละ Bone
- เพิ่ม `resetPose()` เพื่อคืนทุกชิ้นกลับตำแหน่งเริ่มต้น
- ทำ Debug Toggle แสดง Pivot และ Bone Line

### ไฟล์ที่แตะ

- `src/game/CatRig.js`
- `src/game/CatAnimationConfig.js`
- `src/game/PlaceholderArt.js`
- `tests/cat-rig-hierarchy.test.mjs`

### ผลลัพธ์ที่ต้องได้

- หมุน UpperArm แล้ว Forearm/Paw ตามอย่างถูกต้อง
- Reset แล้วกลับ Anchor เดิมได้ทุกครั้ง
- Table Back, Hole และ Table Front ไม่ได้รับผลจากการหมุน Bone

### จุดหยุดปรับแก้

ต้องผ่าน Hierarchy Test ก่อน ไม่เช่นนั้น IK และ Animation Clip จะขยายความผิดพลาดต่อไป

## Path 4 — ทำ 2-Bone IK สำหรับ Reach

### เป้าหมาย

ให้ Paw ไปยัง Button Target ทั้ง 8 จุดด้วย Solver เดียว

### งาน

- สร้าง `CatRigIK.solve(shoulder, forearm, paw, target)`
- คำนวณมุมและความยาวของ UpperArm/Forearm
- จำกัดระยะสั้นสุดและยาวสุด
- เพิ่มค่า Elbow Bend เพื่อควบคุมว่าข้อศอกจะพับด้านใด
- Map `slotId` → Animation Target → Direction Pose
- ทดสอบ Target ทั้ง 8 จุดโดยยังใช้ Placeholder

### ไฟล์ที่แตะ

- `src/game/CatRigIK.js`
- `src/game/CatAnimationMath.js`
- `src/game/CatAnimationConfig.js`
- `tests/cat-rig-ik.test.mjs`
- `tests/cat-animation-math.test.mjs`

### ผลลัพธ์ที่ต้องได้

- Paw จบตรงกลาง Button Target ทุก Slot
- ไม่เกิดแขนพับกลับด้านหรือยืดเกินขนาด
- เปลี่ยน Target แล้วไม่สร้าง Animation Instance ใหม่

### จุดหยุดปรับแก้

ถ้าทิศใดแขนพับผิด ให้แก้ Direction/Elbow Constraint ใน Mapping กลาง ไม่เพิ่มเงื่อนไขพิเศษใน `GameScene`

## Path 5 — ทำ Motion Clip พื้นฐาน

### เป้าหมาย

เปลี่ยนจากการทดสอบข้อต่อเป็นการเคลื่อนไหวที่ดูมีน้ำหนัก

### งาน

- ทำ Idle: หายใจ, กระพริบตา, หูกระดิก
- ทำ Peek: เตรียมตัว → เลื่อนขึ้น → ค้าง → ลดกลับ
- ทำ Watch: หยุดนิ่งพร้อม Micro Motion
- ทำ Hide: หดลงรูพร้อม Follow-through
- ทำ Attack: Anticipation → พุ่ง → Contact → Recovery
- ใช้ Timeline/Config ที่ปรับ Duration และ Easing ได้
- ทดสอบ Clip แต่ละอันแยกจาก Gameplay ก่อน

### ไฟล์ที่แตะ

- `src/game/CatAnimation.js`
- `src/game/CatAnimationConfig.js`
- `src/game/CatRig.js`
- `tests/cat-animation-state.test.mjs`

### ผลลัพธ์ที่ต้องได้

- เล่น Clip ซ้ำได้โดยไม่สะสม Offset
- ยกเลิก Clip แล้ว `resetPose()` ได้
- เปลี่ยน Clip ต่อกันได้โดยไม่กระตุก

### จุดหยุดปรับแก้

ถ้า Motion ยังดูแข็ง ให้ปรับ Timing, Easing และ Weight ก่อนเพิ่ม Asset Detail

## Path 6 — เพิ่ม Direction Pose และการหัน

### เป้าหมาย

ให้ Cat หันไปยัง 8 Button Slot โดยไม่หมุนภาพหน้าตรงผิดธรรมชาติ

### งาน

- สร้าง Head/Face Pose 8 ทิศ
- กำหนดว่าแต่ละ Slot ใช้ Direction Pose ใด
- ทิศใกล้กันใช้การหมุนหรือ Blend ต่อเนื่อง
- ทิศตรงข้ามใช้ Direction Pose ใหม่พร้อม Transition
- ทำ Eye Look และ Ear Follow ให้ตามทิศเป้าหมาย
- ตรวจไม่ให้ตา, หู หรือหัวหลุดจาก Head Anchor

### ไฟล์ที่แตะ

- `assets/cat/rig/**`
- `src/game/CatRig.js`
- `src/game/CatAnimation.js`
- `src/game/CatAnimationMath.js`
- `tests/cat-direction-pose.test.mjs`

### ผลลัพธ์ที่ต้องได้

- ทุก Slot มี Face/Head Pose ที่อ่านทิศได้
- ไม่มีการหมุนภาพหน้าตรง 180 องศาเพื่อแทนด้านหลัง
- Transition ระหว่างทิศไม่เกิด Pop ชัดเจน

### จุดหยุดปรับแก้

ถ้าภาพทิศใดดูไม่ดี ให้แก้เฉพาะ Direction Pose และ Mapping ของทิศนั้น โดยไม่กระทบ IK ทั้งระบบ

## Path 7 — ทำ Sabotage Reach และ Occlusion

### เป้าหมาย

ให้ท่ายื่นไปกดปุ่มดูเป็นธรรมชาติและไม่ทะลุโต๊ะ

### งาน

- เล่น Sabotage Preview ก่อน Reach ตามเวลาเดิม
- หันหัว, ไหล่ และแขนเข้าหา Target
- ใช้ IK ยื่น Paw ไปยังจุดกลาง Button
- ทำ Contact Squash/Stretch ตอนแตะปุ่ม
- ใช้ Hole Mask, PawBehind และ PawFront แยกการบัง
- ทำ Retract กลับเข้ารู
- ตรวจทุก Slot ทั้งด้านหน้าและด้านหลังโต๊ะ

### ไฟล์ที่แตะ

- `src/game/CatAnimation.js`
- `src/game/CatRig.js`
- `src/game/CatRigIK.js`
- `src/game/GameScene.js`
- `assets/cat/rig/hole_mask.png`
- `assets/cat/rig/paw_behind.png`
- `assets/cat/rig/paw_front.png`
- `tests/sabotage-flow.test.mjs`

### ผลลัพธ์ที่ต้องได้

- `slotId` เดียวกันใช้ Preview, Highlight, Reach และ Reset Target เดียวกัน
- ผู้เล่นยังกด Button อื่นระหว่าง Sabotage ได้
- Paw ไม่ทะลุขอบโต๊ะและไม่ถูกบังผิดด้าน
- เมื่อ Sabotage ถูกยกเลิก Paw กลับเข้ารูและไม่มี Timer ค้าง

### จุดหยุดปรับแก้

ถ้าเกิดปัญหาเฉพาะด้านหน้า/ด้านหลัง ให้แก้ Occlusion Layer ก่อนแก้ Bone หรือ Slot Position

## Path 8 — เชื่อม CatAnimation เข้ากับ Gameplay

### เป้าหมาย

เปลี่ยน GameScene ให้ส่งคำสั่งระดับสูงแทนการควบคุม Sprite/Tween เอง

### งาน

- สร้าง Interface ของ `CatAnimation`
- ให้ `GameScene` ส่ง `setState`, `reachTo`, `playAttack` และ `hide`
- ย้ายการคำนวณมุม, ระยะ, Scale และ Tween ออกจาก `handleSabotage()`
- ให้ `CatController` ยังคงส่ง State และ Target ผ่าน Callback เดิม
- ให้ `ButtonManager` เป็นแหล่ง Target Point เดียว
- ทำ `TextureStateFallback` และ Feature Flag
- ยกเลิก/หยุด Animation ให้ถูกต้องเมื่อ Pause, Retry, Stage Clear และ Game Over

### ไฟล์ที่แตะ

- `src/game/GameScene.js`
- `src/game/CatController.js` เฉพาะ Interface Callback หากจำเป็น
- `src/game/ButtonManager.js` เฉพาะ Target Point หากจำเป็น
- `src/game/CatAnimation.js`
- `src/game/CatAnimationFallback.js`
- `src/config/gameConfig.js`

### ผลลัพธ์ที่ต้องได้

- `GameScene` ไม่ต้องรู้ Bone, Pivot, Easing หรือ Paw Rotation
- สลับ Rig/Fallback ได้โดยไม่แก้ Gameplay Rule
- Cat Event และ Button Input ทำงานเท่าเดิม

### จุดหยุดปรับแก้

ถ้า Gameplay Regression ให้เปิด Fallback แล้วแก้เฉพาะ Adapter/Interface ห้ามย้อนกลับไปกระจาย Logic ใน `CatController`

## Path 9 — QA, Performance และ Polish

### เป้าหมาย

ยืนยันว่าระบบใหม่พร้อมใช้งานจริง และปรับรายละเอียดหลังระบบนิ่งแล้ว

### งาน

- รัน Unit Test, Build และ Gameplay Test ครบชุด
- ทดสอบทั้ง 8 Slot บน Chrome Android, Safari iPhone และ Desktop
- ตรวจ FPS, Texture Memory และจำนวน Game Object
- ตรวจ Pause/Resume, Retry, Stage Clear และ Game Over ระหว่างทุก Clip
- ตรวจ Visual QA ของ Direction Pose, Occlusion และ Contact
- ปรับ Weight, Overshoot, Follow-through, Shadow และ FX
- ปิด Fallback เฉพาะเมื่อ Rig ผ่านครบทุก Acceptance Criteria

### ไฟล์ที่แตะ

- `tests/**`
- `docs/design/ASSEMBLY_CONTRACT.md`
- `docs/design/ASSET_MANIFEST.md`
- `docs/plans/cat-animation-rig-plan.md`
- `src/game/CatAnimationConfig.js`

### ผลลัพธ์ที่ต้องได้

- Core Loop ไม่เปลี่ยน
- Animation ไม่กระตุกและไม่เกิด Pop ที่อ่านได้ชัด
- ไม่มี Target หลุดหรือ Occlusion ผิดใน 8 ทิศ
- มีผล Test และรายการ Known Limitation บันทึกไว้

### จุดหยุดปรับแก้

แยกปัญหาเป็น Gameplay, Rig Math, Asset, Occlusion หรือ Performance ก่อนแก้ ไม่แก้หลายหมวดใน Commit เดียว

## Checkpoint หลังแต่ละ Path

หลังจบแต่ละ Path ให้บันทึกผลสั้น ๆ ตามแบบนี้:

```text
Path: 0–9
สถานะ: PASS / NEEDS-ADJUSTMENT / BLOCKED
สิ่งที่เปลี่ยน:
สิ่งที่ตรวจแล้ว:
ปัญหาที่พบ:
การตัดสินใจถัดไป:
Fallback ที่ใช้ได้:
```

## กติกาการทำงาน

- หนึ่ง Path ควรมี Commit หรือจุดบันทึกแยกกัน
- ห้ามรวม Asset ใหม่, IK ใหม่ และ Gameplay Integration ในการเปลี่ยนแปลงเดียวกัน
- หาก Path ใดไม่ผ่าน ให้แก้ Path นั้นก่อน ไม่เดินหน้าด้วย Workaround
- ทุก Path ต้องยังสามารถเปิดเกมหรือเปิด Preview ได้
- Fallback ต้องอยู่จนกว่า Path 9 จะผ่าน
