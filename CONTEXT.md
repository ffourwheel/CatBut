# Cat Button Stealth

เกมอาร์เคดแนว Stealth ที่ผู้เล่นแตะเปิดปุ่มให้ติดทันที ขณะสังเกตแมวซึ่งสามารถตรวจจับหรือแกล้งปิดปุ่มที่เปิดแล้วได้

## Gameplay Domain

**Button**:
ปุ่มสีบนโต๊ะที่ผู้เล่นแตะหนึ่งครั้งเพื่อเปลี่ยนจาก OFF เป็น ON ทันที หากยังไม่ถูกแมวปิด
_Avoid_: switch, light, target

**Button Slot**:
ตำแหน่งปุ่มถาวรรอบ Hole บนวงแหวนวงรีของแผ่นโต๊ะกลมจากชุดสูงสุด 8 ตำแหน่ง โดยระบุด้วย `slot-1` ถึง `slot-8`; `slot-1` อยู่ด้านบนและตำแหน่งถัดไปเรียงตามเข็มนาฬิกาทีละ 45° โดยไม่เปลี่ยนตำแหน่งระหว่าง Stage
_Avoid_: button position, dynamic slot

**Unused Slot**:
ช่องในชุด Button Slot ที่ Stage นั้นไม่ได้ใช้งาน จะแสดงเป็นโต๊ะว่างและไม่ถือเป็น Button
_Avoid_: disabled button, empty button

**Stage Button Set**:
ชุด Button ที่ใช้งานจริงใน Stage หนึ่ง Stage มีได้ 4–8 ปุ่ม และเลือกจาก Button Slot เดิมด้วยชุดตำแหน่งที่กำหนดล่วงหน้า โดยจำนวนคู่ใช้ชุดสมมาตร ส่วนจำนวนคี่ใช้ชุดที่ออกแบบไว้ล่วงหน้าโดยไม่สุ่ม และไม่จัดเรียงตำแหน่งใหม่
_Avoid_: active slots, button layout

**Stage Progress**:
จำนวน Activated Button เทียบกับจำนวน Button ใน Stage Button Set เช่น 2/4 โดยไม่มีความคืบหน้าระหว่างการกดปุ่ม
_Avoid_: charge, meter

**Activated Button**:
ปุ่มที่เปิดสำเร็จและอยู่ในสถานะ ON จนกว่าแมวจะ Sabotage
_Avoid_: completed button, lit button

**Cat Event**:
หนึ่งรอบการกระทำของแมวที่เริ่มจาก Timer แบบสุ่ม ตั้งแต่เริ่ม Warning จนแมวกลับไป Hidden โดย Cat Event จะสุ่มเลือก WATCH หรือ SABOTAGE
_Avoid_: cat turn, encounter

**Cat Action**:
การกระทำจริงของแมวใน Cat Event ซึ่งมีเฉพาะ WATCH และ SABOTAGE ใน Prototype
_Avoid_: cat move, random trick

**Cat Rig**:
ชุดส่วนประกอบภาพของแมวที่แยกจากกันและประกอบเป็นรูปลักษณ์ของแมว โดยไม่รวม Hole หรือขอบฐานรู
_Avoid_: cat image, sprite group

**Cat Motion Animation**:
การเคลื่อนไหวเชิงภาพของ Cat Rig ระหว่าง Cat State เพื่อสื่อการโผล่ จ้อง โจมตี แกล้ง และมุดกลับ โดยไม่เปลี่ยนกติกาหรือสถานะของเกม
_Avoid_: state transition, gameplay action

**Sleep Idle**:
ท่าพักปกติของแมวเมื่อไม่มี Cat Action โดยแมวจะหลับให้เห็นบางส่วนอยู่ใน Hole และมีการขยับเล็กน้อยเพื่อสื่อว่ากำลังนอน ไม่ใช่การหายออกจากฉากหรือการเปลี่ยนกติกาเกม
_Avoid_: hidden state, inactive cat

**Cat Reach Chain**:
แขนที่ต่อเนื่องจากไหล่ถึงอุ้งเท้าใน Cat Reach Animation โดย runtime ใช้แขนชิ้นเดียวแบบสั้นและขยับลำตัว/หัวเข้าหา Sabotage Target ก่อนเอื้อม เพื่อไม่ให้เกิดรอยต่อหลายข้อหรือภาพแขนลอย
_Avoid_: detached hand, hand overlay

**Warning**:
ช่วงเตือนล่วงหน้าก่อนแมวเข้า WATCH โดยต้องให้ผู้เล่นมีเวลาตัดสินใจว่าจะชะลอการแตะปุ่ม
_Avoid_: alert, notification

**Watch**:
สถานะที่แมวตรวจจับการแตะปุ่ม หากผู้เล่นแตะในช่วงนี้จะถูกโจมตีทันทีและการแตะนั้นไม่เปิดปุ่ม
_Avoid_: detect phase, look

**Sabotage**:
การที่แมวปิด Activated Button ใน Button Slot เป้าหมายครั้งละหนึ่งปุ่ม โดยเกิดจาก Cat Event ตามเวลาเป็นหลัก และมีโอกาสถูกเร่งจากการเปิดปุ่มสำเร็จบางครั้ง แมวจะเลือกปุ่มที่เปิดอยู่แบบสุ่ม และถ้า Action ถูกเร่งจากการแตะจะยกเว้นปุ่มที่เพิ่งแตะถ้าเป็นไปได้ ผู้เล่นยังแตะปุ่มอื่นต่อได้ระหว่างลำดับนี้ แล้วแมวจึงกลับไป Hidden พร้อมมี Cooldown สำหรับ Cat Event ตามเวลา
_Avoid_: undo, cat attack

**Sabotage Target**:
Button ที่แมวสุ่มเลือกจาก Activated Button เพื่อปิดใน Cat Event ปัจจุบัน โดยอ้างอิง Button Slot ที่มีอยู่จริงและจุดกึ่งกลางของ Button เป็นปลายทาง
_Avoid_: cat target, sabotage position

**Tap Pressure**:
โอกาสที่การเปิด Button สำเร็จจะเร่ง Sabotage ของแมว โดยปกติไม่เกิดทุกครั้งที่แตะ แต่การแตะ 2 ครั้งภายใน 500 มิลลิวินาทีจะเร่ง Sabotage แน่นอน ถ้าแมวกำลังทำ Action อยู่จะรอคิวได้เพียงหนึ่ง Action และเริ่มหลังช่วงพักขั้นต่ำ 500 มิลลิวินาที
_Avoid_: instant counter, guaranteed reaction

**Cat Mood**:
ระดับความหงุดหงิดของแมวที่เพิ่มขึ้นเฉพาะเมื่อเกิด Rapid Tap ครั้งละ 25 หน่วย แบ่งเป็น 4 ระดับคือ ง่วง (0–24), สนใจ (25–49), หงุดหงิด (50–74) และโมโห (75–100) ระดับที่สูงขึ้นทำให้ระยะรอก่อน Cat Event สั้นลงตามตัวคูณ 1.00, 0.85, 0.70 และ 0.55 ตามลำดับ แต่ไม่เปลี่ยนชนิดของ Cat Action โดยตรง หลังไม่มี Rapid Tap 2 วินาที Mood จะลดลงหนึ่งระดับทุก 1.5 วินาที
_Avoid_: cat anger meter, continuous mood pressure

**Sabotage Preview**:
การไฮไลต์ Sabotage Target ล่วงหน้าก่อน Cat Reach Animation เริ่มหันตัวและเอื้อมแขนไปยังกึ่งกลางปุ่ม เพื่อให้ผู้เล่นอ่านเหตุการณ์ได้ทัน
_Avoid_: target warning, sabotage alert

**Sabotage Paw**:
ปลายมือของแมวที่ต่อเนื่องมาจากแขนใน Cat Reach Animation ใช้สัมผัสกึ่งกลาง Button เป้าหมาย ไม่ใช่เลเยอร์มือที่โผล่แยกจากหัว
_Avoid_: detached hand, hand from head

**Cat Reach Animation**:
การกระทำเชิงภาพของแมวระหว่าง Sabotage ที่ประกอบด้วยการมองเป้า หันหัว/ลำตัว ถ่ายน้ำหนัก ยื่นแขน กดปุ่ม และถอนกลับ โดยแขนต้องเชื่อมกับไหล่หรือลำตัวตลอดการเคลื่อนไหว
_Avoid_: instant paw teleport, rotating hand overlay

**Combo**:
ตัวคูณคะแนนที่เพิ่มจากการเปิดปุ่มสำเร็จต่อเนื่อง สูงสุด x4 และหมดอายุเมื่อไม่มีการเปิดปุ่มสำเร็จเป็นเวลา 2 วินาที รีเซ็ตทันทีเมื่อผู้เล่นถูกแมวโจมตี ทั้งการเปิดปุ่มใหม่และการ Reactivation เพิ่ม Combo
_Avoid_: streak, chain

**Stage**:
รอบการเล่นหนึ่งรอบที่จบเมื่อผู้เล่นเปิด Stage Button Set ครบหรือหัวใจหมด โดยแต่ละ Stage ใช้ปุ่ม 4–8 ปุ่ม ผู้เล่นเปิดแต่ละปุ่มด้วยการแตะครั้งเดียว และ Cat Event ใช้ช่วงเวลาพื้นฐานประมาณ 0.75–1.3 วินาทีในค่าปกติ พร้อมช่วงพักขั้นต่ำ 0.5 วินาที การแตะรัวจะเร่ง Sabotage เพื่อกันการชนะด้วยการกดสุ่มเร็ว ๆ
_Avoid_: level, round

**Stage Clear**:
ผลลัพธ์เมื่อ Activated Button ครบทุกปุ่มใน Stage Button Set พร้อมกัน โดยหยุด Cat Event ทันทีและแสดงผลสรุปคะแนน
_Avoid_: victory, win screen

**Game Over**:
ผลลัพธ์เมื่อหัวใจของผู้เล่นหมด และเปิดทางให้ Retry หรือกลับหน้าแรก
_Avoid_: defeat, lose screen

**Pointer Session**:
การแตะหนึ่งครั้งที่เริ่มและจบผลลัพธ์ที่ Pointer Down ทันที โดย Prototype รองรับทีละหนึ่ง Pointer และ Pointer Up ไม่มีผลต่อสถานะปุ่ม
_Avoid_: touch session, input gesture

**Reactivation**:
การเปิดปุ่มที่ถูก Sabotage ไปแล้วกลับมาอีกครั้ง โดยคะแนนพื้นฐานลดลงตามจำนวนครั้งที่เปิดซ้ำเป็น 5, 4, 3, 2 และ 1 (ขั้นต่ำ 1) แล้วคูณด้วย Combo ปัจจุบัน และเพิ่ม Combo ได้สูงสุด x4
_Avoid_: retry activation, repeat score

## Player Experience

**Prototype**:
เวอร์ชันแรกที่เน้นทดสอบ Core Loop ได้แก่ การแตะเปิดปุ่ม การอ่านจังหวะแมว การถูกโจมตี การ Sabotage คะแนน Combo การชนะ แพ้ Retry รวมถึง Start, Tutorial, Pause, Stage Clear และ Game Over
_Avoid_: demo, alpha

**Core Loop**:
แตะเปิดปุ่ม → อ่าน Cat Action ที่สุ่มออกมา → หลบ WATCH และรับมือ SABOTAGE → Reactivation เมื่อถูกปิด → ทำซ้ำจนเปิดครบ
_Avoid_: main loop, gameplay cycle
