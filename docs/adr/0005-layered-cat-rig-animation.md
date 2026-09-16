# Layered Cat Rig for Motion Animation

Cat State เดิมเปลี่ยนภาพ `cat_hole_*` ทั้งภาพ ซึ่งทำให้การทำ motion ที่ลื่นไหลเสี่ยงขยับ Hole/rim ไปพร้อมกับแมว จึงตัดสินใจสร้าง Cat Rig จากภาพโปร่งใสหลายชิ้น แยกออกจาก Hole/rim และให้ Cat Motion Animation controller เป็นผู้ขับเคลื่อนชิ้นส่วนด้วย normalized keyframe/path โดยคง `CatController` เป็นเจ้าของ gameplay state และ timing เดิม การตัดสินใจนี้เพิ่มงานเตรียม asset แต่ทำให้ breathing, blink, head tilt, ear twitch, attack และ gaze ระหว่าง sabotage ทำได้โดยไม่ทำลาย anchor และ Assembly Contract
