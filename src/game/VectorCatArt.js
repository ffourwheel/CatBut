// Code-drawn Cat Rig artwork.
//
// These shapes intentionally use the same 1254px art-space as the raster
// layers that preceded them. Keeping that contract means the animation
// controller can switch between vector preview art and production assets
// without changing its motion math.

const COLORS = Object.freeze({
  outline: 0x4a302a,
  fur: 0xa58f86,
  furLight: 0xc1aea1,
  furDark: 0x77645f,
  cream: 0xfff1dc,
  creamShadow: 0xe7cdb4,
  pink: 0xf3a39d,
  eyeWhite: 0xfffbf2,
  iris: 0x83a64d,
  pupil: 0x30251f,
  highlight: 0xffffff,
});

const LINE_WIDTH = 22;
const SOFT_LINE_WIDTH = 16;

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
  const outer = [
    { x: direction * 500, y: -220 },
    { x: direction * 410, y: -610 },
    { x: direction * 145, y: -360 },
  ];
  const inner = [
    { x: direction * 455, y: -285 },
    { x: direction * 410, y: -515 },
    { x: direction * 235, y: -355 },
  ];
  triangle(graphics, outer, COLORS.furDark);
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

  graphics.fillStyle(COLORS.furLight, 0.7);
  graphics.fillEllipse(-310, 80, 300, 570);
  graphics.fillEllipse(310, 80, 300, 570);

  graphics.fillStyle(COLORS.cream, 1);
  graphics.fillEllipse(0, 220, 600, 360);
  graphics.fillEllipse(0, 350, 470, 200);

  // Broad tabby marks stay as simple graphic strokes so they remain legible
  // after the rig is scaled down to the mobile gameplay size.
  line(graphics, [{ x: -230, y: -280 }, { x: -155, y: -95 }], COLORS.furDark, 34);
  line(graphics, [{ x: -70, y: -330 }, { x: -38, y: -115 }], COLORS.furDark, 34);
  line(graphics, [{ x: 70, y: -330 }, { x: 38, y: -115 }], COLORS.furDark, 34);
  line(graphics, [{ x: 230, y: -280 }, { x: 155, y: -95 }], COLORS.furDark, 34);

  line(graphics, [{ x: -420, y: -25 }, { x: -285, y: 18 }], COLORS.furDark, 42);
  line(graphics, [{ x: -440, y: 110 }, { x: -300, y: 138 }], COLORS.furDark, 42);
  line(graphics, [{ x: 420, y: -25 }, { x: 285, y: 18 }], COLORS.furDark, 42);
  line(graphics, [{ x: 440, y: 110 }, { x: 300, y: 138 }], COLORS.furDark, 42);
}

function drawEyeWhites(graphics) {
  [-205, 205].forEach((x) => {
    graphics.fillStyle(COLORS.eyeWhite, 1);
    graphics.fillEllipse(x, 75, 220, 190);
    graphics.lineStyle(SOFT_LINE_WIDTH, COLORS.outline, 1);
    graphics.strokeEllipse(x, 75, 220, 190);
  });
}

function drawMuzzle(graphics) {
  graphics.fillStyle(COLORS.creamShadow, 0.5);
  graphics.fillEllipse(-140, 230, 280, 190);
  graphics.fillEllipse(140, 230, 280, 190);
  graphics.fillStyle(COLORS.cream, 1);
  graphics.fillEllipse(-140, 215, 290, 190);
  graphics.fillEllipse(140, 215, 290, 190);

  triangle(graphics, [
    { x: -54, y: 160 },
    { x: 54, y: 160 },
    { x: 0, y: 215 },
  ], COLORS.pink);
  graphics.lineStyle(SOFT_LINE_WIDTH, COLORS.outline, 1);
  graphics.strokeTriangle(0, 160, -54, 160, 54, 160);
  line(graphics, [{ x: 0, y: 210 }, { x: 0, y: 248 }], COLORS.outline, 13);
  line(graphics, [{ x: 0, y: 245 }, { x: -48, y: 270 }], COLORS.outline, 13);
  line(graphics, [{ x: 0, y: 245 }, { x: 48, y: 270 }], COLORS.outline, 13);
}

function drawWhiskers(graphics) {
  line(graphics, [{ x: -180, y: 215 }, { x: -470, y: 175 }], COLORS.cream, 13);
  line(graphics, [{ x: -180, y: 245 }, { x: -480, y: 245 }], COLORS.cream, 13);
  line(graphics, [{ x: -170, y: 275 }, { x: -450, y: 320 }], COLORS.cream, 13);
  line(graphics, [{ x: 180, y: 215 }, { x: 470, y: 175 }], COLORS.cream, 13);
  line(graphics, [{ x: 180, y: 245 }, { x: 480, y: 245 }], COLORS.cream, 13);
  line(graphics, [{ x: 170, y: 275 }, { x: 450, y: 320 }], COLORS.cream, 13);
}

export function drawCatBody(graphics) {
  graphics.fillStyle(COLORS.fur, 1);
  graphics.fillEllipse(0, 55, 1080, 980);
  graphics.lineStyle(LINE_WIDTH, COLORS.outline, 1);
  graphics.strokeEllipse(0, 55, 1080, 980);

  graphics.fillStyle(COLORS.cream, 1);
  graphics.fillEllipse(0, 155, 650, 780);
  graphics.fillStyle(COLORS.creamShadow, 0.35);
  graphics.fillEllipse(0, 440, 600, 270);

  line(graphics, [{ x: -430, y: -210 }, { x: -345, y: -90 }], COLORS.furDark, 38);
  line(graphics, [{ x: -455, y: -60 }, { x: -355, y: 35 }], COLORS.furDark, 38);
  line(graphics, [{ x: -460, y: 100 }, { x: -350, y: 170 }], COLORS.furDark, 38);
  line(graphics, [{ x: 430, y: -210 }, { x: 345, y: -90 }], COLORS.furDark, 38);
  line(graphics, [{ x: 455, y: -60 }, { x: 355, y: 35 }], COLORS.furDark, 38);
  line(graphics, [{ x: 460, y: 100 }, { x: 350, y: 170 }], COLORS.furDark, 38);

  // Small shoulder highlights make the vector body feel soft without adding
  // a texture dependency.
  graphics.fillStyle(COLORS.furLight, 0.5);
  graphics.fillEllipse(-355, -300, 150, 105);
  graphics.fillEllipse(355, -300, 150, 105);
}

export function drawCatHead(graphics) {
  drawHeadBase(graphics);
  drawEyeWhites(graphics);
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

  graphics.fillStyle(COLORS.furLight, 0.48);
  graphics.fillEllipse(0, 105, 760, 520);
  line(graphics, [{ x: -250, y: -270 }, { x: -175, y: 80 }], COLORS.furDark, 42);
  line(graphics, [{ x: -85, y: -330 }, { x: -45, y: 95 }], COLORS.furDark, 42);
  line(graphics, [{ x: 85, y: -330 }, { x: 45, y: 95 }], COLORS.furDark, 42);
  line(graphics, [{ x: 250, y: -270 }, { x: 175, y: 80 }], COLORS.furDark, 42);
}

export function drawCatSleepHead(graphics) {
  drawHeadBase(graphics);

  // Relaxed curved eyelids. The small outer flicks keep the expression clear
  // even when the sleeping head is mostly hidden by the table rim.
  line(graphics, [{ x: -305, y: 70 }, { x: -245, y: 105 }, { x: -175, y: 103 }, { x: -115, y: 68 }], COLORS.outline, 26);
  line(graphics, [{ x: 115, y: 68 }, { x: 175, y: 103 }, { x: 245, y: 105 }, { x: 305, y: 70 }], COLORS.outline, 26);
  line(graphics, [{ x: -335, y: 73 }, { x: -365, y: 45 }], COLORS.outline, 15);
  line(graphics, [{ x: 335, y: 73 }, { x: 365, y: 45 }], COLORS.outline, 15);

  drawMuzzle(graphics);
  drawWhiskers(graphics);
}

export function drawCatGaze(graphics) {
  [-205, 205].forEach((x) => {
    graphics.fillStyle(COLORS.iris, 1);
    graphics.fillCircle(x, 75, 68);
    graphics.lineStyle(SOFT_LINE_WIDTH, COLORS.outline, 1);
    graphics.strokeCircle(x, 75, 68);
    graphics.fillStyle(COLORS.pupil, 1);
    graphics.fillEllipse(x, 75, 54, 86);
    graphics.fillStyle(COLORS.highlight, 0.95);
    graphics.fillCircle(x - 20, 50, 15);
    graphics.fillCircle(x + 8, 92, 6);
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
  graphics.fillStyle(COLORS.furLight, 0.4);
  graphics.fillEllipse(direction * 45, -65, 190, 130);

  // Two soft tabby bands across the forearm keep the front/back reading of
  // the limb during rotation without breaking its silhouette.
  [0.3, 0.62].forEach((t) => {
    const bandX = elbowX + forearmX * t;
    const bandY = elbowY + forearmY * t;
    line(
      graphics,
      [
        { x: bandX - normal.x * 88, y: bandY - normal.y * 88 },
        { x: bandX + normal.x * 88, y: bandY + normal.y * 88 },
      ],
      COLORS.furDark,
      34,
      0.85,
    );
  });

  graphics.fillStyle(COLORS.cream, 1);
  graphics.fillCircle(pawX, pawY, 230);
  graphics.lineStyle(LINE_WIDTH, COLORS.outline, 1);
  graphics.strokeCircle(pawX, pawY, 230);

  // Toes are aligned with the arm direction instead of always pointing up,
  // so the paw keeps its anatomy when the target is above or to the side.
  [-1, 0, 1].forEach((index) => {
    const toeX = pawX + forward.x * 64 + normal.x * index * 62;
    const toeY = pawY + forward.y * 64 + normal.y * index * 62;
    graphics.fillStyle(COLORS.creamShadow, 0.8);
    graphics.fillCircle(toeX, toeY, 56);
  });

  graphics.fillStyle(COLORS.creamShadow, 0.6);
  graphics.fillEllipse(pawX - forward.x * 64, pawY - forward.y * 64, 150, 110);
}

export function createVectorCatPart(scene, draw, baseScale) {
  const graphics = scene.add.graphics();
  graphics.setScale(baseScale).setAlpha(0);
  draw(graphics);
  return graphics;
}
