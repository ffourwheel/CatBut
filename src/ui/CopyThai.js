/**
 * CatKub Thai Copywriting Dictionary
 * Tone of Voice: Warm, Playful, Cozy Cat Café
 * Domain terminology aligned with CONTEXT.md and CATKUB_SUMMARY.md
 */

export const COPY_THAI = Object.freeze({
  app: {
    title: 'CatKub',
    subtitle: 'กดปุ่มให้ครบ ระวังแมว!',
    tagline: 'เกมกดค้างแบบแอบ ๆ ในคาเฟ่แมวสุดอบอุ่น',
  },

  hud: {
    scoreLabel: 'คะแนน',
    comboLabel: 'คอมโบ',
    comboTimerLabel: 'เวลาคอมโบ',
    heartsLabel: 'หัวใจ',
    progressLabel: 'เปิดปุ่มให้ครบ',
    progressRatio: (completed, total) => `${completed}/${total}`,
    soundOn: 'เปิดเสียง',
    soundOff: 'ปิดเสียง',
    pause: 'พักเกม',
  },

  instructions: {
    promptHold: 'กดปุ่มค้างไว้ ให้ติดไฟ!',
    promptHolding: (percent) => `กำลังเปิด ${Math.round(percent * 100)}%`,
    promptSafe: 'ปลอดภัยแล้ว รีบกดต่อเร็ว!',
  },

  catFeedback: {
    warningTitle: 'ระวัง!',
    warningMessage: 'ระวัง! แมวกำลังจับตาดูนะ 🐱',
    watchTitle: 'จับตาดูอยู่!',
    watchMessage: 'แมวกำลังจ้อง! อย่าขยับนะ!',
    attackTitle: 'โดนตบแล้ว!',
    attackMessage: 'โดนจับได้เต็ม ๆ! เสียหัวใจ 1 ดวง',
    sabotageTitle: 'แมวแกล้ง!',
    sabotageMessage: 'เมี๊ยว! แมวแอบยื่นอุ้งมือมาปิดปุ่ม!',
    hideMessage: 'แมวมุดกลับเข้าหลุมแล้ว!',
  },

  buttonFeedback: {
    activated: '+100 คะแนน!',
    reactivated: (pts) => `เปิดซ้ำ +${pts} คะแนน!`,
    comboUp: (x) => `คอมโบ x${x}! 🔥`,
    comboLost: 'คอมโบหลุด!',
  },

  screens: {
    start: {
      title: 'CatKub',
      subtitle: 'กดปุ่มให้ครบ ระวังแมว!',
      description: 'แอบเปิดปุ่มบนโต๊ะให้ครบตามจำนวนที่สุ่มได้ (4–8 ปุ่ม)\nโดยอย่าให้เจ้าเหมียวในรูจับได้!',
      playButton: 'เริ่มเกม',
      tutorialPrompt: 'แตะหรือคลิกเพื่อเริ่มเล่น',
    },

    tutorial: {
      title: 'วิธีเล่นง่าย ๆ ใน 3 ขั้นตอน',
      steps: [
        {
          number: '1',
          heading: '👆 กดค้างเพื่อเปิดปุ่ม',
          body: 'แตะปุ่มบนโต๊ะค้างไว้\nจนวงแหวนเต็ม = เปิดสำเร็จ!\n\nปล่อยมือก่อน → วงแหวนจะค่อย ๆ ลด',
          hint: 'กดทีละ 1 ปุ่ม ให้ครบทุกปุ่ม',
        },
        {
          number: '2',
          heading: '👀 ระวังแมวจ้อง!',
          body: 'เห็นหูแมวโผล่ + เครื่องหมาย ❗\n→ รีบปล่อยมือทันที!\n\nถ้ายังกดค้างอยู่ = โดนตบ!',
          hint: 'โดนตบ → เสีย ♥ 1 ดวง + คอมโบรีเซ็ต',
        },
        {
          number: '3',
          heading: '🐾 แมวแกล้งปิดปุ่ม!',
          body: 'แมวจะแอบยื่นอุ้งเท้ามาปิดปุ่มที่เปิดไว้\n→ ต้องกดเปิดใหม่อีกครั้ง\n\nเปิดครบทุกปุ่มพร้อมกัน = ชนะ!',
          hint: 'ทุกปุ่มต้องเปิดอยู่พร้อมกันถึงจะผ่าน',
        },
      ],
      skipButton: 'ข้าม',
      nextButton: 'ถัดไป ▸',
      startButton: 'เริ่มเลย! 🎮',
    },

    pause: {
      title: 'พักผ่อนสักครู่',
      subtitle: 'จิบกาแฟ พักชมแมวกันก่อนนะ',
      resumeButton: 'เล่นต่อ',
      howToPlayButton: 'วิธีเล่น',
      settingsButton: 'ตั้งค่า',
      settingsTitle: 'ตั้งค่า',
      difficultyLabel: 'ระดับความยาก',
      difficultyNormal: 'ปกติ',
      difficultyEasy: 'ง่าย',
      difficultyHard: 'ยาก',
      difficultyAction: 'กดเพื่อเปลี่ยนระดับแมว',
      backButton: 'ย้อนกลับ',
    },

    stageClear: {
      title: 'เปิดครบแล้ว!',
      subtitle: 'เก่งมาก! เจ้าเหมียวทำอะไรคุณไม่ได้เลย',
      scoreTitle: 'คะแนนรวม',
      clearBonus: 'โบนัสเปิดครบ +1,000',
      comboMax: (max) => `คอมโบสูงสุด x${max}`,
      playAgainButton: 'เล่นอีกครั้ง',
      homeButton: 'หน้าแรก',
    },

    gameOver: {
      title: '😿 โดนจับได้ซะแล้ว!',
      subtitle: 'หัวใจหมดแล้ว เจ้าเหมียวชนะรอบนี้',
      finalScore: 'คะแนนที่ได้',
      retryButton: '🔄 ลองใหม่อีกครั้ง',
      homeButton: '🏠 หน้าแรก',
      cheerUp: '💪 อย่าเพิ่งยอมแพ้!\nคราวนี้ปล่อยมือก่อนแมวจ้องนะ!',
    },
  },
});
