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
| `sabotagePreviewDuration` | เวลาที่แมวเล็งปุ่มและหันตัวก่อนยื่นแขน (มิลลิวินาที) | `350` |
| `sabotageReachDuration` | เวลาที่แขนต่อจากไหล่ยื่นถึงปุ่ม (มิลลิวินาที) | `280` |
| `sabotageHitDuration` | จังหวะสัมผัส/สั่งปิดปุ่มหลังเริ่มยื่นแขน (มิลลิวินาที) | `260` |
| `tapReactionProbability` | โอกาสที่การเปิดปุ่มจะเร่ง SABOTAGE (0–1) | `0.40` |
| `rapidTapThreshold` / `rapidTapWindow` | จำนวนและช่วงเวลาที่แตะรัวจนแมวเร่ง SABOTAGE แน่นอน | `2` ครั้งใน `500` มิลลิวินาที |
| `buttonCountMin` / `buttonCountMax` | จำนวนปุ่มที่สุ่มในแต่ละรอบ | `4` ถึง `8` |
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

Rapid Tap เพิ่ม Mood `50` หน่วยต่อครั้ง ทำให้ชุด Rapid Tap แรกขึ้นระดับ “หงุดหงิด” ได้ทันที และชุดถัดไปขึ้น “โมโห” หลังไม่มี Rapid Tap `2,000 ms` Mood จะลดหนึ่งระดับทุก `1,500 ms` โดยช่วงพักขั้นต่ำของ Cat Event ยังคงเป็น `500 ms` เสมอ

Mood cue ใช้ `assets/ui/cat_mood_bubbles.png` เป็น spritesheet แบบ 2×2: `sleepy=0`, `curious=1`, `annoyed=2`, `angry=3` โดย UI วาง label ภาษาไทยแยกจากภาพและติดตามหัวแมวโดยไม่หมุนตาม Cat Rig การเปลี่ยน bubble จะ animate เฉพาะตอนข้ามระดับ เพื่อไม่ให้ภาพเด้งรัวจากค่า Mood ที่เปลี่ยนอยู่ในระดับเดิม

เมื่อผู้เล่นโดน WATCH จะเล่น `assets/ui/cat_claw_cutscene.png` แบบ 4 เฟรม: อุ้งเท้าเตรียมฟาด → ปาด → รอยข่วน → ประกายจบ พร้อม vignette และ fade สั้น ๆ

ถ้าเปิดปุ่มครบก่อน Cat Event แรก รอบจะรอให้แมวแสดง WARNING และจบ Event แรกก่อนจึงเคลียร์รอบ เพื่อให้ผู้เล่นได้เจอกลไกแมวทุกครั้ง

Preset `hard` ใช้ Cat Event `500–700 ms`, WARNING `300 ms`, PEEK `350 ms`, WATCH probability `0.70`, ปุ่ม `6–8` ปุ่ม และ Sabotage cooldown `900 ms`; preset `easy` คงช่วงพักยาวเพื่อใช้เรียนรู้

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
  buttonCountMin: 6,
  buttonCountMax: 6,
};
```

ค่าที่อยู่นอกช่วงปลอดภัยจะถูกปรับให้อยู่ในช่วงที่เกมรองรับอัตโนมัติ เช่น ความน่าจะเป็นจะถูกจำกัดไว้ระหว่าง `0` ถึง `1` และจำนวนปุ่มอยู่ระหว่าง `1` ถึง `8`
