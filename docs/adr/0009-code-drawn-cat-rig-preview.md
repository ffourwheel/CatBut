# ADR 0009: ใช้ Code-drawn Cat Rig ระหว่าง Tune Motion

## Status

Accepted

## Context

Cat Motion Animation ต้องตรวจจุดเชื่อมระหว่าง body, head, gaze และ Cat Reach Chain ให้เห็นชัดก่อนตัดสินใจเรื่อง asset ภาพขั้นสุดท้าย การใช้ภาพ raster ที่มีรายละเอียดมากทำให้แยกไม่ออกว่าอาการกระตุกหรือแขนลอยมาจาก motion contract หรือจากขอบเขตของภาพ

## Decision

ใช้ Cat Rig ที่วาดด้วย Phaser Graphics เป็น visual default ระหว่างพัฒนาและ tune motion โดยแยกเป็น body, awake head, sleep head, gaze และ arm ซ้าย/ขวาเหมือน production rig เดิม ตัว rig ใช้ coordinate และ base scale contract เดียวกับ raster rig เพื่อให้ CatAnimationController ไม่ต้องรู้ว่า visual layer เป็นภาพวาดหรือภาพ raster

เก็บ raster Cat Rig เดิมไว้เป็น fallback ผ่าน `useVectorCat: false` และไม่เปลี่ยน Cat State, timer, score, input หรือกติกา Sabotage

## Consequences

- ตรวจเส้นทางและจังหวะของทุก Cat Action ได้ทันที และเห็นการเชื่อมไหล่ถึงอุ้งเท้าได้ง่าย
- ลดความเสี่ยงจากการตีความขอบโปร่งใสหรือ anchor ของ asset ระหว่าง tune motion
- ภาพ preview มีรายละเอียดน้อยกว่า production art จึงยังต้องทำ art pass ภายหลัง หากต้องการใช้ภาพ raster เป็น final
- การคง contract เดิมทำให้เปลี่ยนกลับไปใช้ raster ได้โดยไม่ต้องเขียน animation ใหม่
