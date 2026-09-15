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
| `catIntervalMin` / `catIntervalMax` | ระยะเวลาที่แมวซ่อนก่อนเริ่ม Event แบบสุ่ม (มิลลิวินาที) | `1500` ถึง `3000` |
| `warningDuration` | ระยะเวลาเตือนก่อนแมวมอง | `700` |
| `peekDuration` | ระยะเวลาแมวโผล่ให้เห็น | `900` |
| `watchDuration` | ระยะเวลาที่แมวจ้อง | `1000` |
| `watchProbability` | โอกาสที่แมวจะเลือกจ้อง (0–1) | `0.35` |
| `sabotagePreviewDuration` | เวลาที่แมวเล็งปุ่มก่อนยื่นมือ (มิลลิวินาที) | `300` |
| `sabotageReachDuration` | เวลาที่มือยื่นถึงปุ่ม (มิลลิวินาที) | `220` |
| `sabotageHitDuration` | จังหวะที่สั่งปิดปุ่มหลังเริ่มยื่นมือ (มิลลิวินาที) | `180` |
| `tapReactionProbability` | โอกาสที่การเปิดปุ่มจะเร่ง SABOTAGE (0–1) | `0.25` |
| `buttonCountMin` / `buttonCountMax` | จำนวนปุ่มที่สุ่มในแต่ละรอบ | `4` ถึง `8` |
| `startingHealth` | จำนวนหัวใจเริ่มต้น (สูงสุด 3 ตาม UI ปัจจุบัน) | `3` |
| `comboDuration` | อายุคอมโบหลังเปิดปุ่มสำเร็จ (มิลลิวินาที) | `2000` |
| `newActivationScore` | คะแนนต่อการเปิดปุ่มใหม่ | `100` |

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
