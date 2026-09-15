# CatKub Assembly Contract

เอกสารนี้เป็น Shared Contract ระหว่าง SYSTEM / GAMEPLAY กับ UX/UI + ASSET

## Canvas และ Anchor

- Canvas: `1024 × 1024`
- Anchor: Center of Hole ที่ `(512, 512)`
- ทุก Layer ใช้ Origin `(0.5, 0.5)`
- Scale `(1, 1)`
- Rotation `0`

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
├── catState   → cat_hole_[state].png → Depth 20
├── sabotagePaw → sabotage paw layer  → Depth 25
└── tableFront → generated transparent placeholder → Depth 30
```

Runtime object names ต้องเป็น `catTableContainer`, `tableBack`, `catState`, `sabotagePaw` และ `tableFront`

## State Switching

เมื่อ Cat State เปลี่ยน ให้เปลี่ยนเฉพาะ Texture ของ `catState`:

- `tableBack` ไม่เปลี่ยน
- `catState` เปลี่ยน Texture เท่านั้น
- `sabotagePaw` แสดงเฉพาะระหว่าง Sabotage และหมุน/เคลื่อนไปยังจุดกึ่งกลางของ `slotId` เป้าหมาย
- `tableFront` ไม่เปลี่ยน
- ห้ามเปลี่ยน X, Y, Scale, Rotation หรือ Origin ของ `tableBack`, `catState` หรือ `tableFront` ระหว่าง State
- ห้ามหมุนทั้ง `cat_hole_sabotage.png`; ใช้ภาพดังกล่าวเป็น reference แล้วแยกฐานแมวกับเลเยอร์อุ้งเท้า

## Targeted Sabotage Contract

- Stage เลือก `slotId` จาก preset 4–8 ช่อง โดยช่องที่ไม่ใช้ไม่มี Button และไม่มี hit area
- Cat Controller ส่ง `targetSlotId` ให้ Gameplay/UI Animation
- ปุ่มเป้าหมายไฮไลต์ 300 ms ก่อนอุ้งเท้าเคลื่อนที่ 220 ms
- อุ้งเท้าจบที่กึ่งกลาง Button และกลับเข้ารูประมาณ 200 ms
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
```

## Placeholder Rule

ระบบ Gameplay ต้องรันได้โดยไม่ต้องรอ Asset จริง โดยใช้ Placeholder Texture ที่สร้างใน Runtime และใช้ Asset Loader keys ชุดเดียวกัน เมื่อ Asset จริงพร้อมใช้งาน ให้เปลี่ยนเฉพาะแหล่ง Texture โดยไม่เปลี่ยน Transform
