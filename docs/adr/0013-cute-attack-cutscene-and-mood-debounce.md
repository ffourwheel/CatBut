# Cute attack cutscene and Mood debounce

สถานะ: accepted

## Context

รอยข่วนเดิมวาดด้วยเส้น Graphics จึงดูเป็น debug overlay มากกว่าฉากโจมตี และ Mood cue ถูกสั่งแสดงซ้ำเมื่อค่า Mood เปลี่ยนแต่ยังอยู่ระดับเดิมหรือเมื่อ Cat State เปลี่ยนติดกัน ทำให้ bubble ดูกระพริบ/เด้งรัว

## Decision

- ใช้ `assets/ui/cat_claw_cutscene.png` เป็น spritesheet 2×2 ที่สร้างขึ้นใหม่แบบโปร่งใส โดยเล่น 4 เฟรมตามลำดับอุ้งเท้า → ปาด → รอยข่วน → ประกายจบ
- ห่อ cutscene ด้วย vignette โปร่งบาง, fade in/out และ motion เล็กน้อย โดยให้ Warning/Attack feedback เดิมยังอยู่ด้านหน้า/หลังตาม depth ที่กำหนด
- ให้ Mood cue animate เฉพาะเมื่อ `level` เปลี่ยนจริง และไม่สั่ง show/hide ซ้ำเมื่อ visibility เดิมยังตรงกับ Cat State
- เพิ่ม Mood จาก Rapid Tap ครั้งละ `50` เพื่อให้ “หงุดหงิด” เกิดเร็วขึ้นหลัง anti-mash trigger แรก และ “โมโห” เกิดหลัง trigger ถัดไป

## Consequences

- การโจมตีอ่านเป็นฉากสั้น ๆ ที่มีจังหวะมากกว่ารอยเส้นเดียว และยังมี fallback Graphics เมื่อ asset ไม่พร้อม
- Mood bubble คงที่และอ่านง่ายขึ้น โดยไม่เสียการตอบสนองเมื่อข้ามระดับ
- Rapid Tap มีผลชัดขึ้น จึงต้องคง feedback ข้อความและ HUD ให้บอกเหตุผลอย่างต่อเนื่อง
