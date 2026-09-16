# Tap activation and cat reaction actions

สถานะ: superseded by [ADR 0004](0004-autonomous-trolling-cat-actions.md)

เกมเปลี่ยนจากการกดค้างเพื่อชาร์จเป็นการแตะครั้งเดียวแล้วเปิด Button ทันที จึงไม่มี charge progress, decay หรือผลลัพธ์จาก Pointer Up อีกต่อไป การแตะใน WATCH ยังคงทำให้เกิด ATTACK และการแตะนั้นไม่เปิดปุ่ม เพื่อรักษาความเสี่ยงจากการอ่านจังหวะแมว

การตัดสินใจเดิมให้ทุกการเปิด Button สำเร็จเริ่ม Reaction Action ทันทีถูกยกเลิก เพราะทำให้จังหวะการเล่นเดาง่ายเกินไป

การตัดสินใจเรื่อง Tap Activation และ Combo 2 วินาทียังคงใช้ต่อ แต่พฤติกรรม Cat Action ให้ยึด ADR 0004 แทน
