# Continuous Cat Animation with a 2D Rig

สถานะ: accepted

CatKub จะเปลี่ยนการแสดงผล Cat จากการสลับ `cat_hole_[state].png` เป็นหลัก ไปเป็น 2D Rig ที่ประกอบจาก Layer แยก ใช้ Timeline สำหรับท่าหลัก และใช้ 2-bone IK สำหรับการ Reach ไปยัง Button Slot ทั้ง 8 จุด โดยยังคง `CatController` และกติกา Gameplay เดิมไว้ เหตุผลคือ Animation แบบต่อเนื่องให้การยื่นอุ้งเท้า, การหดกลับ, การเปลี่ยนทิศ และ Micro Motion ที่เป็นธรรมชาติกว่า ขณะที่การแยก Cat Animation ออกจาก Gameplay ทำให้ยังมี Texture State Fallback ระหว่าง Migration และเมื่อ Asset Rig ไม่ครบ

## Considered Options

- ใช้ Texture State และ Tween ต่อไป: ความเสี่ยงต่ำ แต่ไม่สามารถให้การยืด, การถ่ายน้ำหนัก และการหันไปยัง 8 ทิศได้เป็นธรรมชาติ
- ใช้ Mesh Deformation เป็นระบบหลัก: ยืดหยุ่น แต่ควบคุมข้อต่อ, Occlusion และคุณภาพขนได้ยากกว่าในระยะเริ่มต้น
- ใช้ 3D Model: รองรับด้านหน้า/ด้านหลังได้ดีที่สุด แต่มีต้นทุน Asset, Rendering และ Pipeline สูงเกินขอบเขตของ Prototype ปัจจุบัน

## Consequences

- ต้องสร้าง Source Asset แบบ Layered ใหม่และทำ Direction Pose ของหัว/ใบหน้า 8 ทิศ
- ต้องมี Module และ Test เพิ่มสำหรับ Rig, IK, Direction และ Occlusion
- Button Slot จะถูกล็อกเป็น 8 ตำแหน่งรอบโต๊ะ ห่างกัน 45 องศา
- Gameplay ยังส่ง `state` และ `slotId` แบบเดิมได้ และผู้เล่นยังกด Button อื่นระหว่าง Sabotage ได้
