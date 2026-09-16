# Difficulty pacing and generated Mood cue

สถานะ: accepted

## Context

ค่าปกติเดิมเว้นช่วง Cat Event นานเกินไปเมื่อเทียบกับเวลาที่ผู้เล่นใช้เปิดปุ่ม ทำให้บางรอบเล่นจบก่อนเจอแรงกดดันจากแมว และ Mood overlay ที่ฝังอยู่ใน Cat Rig ถูกหมุนและสเกลตามท่าทางจนอ่านเป็นเส้นรบกวนแทนที่จะเป็นสถานะอารมณ์

## Decision

- ปรับ `normal` ให้ Cat Event เริ่มในช่วง `500–850ms`, WARNING `350ms`, PEEK `400ms`, WATCH probability `0.60` และคง minimum gap `500ms`
- ปรับ `hard` ให้ใช้ Cat Event `500–700ms`, WARNING `300ms`, PEEK `350ms`, WATCH probability `0.70`, ปุ่ม `6–8` ปุ่ม และ Sabotage cooldown `900ms`
- คง `easy` เป็น preset สำหรับการเรียนรู้ และคงหัวใจเริ่มต้น 3 ดวง
- ใช้ asset `assets/ui/cat_mood_bubbles.png` เป็น spritesheet 2×2 ที่สร้างสำหรับ Mood cue โดยให้เกมวาง label ภาษาไทยแยกจากภาพ
- Mood cue เป็น floating UI ที่ UIManager ควบคุม แยกจาก Cat Rig, ติดตามตำแหน่งหัวโดยไม่หมุนหรือสเกลตามแมว และใช้ depth ต่ำกว่า Warning cue
- แสดง Mood cue ใน HIDDEN/WARNING/PEEK/WATCH/ATTACK และซ่อนใน SABOTAGE/HIDE ที่แมวหันหลังหรือกำลังมุด
- HUD ลดเป็น pill แบบ 4 segment พร้อมไอคอนและชื่อระดับ เพื่อเป็น fallback เมื่อ Mood cue ถูกซ่อน
- ถ้าเปิดปุ่มครบก่อน Cat Event แรก รอบจะรอจนแมวแสดง WARNING และจบ Event แรกก่อนจึงเคลียร์รอบ เพื่อไม่ให้กดรัวจบรอบโดยไม่เจอกลไกแมว

## Consequences

- Normal จะได้เจอ Cat Event ก่อนเคลียร์รอบเสมอ โดยยังมี WARNING/PEEK ให้ตอบสนองได้
- Hard กดดันต่อเนื่องจากจำนวนปุ่มและ cooldown ที่สั้นลง โดยไม่ลดจำนวนหัวใจ
- Mood cue ไม่รับผลกระทบจากการหมุน/ยืดของแขนและลำตัว จึงอ่านระดับได้คงที่
- ต้องดูแล frame contract ของ generated spritesheet และ label mapping ให้ตรงกับระดับ Mood ทั้งสี่
