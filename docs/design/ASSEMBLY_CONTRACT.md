# CatKub Assembly Contract

เอกสารนี้เป็น Shared Contract ระหว่าง SYSTEM / GAMEPLAY กับ UX/UI + ASSET

## Canvas และ Anchor

- Canvas: `1024 × 1024`
- Anchor: Center of Hole ที่ `(512, 512)`
- `tableBack`, `catState`, `catRig` root และ `tableFront` ใช้ Origin `(0.5, 0.5)`
- Scale `(1, 1)` และ Rotation `0` เป็นค่าของ assembly root ที่ไม่เปลี่ยนระหว่าง State
- ชิ้นส่วนภายใน `catRig` อนุญาตให้ใช้ pivot เฉพาะทาง: body/head ใช้กึ่งกลาง ส่วนแขนใช้จุด shoulder เพื่อหมุนจากข้อต่อจริง

## Circular Table Layout

- `tableBack` เป็นแผ่นโต๊ะกลมแบบ placeholder ศูนย์กลางเดียวกับ Hole มีรัศมีแนวนอนประมาณ `480 px` และแนวตั้งประมาณ `430 px` เพื่อเพิ่มพื้นที่ด้านซ้าย–ขวา
- Hole เดิมยังอยู่ที่กึ่งกลาง `(512, 512)`
- Button Slot มีตำแหน่งถาวร 8 จุดบนวงแหวนวงรี รัศมีแนวนอนประมาณ `335 px` และแนวตั้งประมาณ `310 px`
- `slot-1` เริ่มที่ 12 นาฬิกา และ Slot ถัดไปเรียงตามเข็มนาฬิกาทีละ `45°`
- Stage ยังคงเลือกใช้งาน 4–8 Slot จากตำแหน่งถาวรชุดนี้

## Layer Structure

```text
catTableContainer
├── tableBack  → generated circular placeholder → Depth 10
├── catState   → cat_hole_[state].png fallback → Depth 30
├── catRig     → body + head + connected near/far arms → Depth 31
├── sabotagePaw → legacy fallback end-effector → Depth 35
└── tableFront → generated transparent placeholder → Depth 15
```

Runtime object names ต้องเป็น `catTableContainer`, `tableBack`, `catState`, `catRig`, `sabotagePaw` และ `tableFront`

## State Switching

เมื่อ Cat State เปลี่ยน ให้เปลี่ยนเฉพาะ presentation layer ของแมว:

- `tableBack` ไม่เปลี่ยน
- ถ้า Cat Rig โหลดสำเร็จ ให้ `CatAnimationController` เปลี่ยนเฉพาะ `catRig` และคง `catState` ที่ซ่อนเป็น fallback
- ถ้า Cat Rig โหลดไม่ได้ ให้ `catState` เปลี่ยน Texture เท่านั้น
- `catRig` แสดง Cat Reach Animation ระหว่าง Sabotage โดยใช้แขนชิ้นเดียวแบบสั้นที่เชื่อมจาก shoulder/chest ของแมว
- `sabotagePaw` ใช้เฉพาะเมื่อ Cat Reach Rig โหลดไม่ครบ และต้องไม่แสดงพร้อมกับแขนของ `catRig`
- `tableFront` ไม่เปลี่ยน
- ห้ามเปลี่ยน X, Y, Scale, Rotation หรือ Origin ของ `tableBack`, `catState`, `catRig` root หรือ `tableFront` ระหว่าง State
- ห้ามใช้มือที่ลอยจากหัวหรือหมุนทั้ง `cat_hole_sabotage.png` เป็น animation หลัก

## Targeted Sabotage Contract

- Stage เลือก `slotId` จาก preset 4–8 ช่อง โดยช่องที่ไม่ใช้ไม่มี Button และไม่มี hit area
- Cat Controller ส่ง `targetSlotId` ให้ Gameplay/UI Animation
- ปุ่มเป้าหมายไฮไลต์ก่อน Cat Reach Animation เริ่มหันตัวและเอื้อมแขน
- ลำตัวและหัวต้องหันเข้าหาเป้าหมายก่อนแขนด้านใกล้เริ่มเอื้อม เพื่อรักษาความยาวแขนให้สั้นและต่อเนื่อง
- แขนที่เลือกตามด้านของเป้าหมายต้องเคลื่อนจาก shoulder/chest ไปยังกึ่งกลาง Button พร้อมช่วงกดสั้น ๆ แล้วถอนกลับ
- ผู้เล่นยังรับ input ของปุ่มอื่นระหว่าง Sabotage ได้
- มุมหมุนใช้ค่าแยกของ `slot-1` ถึง `slot-8` เพื่อให้ศิลปินปรับได้รายช่อง

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
sabotage_paw
cat_rig_head
cat_rig_paws
cat_reach_body_v2
cat_reach_head_v2
cat_reach_sleep_head_v3
cat_reach_gaze_v3
cat_reach_arm_left_v2
cat_reach_arm_right_v2
```

ชุด `cat_reach_upper_arm_*_v3` และ `cat_reach_forearm_*_v3` เป็น legacy/reference asset ไม่ใช่ dependency ที่จำเป็นต่อการเปิดใช้ Cat Reach Rig

## Placeholder Rule

ระบบ Gameplay ต้องรันได้โดยไม่ต้องรอ Asset จริง โดยใช้ Placeholder Texture ที่สร้างใน Runtime และใช้ Asset Loader keys ชุดเดียวกัน เมื่อ Asset จริงพร้อมใช้งาน ให้เปลี่ยนเฉพาะแหล่ง Texture โดยไม่เปลี่ยน Transform
