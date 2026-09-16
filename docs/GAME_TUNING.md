# การตั้งค่าเกม CatKub

ค่าปรับเกมทั้งหมดอยู่ที่ [`src/config/gameConfig.js`](../src/config/gameConfig.js) จุดเดียว
ตัวระบบจะส่ง config ชุดเดียวกันให้แมว ปุ่ม คะแนน คอมโบ และหัวใจ จึงไม่ต้องแก้หลายไฟล์

## เปลี่ยนระดับความยาก

แก้บรรทัดนี้:

```js
export const ACTIVE_GAME_PRESET = 'normal';
```

ค่าที่ใช้ได้คือ `normal`, `easy` และ `hard`

## ค่าที่ปรับบ่อย

| ค่า | ความหมาย | ตัวอย่าง |
| --- | --- | ---: |
| `catIntervalMin` / `catIntervalMax` | ระยะเวลาพื้นฐานที่แมวซ่อนก่อนเริ่ม Event แบบสุ่ม (มิลลิวินาที) | `500` ถึง `850` |
| `catEventMinimumGap` | ช่วงพักขั้นต่ำระหว่าง Cat Event (มิลลิวินาที) | `500` |
| `warningDuration` | ระยะเวลาเตือนก่อนแมวมอง | `350` |
| `peekDuration` | ระยะเวลาแมวโผล่ให้เห็น | `400` |
| `watchDuration` | ระยะเวลาที่แมวจ้อง | `1000` |
| `watchProbability` | โอกาสที่แมวจะเลือกจ้อง (0–1) | `0.60` |
| `sabotagePreviewDuration` | เวลาที่แมวเล็งปุ่มและหันตัวก่อนยื่นแขน (มิลลิวินาที) | `160` |
| `sabotageReachDuration` | เวลาที่แขนต่อจากไหล่ยื่นถึงปุ่ม (มิลลิวินาที) | `120` |
| `sabotageHitDuration` | จังหวะสัมผัส/สั่งปิดปุ่มหลังเริ่มยื่นแขน (มิลลิวินาที) | `80` |
| `tapReactionProbability` | โอกาสที่การเปิดปุ่มปกติจะเร่ง SABOTAGE (0–1) | `0.40` |
| `rapidTapThreshold` / `rapidTapWindow` | จำนวนและช่วงเวลาที่แตะรัวจนแมวลงโทษตาม Cat State | `2` ครั้งใน `500` มิลลิวินาที |
| `buttonCount` | จำนวนปุ่มที่ใช้ในแต่ละรอบ (คงที่ ไม่สุ่ม) | `8` |
| `startingHealth` | จำนวนหัวใจเริ่มต้น (สูงสุด 3 ตาม UI ปัจจุบัน) | `3` |
| `comboDuration` | อายุคอมโบหลังเปิดปุ่มสำเร็จ (มิลลิวินาที) | `2000` |
| `newActivationScore` | คะแนนต่อการเปิดปุ่มใหม่ | `10` |
| `reactivationBaseScore` / `reactivationStep` / `reactivationFloor` | คะแนน Reactivation ลดลงตามจำนวนครั้ง | `5` / `1` / `1` |

## Cat Mood

Mood มี 4 ระดับและเพิ่มขึ้นเฉพาะเมื่อเกิด Rapid Tap ไม่เพิ่มจากการเปิดปุ่มปกติหรือ Reactivation

| ระดับ | ค่า | ตัวคูณระยะรอ Cat Event |
| --- | ---: | ---: |
| ง่วง | `0–24` | `1.00` |
| สนใจ | `25–49` | `0.85` |
| หงุดหงิด | `50–74` | `0.70` |
| โมโห | `75–100` | `0.55` |

Rapid Tap เพิ่ม Mood `50` หน่วยต่อครั้ง ทำให้ชุด Rapid Tap แรกขึ้นระดับ “หงุดหงิด” ได้ทันที และชุดถัดไปขึ้น “โมโห” หลังไม่มี Rapid Tap `2,000 ms` Mood จะลดหนึ่งระดับทุก `1,500 ms` โดยช่วงพักขั้นต่ำของ Cat Event ยังคงเป็น `500 ms` เสมอ Rapid Tap ตอน `PEEK/WATCH` เปลี่ยนเป็น ATTACK และ Rapid Tap ตอน `HIDDEN` เร่ง Sabotage; การแตะเดี่ยวในจังหวะปลอดภัยไม่เสียหัวใจ

Preset `hard` ใช้ `sabotagePreviewDuration = 120 ms`, `sabotageReachDuration = 100 ms` และ `sabotageHitDuration = 70 ms` เพื่อให้แมวปิดปุ่มเร็วขึ้นโดยยังมีช่วง Preview สั้น ๆ ให้อ่านเป้าหมาย ทุก preset ใช้ปุ่มครบ 8 ปุ่มเหมือนกัน

Mood cue ใช้ `assets/ui/cat_mood_bubbles.png` เป็น spritesheet แบบ 2×2: `sleepy=0`, `curious=1`, `annoyed=2`, `angry=3` โดย UI วาง label ภาษาไทยแยกจากภาพและติดตามหัวแมวโดยไม่หมุนตาม Cat Rig `sleepy` แสดงเฉพาะ HIDDEN ส่วนระดับอื่นแสดงเฉพาะ PEEK/WATCH การเปลี่ยน bubble จะ animate เฉพาะตอนข้ามระดับ เพื่อไม่ให้ภาพเด้งรัวจากค่า Mood ที่เปลี่ยนอยู่ในระดับเดิม

เมื่อผู้เล่นโดน WATCH จะเล่น `assets/ui/cat_claw_cutscene.png` แบบ 4 เฟรม: อุ้งเท้าเตรียมฟาด → ปาด → รอยข่วน → ประกายจบ พร้อม vignette และ fade สั้น ๆ

เมื่อเปิดปุ่มสุดท้ายสำเร็จ Stage Clear จะเกิดทันทีและยกเลิก Cat Event หรือคิว Sabotage ที่กำลังทำงาน เพื่อไม่ให้แมวปิดปุ่มในเฟรมเดียวกันแล้วทำรอบค้าง

Preset `hard` ใช้ Cat Event `500–700 ms`, WARNING `300 ms`, PEEK `350 ms`, WATCH probability `0.70`, ปุ่มคงที่ 8 ปุ่ม และ Sabotage cooldown `900 ms`; preset `easy` คงช่วงพักยาวเพื่อใช้เรียนรู้

## Override ตอนทดสอบ

เปิดเกมด้วย query string เพื่อทดลอง preset โดยไม่แก้ไฟล์:

```text
/?preset=easy
/?preset=hard
```

ถ้าต้องการปรับเฉพาะค่า ให้ตั้ง `CATKUB_CONFIG` ก่อนสร้างเกม เช่น:

```js
globalThis.CATKUB_CONFIG = {
  preset: 'normal',
  peekDuration: 1400,
  watchProbability: 0.35,
  debug: { forceButtonCount: 8 },
};
```

ค่าที่อยู่นอกช่วงปลอดภัยจะถูกปรับให้อยู่ในช่วงที่เกมรองรับอัตโนมัติ เช่น ความน่าจะเป็นจะถูกจำกัดไว้ระหว่าง `0` ถึง `1` และจำนวนปุ่มมาตรฐานคือ `8`; การ override จำนวนปุ่มควรใช้ `debug.forceButtonCount` เฉพาะการทดสอบ
