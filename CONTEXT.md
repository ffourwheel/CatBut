# Cat Button Stealth

เกมอาร์เคดแนว Stealth ที่ผู้เล่นเปิดปุ่มด้วยการกดค้าง ขณะสังเกตแมวซึ่งสามารถตรวจจับหรือแกล้งปิดปุ่มที่เปิดแล้วได้

## Gameplay Domain

**Button**:
ปุ่มสีบนโต๊ะที่ผู้เล่นต้องกดค้างเพื่อเปลี่ยนจาก OFF เป็น ON
_Avoid_: switch, light, target

**Button Slot**:
ตำแหน่งปุ่มถาวรบนโต๊ะจากชุดสูงสุด 8 ตำแหน่ง โดยระบุด้วย `slot-1` ถึง `slot-8` และไม่เปลี่ยนตำแหน่งระหว่าง Stage
_Avoid_: button position, dynamic slot

**Unused Slot**:
ช่องในชุด Button Slot ที่ Stage นั้นไม่ได้ใช้งาน จะแสดงเป็นโต๊ะว่างและไม่ถือเป็น Button
_Avoid_: disabled button, empty button

**Stage Button Set**:
ชุด Button ที่ใช้งานจริงใน Stage หนึ่ง Stage มีได้ 4–8 ปุ่ม และเลือกจาก Button Slot เดิมด้วยชุดตำแหน่งที่กำหนดล่วงหน้า โดยจำนวนคู่ใช้ชุดสมมาตร ส่วนจำนวนคี่ใช้ชุดที่ออกแบบไว้ล่วงหน้าโดยไม่สุ่ม และไม่จัดเรียงตำแหน่งใหม่
_Avoid_: active slots, button layout

**Progress**:
ความคืบหน้าของการกดค้างปุ่มหนึ่งปุ่ม ซึ่งจะลดลงทันทีแบบเส้นตรงเมื่อผู้เล่นปล่อยมือก่อนเปิดสำเร็จ และลดจาก 100% เป็น 0% ภายในประมาณ 1 วินาทีใน Prototype
_Avoid_: charge, meter

**Activated Button**:
ปุ่มที่เปิดสำเร็จและอยู่ในสถานะ ON จนกว่าแมวจะ Sabotage
_Avoid_: completed button, lit button

**Cat Event**:
หนึ่งรอบการกระทำของแมว ตั้งแต่เริ่ม Warning จนแมวกลับไป Hidden
_Avoid_: cat turn, encounter

**Warning**:
ช่วงเตือนล่วงหน้าก่อนแมวเข้า WATCH โดยต้องให้ผู้เล่นมีเวลาตัดสินใจปล่อยปุ่ม
_Avoid_: alert, notification

**Watch**:
สถานะที่แมวตรวจจับว่าผู้เล่นกำลังกดปุ่มอยู่ หากกำลังกดอยู่จะถูกโจมตีทันที
_Avoid_: detect phase, look

**Sabotage**:
การที่แมวปิด Activated Button ใน Button Slot เป้าหมายครั้งละหนึ่งปุ่มต่อ Cat Event โดยไม่แตะปุ่มที่กำลังกดค้าง ผู้เล่นยังกดปุ่มอื่นต่อได้ระหว่างลำดับนี้ แล้วแมวจึงกลับไป Hidden พร้อมมี Cooldown ประมาณ 3 วินาที
_Avoid_: undo, cat attack

**Sabotage Target**:
Button ที่แมวสุ่มเลือกจาก Activated Button ซึ่งไม่ใช่ปุ่มที่กำลังกดค้าง เพื่อปิดใน Cat Event ปัจจุบัน โดยอ้างอิง Button Slot ที่มีอยู่จริงและจุดกึ่งกลางของ Button เป็นปลายทาง
_Avoid_: cat target, sabotage position

**Sabotage Preview**:
การไฮไลต์ Sabotage Target ล่วงหน้า 300 มิลลิวินาทีก่อน Sabotage Paw เคลื่อนที่ 220 มิลลิวินาทีไปยังกึ่งกลางปุ่ม แล้วแมวกลับเข้ารูภายในประมาณ 200 มิลลิวินาที เพื่อให้ผู้เล่นอ่านเหตุการณ์ได้ทัน
_Avoid_: target warning, sabotage alert

**Sabotage Paw**:
เลเยอร์อุ้งเท้าที่อ้างอิงท่าจาก `cat_hole_sabotage.png` และหมุนตาม Button Slot เป้าหมาย โดยไม่หมุนฐานรูหรือโต๊ะ
_Avoid_: rotating cat, rotating sabotage image

**Combo**:
ตัวคูณคะแนนที่เพิ่มจากการเปิดปุ่มสำเร็จต่อเนื่อง สูงสุด x4 และรีเซ็ตเมื่อผู้เล่นถูกแมวโจมตี ทั้งการเปิดปุ่มใหม่และการ Reactivation เพิ่ม Combo
_Avoid_: streak, chain

**Stage**:
รอบการเล่นหนึ่งรอบที่จบเมื่อผู้เล่นเปิด Stage Button Set ครบหรือหัวใจหมด โดยแต่ละ Stage ใช้ปุ่ม 4–8 ปุ่ม ใน Prototype จะมี Stage เดียวที่ใช้ค่าเริ่มต้น Hold 0.8 วินาที, Cat Interval 4–6 วินาที, Warning 0.8 วินาที, Watch 0.8 วินาที, Watch 60% และ Sabotage 40%
_Avoid_: level, round

**Stage Clear**:
ผลลัพธ์เมื่อ Activated Button ครบทุกปุ่มใน Stage Button Set พร้อมกัน โดยหยุด Cat Event ทันทีและแสดงผลสรุปคะแนน
_Avoid_: victory, win screen

**Game Over**:
ผลลัพธ์เมื่อหัวใจของผู้เล่นหมด และเปิดทางให้ Retry หรือกลับหน้าแรก
_Avoid_: defeat, lose screen

**Pointer Session**:
การกดปุ่มหนึ่งครั้งตั้งแต่ Pointer Down จนถึง Pointer Up หรือ Pointer Up Outside โดย Prototype รองรับทีละหนึ่ง Pointer
_Avoid_: touch session, input gesture

**Reactivation**:
การเปิดปุ่มที่ถูก Sabotage ไปแล้วกลับมาอีกครั้ง โดยคะแนนพื้นฐานลดลงตามจำนวนครั้งที่เปิดซ้ำเป็น 50, 40, 30, 20 และ 10 (ขั้นต่ำ 10) แล้วคูณด้วย Combo ปัจจุบัน และเพิ่ม Combo ได้สูงสุด x4
_Avoid_: retry activation, repeat score

## Player Experience

**Prototype**:
เวอร์ชันแรกที่เน้นทดสอบ Core Loop ได้แก่ การกดค้าง การหลบแมว การถูกโจมตี การ Sabotage คะแนน Combo การชนะ แพ้ Retry รวมถึง Start, Tutorial, Pause, Stage Clear และ Game Over
_Avoid_: demo, alpha

**Core Loop**:
กดค้าง → สังเกต Warning → ปล่อยเพื่อหลบหรือเสี่ยงกดต่อ → เปิดปุ่ม → ทำซ้ำจนเปิดครบ
_Avoid_: main loop, gameplay cycle
