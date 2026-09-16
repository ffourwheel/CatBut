# Connected Cat Reach Animation for Sabotage

## Status

Accepted

## Context

ภาพต้นแบบเดิมทำให้มือของแมวดูเหมือนโผล่จากบริเวณหัว เพราะใช้ `sabotage_paw` เป็นเลเยอร์แยกที่ยืดตรงไปยัง Button Slot เป้าหมาย แม้จะรักษา Hole และโต๊ะให้นิ่ง แต่ motion ไม่มีความสัมพันธ์ของหัว ไหล่ ลำตัว และแขน จึงดูไม่เป็นธรรมชาติ โดยเฉพาะเมื่อเป้าหมายอยู่คนละทิศรอบวง

## Decision

เปลี่ยน Sabotage เป็น `Cat Reach Animation` ที่สร้างจาก Cat Rig ใหม่ ไม่อิงภาพ `cat_hole_*` เดิมเป็น animation หลัก โดยแยกอย่างน้อยเป็น:

- body/root สำหรับการถ่ายน้ำหนักและการหันลำตัว
- head สำหรับการมองและหันตามเป้าหมาย
- shoulder/chest สำหรับจุดเชื่อมแขน
- near arm และ far arm สำหรับเลือกแขนตามด้านของ Button Slot
- paw เป็นปลายมือของแขน ไม่ใช่เลเยอร์ที่ลอยจากหัว

ทุก target ใช้ motion sequence เดียวกันแต่คำนวณ path ตาม Button Slot: มองเป้า → หันตัว → เอื้อม → กดค้างสั้น ๆ → ถอนแขน → มุดกลับ ปุ่มด้านล่างใช้ partial turn ประมาณ 90–120° แทนการกลับด้าน 180° เพื่อคง silhouette และอ่านทิศทางได้ชัด

`CatController` ยังคงเป็นเจ้าของ state, timer และ gameplay resolution ส่วน `CatAnimationController` รับผิดชอบเฉพาะ presentation และต้องไม่ขยับ Hole/table root ระหว่าง action

## Consequences

ข้อดีคือแขนมีจุดกำเนิดจากลำตัวจริง, การกดปุ่มแต่ละทิศอ่านได้, และสามารถเพิ่ม secondary motion เช่น shoulder follow-through หรือ recoil ได้โดยไม่กระทบกติกาเกม

ข้อแลกเปลี่ยนคือจำเป็นต้องเตรียม asset หลายชิ้นและเพิ่มเวลาของ Sabotage ให้มีช่วงหันตัว/เอื้อม/กด/ถอน รวมถึงต้องทดสอบ anchor ของทุก Slot

## Supersedes

แนวทางใช้ `sabotage_paw` เป็นแขนหลักใน [ADR 0005](0005-layered-cat-rig-animation.md) เฉพาะส่วน Sabotage เท่านั้น โดยยังคงหลักการแยก Cat Rig ออกจาก Hole/table และเก็บ asset เดิมไว้เป็น fallback/reference
