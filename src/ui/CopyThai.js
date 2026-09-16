/**
 * CatKub Thai Copywriting Dictionary
 * Tone of Voice: Warm, Playful, Cozy Cat Café
 * Domain terminology aligned with CONTEXT.md and CATKUB_SUMMARY.md
 */

export const COPY_THAI = Object.freeze({
  app: {
    title: 'CatKub',
    subtitle: 'กดปุ่มให้ครบ ระวังแมว!',
    tagline: 'เกมแตะปุ่มไวแบบแอบ ๆ ในคาเฟ่แมวสุดอบอุ่น',
  },

  hud: {
    scoreLabel: 'คะแนน',
    comboLabel: 'คอมโบ',
    comboTimerLabel: 'เวลาคอมโบ',
    moodLabel: 'อารมณ์แมว',
    heartsLabel: 'หัวใจ',
    progressLabel: 'เปิดปุ่มให้ครบ',
    progressRatio: (completed, total) => `${completed}/${total}`,
    soundOn: 'เปิดเสียง',
    soundOff: 'ปิดเสียง',
    pause: 'พักเกม',
  },

  instructions: {
    promptTap: 'แตะปุ่มให้ติดไฟ แล้วรีบแตะปุ่มถัดไป!',
    promptSafe: 'ปลอดภัยแล้ว รีบกดต่อเร็ว!',
  },

  catFeedback: {
    warningTitle: 'ระวัง!',
    warningMessage: 'ระวัง! แมวกำลังจับตาดูนะ 🐱',
    watchTitle: 'จับตาดูอยู่!',
    watchMessage: 'แมวกำลังจ้อง! อย่าขยับนะ!',
    attackTitle: 'โดนตบแล้ว!',
    attackMessage: 'กดตอนแมวจ้อง! เสีย ♥ 1 ดวง',
    rapidTapMessage: 'กดรัวไป! แมวโมโหและมาแกล้งแล้ว!',
    sabotageTitle: 'แมวแกล้ง!',
    sabotageMessage: 'เมี๊ยว! แมวแอบยื่นอุ้งมือมาปิดปุ่ม!',
    hideMessage: 'แมวมุดกลับเข้าหลุมแล้ว!',
  },

  buttonFeedback: {
    activated: '+10 คะแนน!',
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
      title: 'วิธีเล่น CatKub 🐱',
      subtitle: 'แอบเปิดปุ่มให้ครบ อย่าให้เจ้าเหมียวจับได้!',
      cards: [
        {
          icon: '👆',
          title: '1. แตะครั้งเดียวเพื่อเปิดปุ่ม',
          desc: 'แตะปุ่มบนโต๊ะหนึ่งครั้งเพื่อเปิดไฟทันที แล้วแตะปุ่มถัดไปให้ครบ',
          tip: '💡 เปิดแล้วไม่ต้องแตะซ้ำ รีบสร้างคอมโบต่อได้เลย',
        },
        {
          icon: '👀',
          title: '2. แมวโผล่ ระวังจังหวะแตะ!',
          desc: 'เห็นหูแมวโผล่หรือเครื่องหมาย ❗ ให้ชะลอการแตะปุ่ม!',
          tip: '⚠️ แตะตอนแมวจ้องจะโดนตบ เสีย ♥ 1 ดวง + คอมโบรีเซ็ต',
        },
        {
          icon: '🐾',
          title: '3. ระวังอุ้งมือแมวป่วน!',
          desc: 'เจ้าเหมียวจะแอบยื่นอุ้งมือมาปิดปุ่ม ต้องคอยเปิดใหม่ให้ติดครบ',
          tip: '⭐ ทุกปุ่มต้องเปิดติดพร้อมกัน = ชนะทันที!',
        },
      ],
      goal: '🎯 เป้าหมาย: แอบเปิดปุ่มบนโต๊ะให้ครบ 100% เพื่อผ่านด่าน!',
      confirmButton: 'เข้าใจแล้ว เริ่มเลย! 🎮',
      returnButton: 'กลับไปเล่นต่อ 🐾',
      // backward compatibility
      steps: [
        {
          number: '1',
          heading: '👆 แตะครั้งเดียวเพื่อเปิดปุ่ม',
          body: 'แตะปุ่มบนโต๊ะหนึ่งครั้ง\nเปิดติดทันที!\n\nแล้วรีบแตะปุ่มถัดไปเพื่อทำคอมโบ',
          hint: 'แตะทีละ 1 ปุ่ม ให้ครบทุกปุ่ม',
        },
        {
          number: '2',
          heading: '👀 ระวังแมวจ้อง!',
          body: 'เห็นหูแมวโผล่ + เครื่องหมาย ❗\n→ ชะลอการแตะปุ่ม!\n\nแตะตอนแมวจ้อง = โดนตบ!',
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
      comboMax: (max) => `คอมโบสูงสุด x${max}`,
      playAgainButton: 'เล่นอีกครั้ง',
      homeButton: 'หน้าแรก',
    },

    gameOver: {
      title: 'โดนจับได้ซะแล้ว!',
      subtitle: 'หัวใจหมดแล้ว เจ้าเหมียวชนะรอบนี้',
      finalScore: 'คะแนนที่ได้',
      retryButton: 'ลองใหม่อีกครั้ง',
      homeButton: 'หน้าแรก',
      cheerUp: 'อย่าเพิ่งยอมแพ้!\nคราวนี้รอจังหวะแมวแล้วค่อยแตะนะ!',
    },
  },
});
