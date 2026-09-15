# Cat Animation Rig — Checkpoints

เอกสารนี้บันทึกผลการทำงานตาม [Execution Paths](cat-animation-rig-execution-paths.md) เพื่อให้ย้อนดูได้ว่าแต่ละขั้นผ่านอะไรแล้วและต้องแก้ตรงไหนต่อ

## Path 0 — Baseline และจุดถอยกลับ

```text
สถานะ: PASS
```

สิ่งที่ตรวจแล้ว:

- `npm test` ผ่าน 2 tests ก่อนเริ่ม Path 1
- `npm run build` ผ่านก่อนเริ่ม Path 1
- พบ Vite warning เรื่อง bundle ใหญ่กว่า 500 kB แต่ไม่ใช่ Build Failure
- ตรวจแล้วว่าการแก้ไขเดิมของผู้ใช้ใน `AssetManifest`, `ButtonManager`, `GameScene`, `UIManager` และ `HUDLayout` มีอยู่ก่อนเริ่ม Path 1 และไม่ได้ถูกย้อนกลับ

Fallback ที่ใช้ได้:

- ระบบ Cat State และ `sabotagePaw` เดิมยังอยู่
- ยังไม่ได้เปิดใช้ Cat Rig ใหม่

## Path 1 — ล็อก 8 Button Slot และ Mapping

```text
สถานะ: PASS
```

สิ่งที่เปลี่ยน:

- `src/game/constants.js` เปลี่ยนจากตำแหน่งแบบ 4 แถว เป็น Ring 8 จุดห่างกัน 45 องศา
- เพิ่ม `BUTTON_RING_RADIUS`
- เพิ่ม `BUTTON_SLOT_ANGLES_DEGREES`
- เพิ่ม `angle` ให้ข้อมูลของแต่ละ Button Slot เพื่อให้ Animation ใช้ Mapping กลางได้
- `prototype/modular-table-cat-assembly.html` แสดง Marker ของ `slot-1` ถึง `slot-8`
- เพิ่ม `tests/button-slot-layout.test.mjs`
- ปรับ `src/game/PlaceholderArt.js` ให้ `tableBack`, `tableFront` และ Cat ใช้ Anchor เดียวกันที่จุดกลางหลุม
- ปรับ Scale ของชั้นโต๊ะกลับเป็น 1:1 ให้ตรงกับ Preview และภาพอ้างอิง
- แยก `TABLE_ASSEMBLY_ANCHOR` (512,512) ออกจาก `TABLE_ANCHOR` ของหลุม/ปุ่ม (512,452)
- เลื่อน Cat, Paw, Button Ring และ Debug Marker ขึ้น 60 logical px ให้ตรงกับศูนย์กลางรูที่เห็นจริง

สิ่งที่ตรวจแล้ว:

- Test แรกตั้งใจให้ Red กับ Mapping เดิม และพบมุมจริงเป็น 20, 42, 138, 160, 186, 212, 328, 354 องศา
- หลังแก้ Mapping Test กลายเป็น Green และตรวจครบมุม 0, 45, 90, 135, 180, 225, 270, 315
- ตรวจว่าทั้ง 8 Slot อยู่บนรัศมีเดียวกัน
- เปิด Preview และหน้าเกมเพื่อตรวจการประกอบโต๊ะหลังปรับ Anchor แล้ว
- ตรวจว่า Preview แสดง `Hole Anchor (512, 452)` และยังคงประกอบ Layer เดิมได้
- `npm test` ผ่าน 3 tests
- `npm run build` ผ่าน

สิ่งที่ยังไม่ทำใน Path นี้:

- ยังไม่ได้สร้าง Cat Rig
- ยังไม่ได้สร้าง IK
- ยังไม่ได้ย้าย Sabotage Animation ออกจาก `GameScene`
- ยังไม่ได้ทำ Asset Direction Pose

ปัญหาที่พบ:

- Vite ยังคงแจ้ง Bundle ใหญ่กว่า 500 kB ซึ่งเป็น Warning เดิมและไม่เกี่ยวกับ Mapping

การตัดสินใจถัดไป:

- เริ่ม Path 2 ด้วย Placeholder Layer และ Pivot ก่อนสร้าง Asset แมวจริง

## Path 2 — Asset Blockout และ Pivot

```text
สถานะ: PASS
```

สิ่งที่เปลี่ยน:

- เพิ่ม `src/game/CatRig.js` เป็น Contract ของ Blockout Pose แบบไม่ผูกกับ Phaser
- กำหนด Parent/Pivot สำหรับ `catRoot`, `body`, `head`, `ears`, `eyes`, `upperArm`, `forearm`, `paw` และ `shadow`
- เพิ่ม `getWorldTransform()` สำหรับตรวจตำแหน่งจาก Parent Chain โดยยังไม่ทำ IK
- เพิ่ม `resetPose()` และ Test ของ Seam นี้
- เพิ่มมุมมอง `Blockout: Pivot + Occlusion` ใน `prototype/modular-table-cat-assembly.html`
- ใช้ Table Front วาดทับ Blockout เพื่อทดสอบการบังเชิงภาพ
- คง Prototype ให้เปิดเป็นไฟล์เดี่ยวได้ โดยใช้ Blockout Contract แบบ inline และไม่บังคับ `file://` ให้โหลด ES Module

สิ่งที่ตรวจแล้ว:

- Cat Rig ใช้ `Hole Anchor (512,452)` เป็นจุดอ้างอิง
- `head → body`, `forearm → upperArm`, `paw → forearm` มี Parent Chain ถูกต้อง
- เปลี่ยน Pose แล้ว `resetPose()` คืนค่าทุกชิ้นกลับตำแหน่งเริ่มต้น
- Preview แสดง Placeholder ของลำตัว หัว หู ตา แขน และ Paw พร้อม Pivot Marker
- ตรวจว่า Prototype ยังเป็น Standalone HTML ได้
- `npm test` ผ่าน 6 tests
- `npm run build` ผ่าน

สิ่งที่ยังไม่ทำใน Path นี้:

- ยังไม่สร้าง 2-Bone IK
- ยังไม่ใช้ Blockout แทน Cat Texture ใน Gameplay หลัก
- ยังไม่ทำ Motion Timeline หรือ Direction Pose

ปัญหาที่พบ:

- Vite ยังคงแจ้ง Bundle ใหญ่กว่า 500 kB ซึ่งเป็น Warning เดิมและไม่เกี่ยวกับ Cat Rig Blockout

การตัดสินใจถัดไป:

- เริ่ม Path 3 ด้วย Runtime Transform Hierarchy และ Debug Toggle ก่อนต่อยอดไป IK

## Path 3 — Cat Rig และ Transform Hierarchy

```text
สถานะ: PASS
```

สิ่งที่เปลี่ยน:

- เพิ่ม `src/game/CatRigRuntime.js` สำหรับสร้าง Runtime Container ของ Cat Rig จาก Blockout Contract
- เพิ่ม Parent Chain จริง: `catRoot → body → head → ears/eyes` และ `catRoot → upperArm → forearm → paw`
- เพิ่ม Pivot Marker และ Bone Line สำหรับ Debug Runtime
- เพิ่ม `resetPose()`, `setVisible()` และ `setDebugVisible()` ให้ Runtime Rig
- เพิ่ม Query Debug Toggle: `?rig=blockout`
- เมื่อเปิด Debug Rig ระบบซ่อน Cat Texture เฉพาะโหมดนี้ ส่วนค่าเริ่มต้นยังใช้ Texture Fallback เดิม
- เพิ่ม `CAT_RIG_HIERARCHY` และ Hierarchy Test

สิ่งที่ตรวจแล้ว:

- เปิด `http://127.0.0.1:5173/?rig=blockout` แล้วเห็น Blockout ใน Scene จริง
- Table Front ยังวางทับส่วนล่างของ Rig ตามลำดับ Layer
- การหมุน Parent ส่งผลถึง Child และ `resetPose()` คืนค่าได้
- Root และ Preview ตอบกลับ HTTP 200
- `npm test` ผ่าน 8 tests
- `npm run build` ผ่าน

สิ่งที่ยังไม่ทำใน Path นี้:

- ยังไม่ทำ 2-Bone IK
- ยังไม่ทำ Motion Timeline
- ยังไม่เปลี่ยน Direction Pose หรือเชื่อม Sabotage Reach เข้ากับ Runtime Rig

ปัญหาที่พบ:

- Vite ยังคงแจ้ง Bundle ใหญ่กว่า 500 kB ซึ่งเป็น Warning เดิมและไม่เกี่ยวกับ Hierarchy

การตัดสินใจถัดไป:

- เริ่ม Path 4 ด้วย Pure 2-Bone IK Solver และ Test Target ทั้ง 8 Slot ก่อนเชื่อมเข้าภาพ Runtime

## Path 4 — 2-Bone IK สำหรับ Reach

```text
สถานะ: PASS
```

สิ่งที่เปลี่ยน:

- เพิ่ม `src/game/CatRigIK.js` เป็น Pure 2-Bone IK Solver
- จำกัด Target ให้อยู่ในระยะต่ำสุด/สูงสุดของ UpperArm + Forearm
- คืนค่า Shoulder, Elbow, Paw, มุมข้อต่อ และสถานะ `clamped`
- เพิ่ม `CAT_ANIMATION_TARGETS` และ `getAnimationTargetForSlot()` สำหรับ Mapping ปุ่มทั้ง 8 จุด
- เพิ่ม `reachTo()` ใน `src/game/CatRigRuntime.js` เพื่อเตรียมเชื่อม Solver เข้ากับ Runtime Arm Chain
- เพิ่มมุมมอง `IK Targets: 8 ทิศ` ใน Prototype เพื่อตรวจเส้น Shoulder → Elbow → Paw และจุด Target หลัง Table Front

สิ่งที่ตรวจแล้ว:

- Target ที่อยู่ในระยะทำให้ Paw จบตรง Target
- Target ไกลเกินถูก Clamp ที่ระยะสูงสุด
- Target ใกล้เกินถูก Clamp ที่ระยะต่ำสุด
- ทุก `slot-1` ถึง `slot-8` คืน Animation Target และ Direction Pose ของตัวเอง
- Preview แสดง Target Marker ครบทั้ง 8 จุด
- `npm test` ผ่าน 13 tests
- `npm run build` ผ่าน
- Root, Runtime Blockout และ Preview ตอบกลับ HTTP 200

### Adjustment — ลำดับ Layer ของโต๊ะ

```text
สถานะ: PASS
ลำดับภาพ: back_table → Hole_Cat → front_table
```

สิ่งที่เปลี่ยน:

- ปรับ `ASSEMBLY_DEPTH` ใน `src/game/constants.js` ให้ `BACK: 10`, `MIDDLE: 20`, `FRONT: 30`, `BUTTONS: 40`, `FOREGROUND: 50`
- ทำให้ `Hole_Cat` อยู่ระหว่างโต๊ะด้านหลังและโต๊ะด้านหน้าอย่างชัดเจน
- เพิ่ม `tests/table-layer-order.test.mjs` เพื่อกันไม่ให้ลำดับกลับมาทับกันอีก

สิ่งที่ตรวจแล้ว:

- Test แรกตั้งใจให้ Red และยืนยันว่าค่าเดิมวาด `MIDDLE` อยู่เหนือ `FRONT`
- หลังปรับ Depth แล้ว Test กลายเป็น Green
- `npm test` ผ่าน 13 tests
- `npm run build` ผ่าน
- `git diff --check` ไม่พบ whitespace error

### Adjustment — แยกตำแหน่งแนวตั้งของแต่ละ Layer

```text
back_table  อยู่ที่ Offset `-155 logical px`
Hole_Cat    ขยับลงเป็น Offset `-20 logical px` และขยายเป็น `115%`
front_table คงตำแหน่งปัจจุบัน `+185 logical px`
```

สิ่งที่เปลี่ยน:

- เพิ่ม `TABLE_LAYER_GAP_Y`, `TABLE_BACK_OFFSET_Y` และ `TABLE_FRONT_OFFSET_Y` ใน `src/game/constants.js`
- `createCatTableAssembly()` ใช้ Offset แยกสำหรับ `tableBack` และ `tableFront`
- Prototype ใช้ Offset เดียวกัน เพื่อให้ภาพจำลองกับ Gameplay ตรงกัน
- เพิ่ม Test ยืนยันว่า Cat ใช้ `TABLE_HOLE_OFFSET_Y` เดิม และโต๊ะหลัง/หน้าแยกไปคนละทิศ

สิ่งที่ตรวจแล้ว:

- Preview เห็นช่องว่างและลำดับภาพ `back_table → Hole_Cat → front_table` ชัดขึ้น
- `npm test` ผ่าน 14 tests
- `npm run build` ผ่าน

สิ่งที่ยังไม่ทำใน Path นี้:

- ยังไม่ทำ Easing, Timeline หรือ Weight ของ Motion
- ยังไม่ทำ Direction Pose จริงของหัว/ใบหน้า
- ยังไม่ย้ายการคำนวณ Sabotage จาก `GameScene` เข้า `CatAnimation`

ปัญหาที่พบ:

- Vite ยังคงแจ้ง Bundle ใหญ่กว่า 500 kB ซึ่งเป็น Warning เดิมและไม่เกี่ยวกับ IK

การตัดสินใจถัดไป:

- เริ่ม Path 5 ด้วย Motion Clip พื้นฐาน: Idle, Peek, Watch, Hide และ Attack

## Path 5 — Motion Clip พื้นฐาน

```text
สถานะ: PASS
ขอบเขต: Pure Controller ยังไม่ผูกกับ Gameplay จริง
```

สิ่งที่เปลี่ยน:

- เพิ่ม `src/game/CatAnimationConfig.js` สำหรับ Clip, Duration, Loop และ Easing
- เพิ่ม `src/game/CatAnimation.js` เป็น Controller ที่ sample Transform จาก Authored Pose
- เพิ่ม Clip พื้นฐาน `Idle`, `Peek`, `Watch`, `Hide` และ `Attack`
- เพิ่ม Idle Breathing, Blink, Ear Micro Motion และ Watch Micro Motion
- เพิ่ม Anticipation → Lunge → Recovery สำหรับ Attack
- เพิ่ม Transition Blend ระหว่าง Clip และ `cancel/reset` ที่คืน Pose ได้โดยไม่สะสม Offset
- แยก `HOLE_CAT_OFFSET_Y` ออกจาก `TABLE_HOLE_OFFSET_Y` เพื่อให้ Layer Cat ขยับได้โดยไม่ย้าย Anchor ปุ่ม
- เพิ่ม `tests/cat-animation-state.test.mjs`

สิ่งที่ตรวจแล้ว:

- Idle Loop ครบรอบแล้วกลับค่าเดิมโดยไม่สะสม Offset
- Peek และ Attack จบที่ Authored Pose
- Hide จบด้วย Root ที่เลื่อนลงรู และ `reset()` คืน Pose ได้
- Cancel Clip ระหว่างทางแล้วคืน Pose ได้
- เปลี่ยน Clip แล้ว Blend จากท่าเดิมไปท่าใหม่ได้
- `npm test` ผ่าน 19 tests
- `npm run build` ผ่าน
- `git diff --check` ไม่พบ whitespace error

สิ่งที่ยังไม่ทำใน Path นี้:

- ยังไม่เชื่อม Controller เข้ากับ `GameScene` หรือ `CatController`
- ยังไม่ใช้ Runtime Phaser Rig เป็นตัวขับ Clip จริง
- ยังไม่ทำ Direction Pose 8 ทิศแบบ Asset จริง

การตัดสินใจถัดไป:

- เริ่ม Path 6 ด้วย Direction Pose และการหันหัว/ตา/หูไปยัง 8 Button Slot

## Path 6 — Direction Pose และการหัน

```text
สถานะ: PASS
ขอบเขต: Pure Direction Pose Controller สำหรับ Blockout
```

สิ่งที่เปลี่ยน:

- เพิ่ม `src/game/CatDirectionPose.js` สำหรับ Direction Pose 8 ทิศ
- Map `slot-1` ถึง `slot-8` ไปยัง `upLeft`, `upRight`, `left`, `right`, `downLeft`, `downRight`, `up`, `down`
- ใช้ Offset ของ `head`, `eyes`, `leftEar` และ `rightEar` แทนการหมุนภาพหน้าตรง 180 องศา
- เพิ่ม `faceTo()` ใน `src/game/CatAnimation.js` ให้รับทั้งชื่อ Direction Pose และ `slotId`
- Blend Direction Pose ได้ระหว่างที่ Motion Clip กำลังเล่นอยู่
- ปรับ `CatRigIK` ให้คืนชื่อ Direction Pose ที่ใช้งานจริงแทนค่าองศาดิบ
- เพิ่ม `tests/cat-direction-pose.test.mjs`

สิ่งที่ตรวจแล้ว:

- ทุก Button Slot มี Direction Pose ที่เสถียร
- มุมใกล้เคียงถูก Normalize เข้าทิศ 45 องศาที่ถูกต้อง
- หัวไม่หมุนกลับ 180 องศาเพื่อแทนด้านหลัง
- เปลี่ยนจากขวาไปซ้ายด้วย Blend โดยไม่เกิด Pose Pop
- หันไปยัง Slot ได้ขณะ Watch Motion Clip กำลังเล่น
- `npm test` ผ่าน 24 tests
- `npm run build` ผ่าน
- `git diff --check` ไม่พบ whitespace error

สิ่งที่ยังไม่ทำใน Path นี้:

- ยังไม่เชื่อม Direction Pose เข้ากับ Runtime Phaser Rig จริง
- ยังไม่มี Asset Head/Face แบบแยก Layer สำหรับ 8 ทิศ
- ยังไม่ย้าย Sabotage Reach และ Occlusion เข้า `CatAnimation`

การตัดสินใจถัดไป:

- เริ่ม Path 7 ด้วย Sabotage Reach, Contact และ Occlusion ของ Paw รอบโต๊ะ

## Path 7 — Sabotage Reach และ Occlusion (Progress)

```text
สถานะ: NEEDS-ADJUSTMENT
ขอบเขตที่ผ่าน: Reach Geometry, Contact Squash และ Round-table Occlusion
```

สิ่งที่เปลี่ยน:

- เพิ่ม `src/game/CatReach.js` เป็นจุดคำนวณกลางสำหรับ Origin, Target, Angle, Distance และ Scale ของการยื่น Paw
- ให้ `GameScene` ใช้ Reach Plan เดียวกันกับทุก Button Slot แทนการคำนวณแยกใน Handler
- เพิ่ม Contact Squash/Stretch ช่วงท้ายของการยื่น เพื่อให้การแตะปุ่มมีน้ำหนักก่อนคืนค่า Scale
- Round Table ใช้ Front Ring Crop บังส่วนล่างของ Cat/Paw ทำให้ลำดับภาพยังเป็น `back_table → Hole_Cat/Paw → front_table → buttons`
- เพิ่ม `tests/cat-reach.test.mjs` ตรวจ Reach Plan ครบทั้ง 8 Slot และตรวจ Squash ก่อน/หลัง Contact

สิ่งที่ตรวจแล้ว:

- ทุก Slot คืน Angle และ Scale ที่อยู่ในขอบเขตเดียวกัน
- Preview โต๊ะวงกลมแสดง Cat ในช่องและ Front Ring บังส่วนล่างได้ถูกต้อง
- Preview ไม่มี Console Error/Warning
- `npm test` ผ่าน 26 tests
- `npm run build` ผ่าน

สิ่งที่ยังไม่ทำใน Path นี้:

- ยังไม่ผูก 2-Bone IK เข้ากับภาพ Cat จริงใน Gameplay หลัก
- ยังไม่แยก Head/Shoulder และ Paw Behind/Paw Front เป็น Runtime Rig จริง
- ยังไม่ย้าย Animation Command ทั้งชุดออกจาก `GameScene` เข้า Cat Animation Adapter

การตัดสินใจถัดไป:

- ต่อด้วย Runtime Adapter ใน Path 8 โดยคง Texture Fallback และ Round Table Preview ไว้จนกว่าจะผ่าน Visual QA
