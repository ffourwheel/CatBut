# Difficulty pacing and generated Mood cue

สถานะ: accepted

## Context

ค่าปกติเดิมเว้นช่วง Cat Event นานเกินไปเมื่อเทียบกับเวลาที่ผู้เล่นใช้เปิดปุ่ม ทำให้บางรอบเล่นจบก่อนเจอแรงกดดันจากแมว และ Mood overlay ที่ฝังอยู่ใน Cat Rig ถูกหมุนและสเกลตามท่าทางจนอ่านเป็นเส้นรบกวนแทนที่จะเป็นสถานะอารมณ์

## Decision

- ปรับ `normal` ให้ Cat Event เริ่มในช่วง `500–850ms`, WARNING `350ms`, PEEK `400ms`, WATCH probability `0.60` และคง minimum gap `500ms`
- ปรับ `hard` ให้ใช้ Cat Event `500–700ms`, WARNING `300ms`, PEEK `350ms`, WATCH probability `0.70`, ปุ่มคงที่ 8 ปุ่ม และ Sabotage cooldown `900ms` พร้อมจังหวะปิดปุ่มที่เร็วขึ้น
- คง `easy` เป็น preset สำหรับการเรียนรู้ และคงหัวใจเริ่มต้น 3 ดวง
- ใช้ asset `assets/ui/cat_mood_bubbles.png` เป็น spritesheet 2×2 ที่สร้างสำหรับ Mood cue โดยให้เกมวาง label ภาษาไทยแยกจากภาพ
- Mood cue เป็น floating UI ที่ UIManager ควบคุม แยกจาก Cat Rig, ติดตามตำแหน่งหัวโดยไม่หมุนหรือสเกลตามแมว และใช้ depth ต่ำกว่า Warning cue
- แสดง Mood cue ง่วงเฉพาะ HIDDEN; ระดับสนใจ/หงุดหงิด/โมโหแสดงเฉพาะ PEEK/WATCH และซ่อนใน WARNING/ATTACK/SABOTAGE/HIDE เพื่อไม่ทับ Warning หรือ Cutscene
- HUD ลดเป็น pill แบบ 4 segment พร้อมไอคอนและชื่อระดับ เพื่อเป็น fallback เมื่อ Mood cue ถูกซ่อน
- เมื่อเปิดปุ่มสุดท้ายสำเร็จให้ Stage Clear ทันที และยกเลิก Cat Event ที่กำลังทำงานหรือคิวที่รออยู่ เพื่อไม่ให้ Sabotage ในเฟรมเดียวกันทำให้รอบค้าง

## Consequences

- Normal จะเริ่มกดดันจาก Cat Event เร็วขึ้น และ Rapid Tap ตอนแมวตื่นจะลงโทษด้วย ATTACK โดยไม่ต้องรอ Cat Event ใหม่
- Hard กดดันต่อเนื่องจากจังหวะแมวที่เร็วขึ้นและ cooldown ที่สั้นลง โดยไม่ลดจำนวนหัวใจ
- Mood cue ไม่รับผลกระทบจากการหมุน/ยืดของแขนและลำตัว จึงอ่านระดับได้คงที่
- ต้องดูแล frame contract ของ generated spritesheet และ label mapping ให้ตรงกับระดับ Mood ทั้งสี่
