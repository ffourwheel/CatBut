const frame = (time, offset = {}, ease = 'linear') => Object.freeze({
  time,
  offset: Object.freeze({ ...offset }),
  ease,
});

const track = (...frames) => Object.freeze(frames);

export const CAT_MOTION_CONFIG = Object.freeze({
  transitionDuration: 120,
});

export const CAT_MOTION_CLIPS = Object.freeze({
  idle: Object.freeze({
    duration: 1800,
    loop: true,
    tracks: Object.freeze({
      body: track(
        frame(0),
        frame(900, { y: -3, scaleY: 0.025 }, 'easeInOut'),
        frame(1800),
      ),
      head: track(
        frame(0),
        frame(900, { y: -2 }, 'easeInOut'),
        frame(1800),
      ),
      leftEar: track(
        frame(0),
        frame(900, { rotation: -0.04 }, 'easeInOut'),
        frame(1800),
      ),
      rightEar: track(
        frame(0),
        frame(900, { rotation: 0.04 }, 'easeInOut'),
        frame(1800),
      ),
      eyes: track(
        frame(0),
        frame(740),
        frame(770, { scaleY: -0.92 }, 'easeIn'),
        frame(815, { scaleY: -0.92 }, 'linear'),
        frame(850),
        frame(1800),
      ),
    }),
  }),

  peek: Object.freeze({
    duration: 720,
    loop: false,
    tracks: Object.freeze({
      catRoot: track(
        frame(0, { y: 24 }),
        frame(160, { y: 10 }, 'easeOut'),
        frame(380, { y: -8 }, 'easeOut'),
        frame(720),
      ),
      body: track(
        frame(0, { y: 8 }),
        frame(380, { y: -5 }, 'easeOut'),
        frame(720),
      ),
      head: track(
        frame(0, { y: 7, rotation: -0.04 }),
        frame(380, { y: -4, rotation: 0.02 }, 'easeOut'),
        frame(720),
      ),
      leftEar: track(frame(0, { rotation: -0.1 }), frame(720)),
      rightEar: track(frame(0, { rotation: 0.1 }), frame(720)),
    }),
  }),

  watch: Object.freeze({
    duration: 1400,
    loop: true,
    tracks: Object.freeze({
      head: track(
        frame(0),
        frame(350, { x: -3, rotation: -0.025 }, 'easeInOut'),
        frame(700, { x: 3, rotation: 0.025 }, 'easeInOut'),
        frame(1050, { x: -2, rotation: -0.015 }, 'easeInOut'),
        frame(1400),
      ),
      leftEar: track(
        frame(0),
        frame(700, { rotation: -0.04 }, 'easeInOut'),
        frame(1400),
      ),
      rightEar: track(
        frame(0),
        frame(700, { rotation: 0.04 }, 'easeInOut'),
        frame(1400),
      ),
      eyes: track(
        frame(0),
        frame(350, { x: -4 }, 'easeInOut'),
        frame(700, { x: 4 }, 'easeInOut'),
        frame(1050, { x: -2 }, 'easeInOut'),
        frame(1400),
      ),
    }),
  }),

  hide: Object.freeze({
    duration: 520,
    loop: false,
    tracks: Object.freeze({
      catRoot: track(
        frame(0),
        frame(110, { y: 10 }, 'easeIn'),
        frame(380, { y: 34 }, 'easeIn'),
        frame(520, { y: 42 }, 'easeOut'),
      ),
      body: track(
        frame(0),
        frame(380, { y: 12, scaleY: 0.92 }, 'easeIn'),
        frame(520, { y: 18, scaleY: 0.86 }, 'easeOut'),
      ),
      head: track(
        frame(0),
        frame(380, { y: 18 }, 'easeIn'),
        frame(520, { y: 25 }, 'easeOut'),
      ),
    }),
  }),

  attack: Object.freeze({
    duration: 620,
    loop: false,
    tracks: Object.freeze({
      catRoot: track(
        frame(0),
        frame(120, { y: 14 }, 'easeOut'),
        frame(260, { y: -28 }, 'easeIn'),
        frame(430, { y: -12 }, 'easeOut'),
        frame(620),
      ),
      body: track(
        frame(0),
        frame(120, { scaleY: 0.94 }, 'easeOut'),
        frame(260, { scaleY: 1.08 }, 'easeIn'),
        frame(620),
      ),
      head: track(
        frame(0),
        frame(120, { rotation: -0.08 }, 'easeOut'),
        frame(260, { rotation: 0.12 }, 'easeIn'),
        frame(430, { rotation: 0.04 }, 'easeOut'),
        frame(620),
      ),
      leftUpperArm: track(
        frame(0),
        frame(120, { rotation: 0.12 }, 'easeOut'),
        frame(260, { rotation: -0.2 }, 'easeIn'),
        frame(620),
      ),
      rightUpperArm: track(
        frame(0),
        frame(120, { rotation: -0.12 }, 'easeOut'),
        frame(260, { rotation: 0.2 }, 'easeIn'),
        frame(620),
      ),
      leftPaw: track(
        frame(0),
        frame(260, { scaleX: 1.12, scaleY: 0.88 }, 'easeIn'),
        frame(430, { scaleX: 0.96, scaleY: 1.04 }, 'easeOut'),
        frame(620),
      ),
      rightPaw: track(
        frame(0),
        frame(260, { scaleX: 1.12, scaleY: 0.88 }, 'easeIn'),
        frame(430, { scaleX: 0.96, scaleY: 1.04 }, 'easeOut'),
        frame(620),
      ),
    }),
  }),
});

export const CAT_MOTION_CLIP_NAMES = Object.freeze(Object.keys(CAT_MOTION_CLIPS));
