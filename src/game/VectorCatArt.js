// Code-drawn Cat Rig artwork.
//
// These shapes intentionally use the same 1254px art-space as the raster
// layers that preceded them. Keeping that contract means the animation
// controller can switch between vector preview art and production assets
// without changing its motion math.
//
// Design language: a bright cream marmalade kitten. Warm cocoa outlines,
// soft peach patches, sparkle eyes and blush cheeks keep the cat friendly
// at the mobile gameplay size.

const COLORS = Object.freeze({
  outline: 0x8f5a45,
  outlineSoft: 0xb98a6f,
  fur: 0xfff3e2,
  furLight: 0xfffaf0,
  cream: 0xfffcf5,
  creamShadow: 0xf3ddc4,
  pink: 0xffc0cd,
  pinkDeep: 0xff8fa5,
  blush: 0xffb9c6,
  eyeWhite: 0xfffdf8,
  iris: 0xd99868,
  irisDeep: 0xc8795d,
  pupil: 0x533a33,
  highlight: 0xffffff,
  whisker: 0xd08a5f,
});

const LINE_WIDTH = 18;
const SOFT_LINE_WIDTH = 12;

// Exported as an art-tuning seam so the expression can be regression tested
// without coupling tests to Phaser drawing commands.
export const CAT_GAZE_STYLE = Object.freeze({
  eyeWhiteWidth: 176,
  eyeWhiteHeight: 96,
  irisWidth: 56,
  irisHeight: 46,
  pupilWidth: 24,
  pupilHeight: 30,
  primaryHighlightRadius: 5,
  secondaryHighlightRadius: 3,
});

function triangle(graphics, points, fill, alpha = 1) {
  graphics.fillStyle(fill, alpha);
  graphics.beginPath();
  graphics.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => graphics.lineTo(point.x, point.y));
  graphics.closePath();
  graphics.fillPath();
}

function line(graphics, points, color = COLORS.outline, width = SOFT_LINE_WIDTH, alpha = 1) {
  graphics.lineStyle(width, color, alpha);
  graphics.beginPath();
  graphics.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => graphics.lineTo(point.x, point.y));
  graphics.strokePath();
}

function drawEar(graphics, side) {
  const direction = side === 'left' ? -1 : 1;
  // The ear base is rooted well inside the head silhouette; the head fill
  // drawn afterwards hides it, so the ears grow out of the skull instead of
  // floating beside it.
  const outer = [
    { x: direction * 500, y: -200 },
    { x: direction * 412, y: -600 },
    { x: direction * 150, y: -260 },
  ];
  const inner = [
    { x: direction * 448, y: -262 },
    { x: direction * 412, y: -505 },
    { x: direction * 240, y: -305 },
  ];
  triangle(graphics, outer, COLORS.fur);
  triangle(graphics, inner, COLORS.pink);
  line(graphics, [outer[0], outer[1], outer[2]], COLORS.outline, LINE_WIDTH);
}

function drawHeadBase(graphics) {
  drawEar(graphics, 'left');
  drawEar(graphics, 'right');

  graphics.fillStyle(COLORS.fur, 1);
  graphics.fillEllipse(0, 35, 1040, 790);
  graphics.lineStyle(LINE_WIDTH, COLORS.outline, 1);
  graphics.strokeEllipse(0, 35, 1040, 790);

  // A single soft sheen keeps the plain cream crown from reading flat.
  graphics.fillStyle(COLORS.furLight, 0.55);
  graphics.fillEllipse(0, -170, 620, 260);

  graphics.fillStyle(COLORS.cream, 1);
  graphics.fillEllipse(0, 220, 600, 360);
  graphics.fillEllipse(0, 350, 470, 200);

  // Rosy cheeks carry most of the cute read, so they sit below the eyes on
  // clear fur instead of over the muzzle.
  graphics.fillStyle(COLORS.blush, 0.5);
  graphics.fillEllipse(-325, 185, 150, 95);
  graphics.fillEllipse(325, 185, 150, 95);
}

function drawMuzzle(graphics) {
  graphics.fillStyle(COLORS.creamShadow, 0.4);
  graphics.fillEllipse(-140, 230, 280, 190);
  graphics.fillEllipse(140, 230, 280, 190);
  graphics.fillStyle(COLORS.cream, 1);
  graphics.fillEllipse(-140, 215, 290, 190);
  graphics.fillEllipse(140, 215, 290, 190);

  triangle(graphics, [
    { x: -46, y: 163 },
    { x: 46, y: 163 },
    { x: 0, y: 210 },
  ], COLORS.pinkDeep);
  line(graphics, [{ x: 0, y: 208 }, { x: 0, y: 244 }], COLORS.outline, 11);
  // Omega mouth with gently upturned corners, so even the neutral face
  // reads as a small smile.
  line(graphics, [{ x: 0, y: 242 }, { x: -46, y: 268 }, { x: -62, y: 258 }], COLORS.outline, 14);
  line(graphics, [{ x: 0, y: 242 }, { x: 46, y: 268 }, { x: 62, y: 258 }], COLORS.outline, 14);
}

function drawWhiskers(graphics) {
  line(graphics, [{ x: -185, y: 210 }, { x: -450, y: 172 }], COLORS.whisker, 12, 0.8);
  line(graphics, [{ x: -178, y: 255 }, { x: -460, y: 270 }], COLORS.whisker, 12, 0.8);
  line(graphics, [{ x: 185, y: 210 }, { x: 450, y: 172 }], COLORS.whisker, 12, 0.8);
  line(graphics, [{ x: 178, y: 255 }, { x: 460, y: 270 }], COLORS.whisker, 12, 0.8);
}

export function drawCatBody(graphics) {
  graphics.fillStyle(COLORS.fur, 1);
  graphics.fillEllipse(0, 55, 1080, 980);
  graphics.lineStyle(LINE_WIDTH, COLORS.outline, 1);
  graphics.strokeEllipse(0, 55, 1080, 980);

  // A soft sheen across the upper back keeps the plain cream body from
  // reading flat without introducing a pattern patch.
  graphics.fillStyle(COLORS.furLight, 0.45);
  graphics.fillEllipse(0, -160, 680, 470);

  graphics.fillStyle(COLORS.cream, 1);
  graphics.fillEllipse(0, 155, 650, 780);
  graphics.fillStyle(COLORS.creamShadow, 0.3);
  graphics.fillEllipse(0, 440, 600, 270);

  // Small shoulder highlights make the vector body feel soft without adding
  // a texture dependency.
  graphics.fillStyle(COLORS.furLight, 0.6);
  graphics.fillEllipse(-355, -300, 150, 105);
  graphics.fillEllipse(355, -300, 150, 105);
}

export function drawCatHead(graphics) {
  drawHeadBase(graphics);
  drawMuzzle(graphics);
  drawWhiskers(graphics);
}

export function drawCatBackHead(graphics) {
  drawEar(graphics, 'left');
  drawEar(graphics, 'right');

  // A face-free crown makes rear targets read as an actual turn away from
  // the player instead of an upside-down front-facing head.
  graphics.fillStyle(COLORS.fur, 1);
  graphics.fillEllipse(0, 35, 1040, 790);
  graphics.lineStyle(LINE_WIDTH, COLORS.outline, 1);
  graphics.strokeEllipse(0, 35, 1040, 790);

  graphics.fillStyle(COLORS.furLight, 0.45);
  graphics.fillEllipse(0, 105, 760, 520);
}

export function drawCatSleepHead(graphics) {
  drawHeadBase(graphics);

  // Happy closed eyes: the arcs bulge downward like a small smile, and the
  // outer flicks stay visible even when the sleeping head is mostly hidden
  // by the table rim.
  [-1, 1].forEach((direction) => {
    line(graphics, [
      { x: direction * 300, y: 77 },
      { x: direction * 235, y: 120 },
      { x: direction * 165, y: 120 },
      { x: direction * 105, y: 77 },
    ], COLORS.outline, 24);
    line(graphics, [{ x: direction * 300, y: 77 }, { x: direction * 330, y: 53 }], COLORS.outline, 14);
  });

  drawMuzzle(graphics);
  drawWhiskers(graphics);
}

export function drawCatGaze(graphics) {
  [-205, 205].forEach((x) => {
    // A shallow eye and low upper lid give the awake cat a cheeky squint
    // without switching to the genuinely closed sleep face.
    graphics.fillStyle(COLORS.eyeWhite, 1);
    graphics.fillEllipse(
      x,
      100,
      CAT_GAZE_STYLE.eyeWhiteWidth,
      CAT_GAZE_STYLE.eyeWhiteHeight,
    );
    graphics.lineStyle(SOFT_LINE_WIDTH, COLORS.outlineSoft, 1);
    graphics.strokeEllipse(
      x,
      100,
      CAT_GAZE_STYLE.eyeWhiteWidth,
      CAT_GAZE_STYLE.eyeWhiteHeight,
    );
    line(graphics, [
      { x: x - 76, y: 82 },
      { x, y: 72 },
      { x: x + 76, y: 82 },
    ], COLORS.outline, 16);

    graphics.fillStyle(COLORS.iris, 1);
    graphics.fillEllipse(x, 106, CAT_GAZE_STYLE.irisWidth, CAT_GAZE_STYLE.irisHeight);
    graphics.lineStyle(SOFT_LINE_WIDTH, COLORS.outlineSoft, 1);
    graphics.strokeEllipse(x, 106, CAT_GAZE_STYLE.irisWidth, CAT_GAZE_STYLE.irisHeight);
    graphics.fillStyle(COLORS.pupil, 1);
    graphics.fillEllipse(x, 108, CAT_GAZE_STYLE.pupilWidth, CAT_GAZE_STYLE.pupilHeight);
    graphics.fillStyle(COLORS.irisDeep, 0.5);
    graphics.fillEllipse(x, 120, 42, 14);
    graphics.fillStyle(COLORS.highlight, 0.95);
    graphics.fillCircle(x - 9, 98, CAT_GAZE_STYLE.primaryHighlightRadius);
    graphics.fillCircle(x + 7, 116, CAT_GAZE_STYLE.secondaryHighlightRadius);
  });
}

export function drawCatArm(graphics, side) {
  const direction = side === 'left' ? -1 : 1;
  // The elbow sits off the shoulder-paw line so the limb keeps a gentle bend
  // instead of reading as a straight stick when it rotates.
  const elbowX = direction * 255;
  const elbowY = 430;
  const pawX = direction * 620;
  const pawY = 700;
  const forearmX = pawX - elbowX;
  const forearmY = pawY - elbowY;
  const forearmLength = Math.hypot(forearmX, forearmY);
  const forward = { x: forearmX / forearmLength, y: forearmY / forearmLength };
  const normal = { x: -forward.y, y: forward.x };

  // Both outline passes go down before either fur pass, so the elbow seam
  // keeps one continuous dark border instead of one stage cutting across the
  // other. The forearm outline matches the upper-arm fur width, so its round
  // cap hides inside the elbow and the limb tapers smoothly to the paw.
  graphics.lineStyle(352, COLORS.outline, 1);
  graphics.beginPath();
  graphics.moveTo(0, 0);
  graphics.lineTo(elbowX, elbowY);
  graphics.strokePath();
  graphics.beginPath();
  graphics.moveTo(elbowX, elbowY);
  graphics.lineTo(pawX, pawY);
  graphics.strokePath();

  graphics.lineStyle(300, COLORS.fur, 1);
  graphics.beginPath();
  graphics.moveTo(0, 0);
  graphics.lineTo(elbowX, elbowY);
  graphics.strokePath();
  graphics.lineStyle(244, COLORS.fur, 1);
  graphics.beginPath();
  graphics.moveTo(elbowX, elbowY);
  graphics.lineTo(pawX, pawY);
  graphics.strokePath();

  // The shoulder is a plain fur pad drawn over the limb root. With no hard
  // outline of its own it melts into the torso, so the arm reads as growing
  // out of the chest instead of being bolted on next to it.
  graphics.fillStyle(COLORS.fur, 1);
  graphics.fillCircle(0, 0, 190);
  graphics.fillStyle(COLORS.furLight, 0.5);
  graphics.fillEllipse(direction * 45, -65, 190, 130);

  // Two tone-on-tone shading bands across the forearm keep the front/back
  // reading of the limb during rotation without breaking its silhouette.
  [0.3, 0.62].forEach((t) => {
    const bandX = elbowX + forearmX * t;
    const bandY = elbowY + forearmY * t;
    line(
      graphics,
      [
        { x: bandX - normal.x * 88, y: bandY - normal.y * 88 },
        { x: bandX + normal.x * 88, y: bandY + normal.y * 88 },
      ],
      COLORS.creamShadow,
      30,
      0.6,
    );
  });

  graphics.fillStyle(COLORS.cream, 1);
  graphics.fillCircle(pawX, pawY, 230);
  graphics.lineStyle(LINE_WIDTH, COLORS.outline, 1);
  graphics.strokeCircle(pawX, pawY, 230);

  // Toes are aligned with the arm direction instead of always pointing up,
  // so the paw keeps its anatomy when the target is above or to the side.
  // Jelly-pink pads replace the old grey toe shading for a friendlier paw.
  [-1, 0, 1].forEach((index) => {
    const toeX = pawX + forward.x * 64 + normal.x * index * 62;
    const toeY = pawY + forward.y * 64 + normal.y * index * 62;
    graphics.fillStyle(COLORS.pink, 0.95);
    graphics.fillCircle(toeX, toeY, 56);
  });

  graphics.fillStyle(COLORS.pink, 0.8);
  graphics.fillEllipse(pawX - forward.x * 64, pawY - forward.y * 64, 150, 110);
}

export function createVectorCatPart(scene, draw, baseScale) {
  const graphics = scene.add.graphics();
  graphics.setScale(baseScale).setAlpha(0);
  draw(graphics);
  return graphics;
}
