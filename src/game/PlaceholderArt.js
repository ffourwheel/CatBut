import Phaser from 'phaser';
import { ASSET_KEYS } from './AssetManifest.js';
import {
  ASSEMBLY_DEPTH,
  CANVAS_SIZE,
  CAT_STATES,
  SABOTAGE_PAW_ORIGIN,
  TABLE_ANCHOR,
} from './constants.js';

const COLORS = {
  table: 0xf3dcc1,
  tableDark: 0xc08b60,
  tableEdge: 0x8a5e43,
  hole: 0x3b2930,
  cat: 0xf1a35b,
  catDark: 0xc66f48,
  eye: 0x2e2530,
  cream: 0xfff4dc,
  warning: 0xf7c948,
  danger: 0xe66b5d,
  success: 0x67b887,
};

const ROUND_TABLE_RADIUS_X = 480;
const ROUND_TABLE_RADIUS_Y = 430;
const CAT_HOLE_SCALE = 1;
const CAT_HOLE_OFFSET_Y = 0;

function createTexture(scene, key, draw) {
  if (scene.textures.exists(key)) return;

  const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
  draw(graphics);
  graphics.generateTexture(key, CANVAS_SIZE, CANVAS_SIZE);
  graphics.destroy();
}

function drawHole(graphics) {
  graphics.fillStyle(COLORS.hole, 1);
  graphics.fillCircle(TABLE_ANCHOR.x, TABLE_ANCHOR.y, 190);
  graphics.lineStyle(18, COLORS.tableDark, 1);
  graphics.strokeCircle(TABLE_ANCHOR.x, TABLE_ANCHOR.y, 190);
  graphics.lineStyle(8, COLORS.tableEdge, 0.7);
  graphics.strokeCircle(TABLE_ANCHOR.x, TABLE_ANCHOR.y, 160);
}

function drawCatHead(graphics, y = 480) {
  graphics.fillStyle(COLORS.cat, 1);
  graphics.fillCircle(TABLE_ANCHOR.x, y, 136);
  graphics.fillTriangle(395, y - 80, 430, y - 215, 500, y - 120);
  graphics.fillTriangle(524, y - 120, 594, y - 215, 629, y - 80);
  graphics.fillStyle(COLORS.catDark, 1);
  graphics.fillTriangle(418, y - 105, 436, y - 175, 477, y - 120);
  graphics.fillTriangle(547, y - 120, 588, y - 175, 606, y - 105);
  graphics.fillStyle(COLORS.eye, 1);
  graphics.fillEllipse(465, y - 10, 20, 34);
  graphics.fillEllipse(559, y - 10, 20, 34);
  graphics.fillStyle(COLORS.cream, 1);
  graphics.fillCircle(469, y - 18, 5);
  graphics.fillCircle(563, y - 18, 5);
  graphics.lineStyle(8, COLORS.eye, 1);
  graphics.strokeCircle(TABLE_ANCHOR.x, y + 45, 18);
}

function drawPaw(graphics, x, y, color = COLORS.cat) {
  graphics.fillStyle(color, 1);
  graphics.fillCircle(x, y, 58);
  graphics.fillCircle(x - 42, y - 45, 23);
  graphics.fillCircle(x - 8, y - 62, 24);
  graphics.fillCircle(x + 28, y - 50, 23);
  graphics.lineStyle(8, COLORS.catDark, 1);
  graphics.strokeCircle(x, y, 58);
}

function createTableTextures(scene) {
  createTexture(scene, ASSET_KEYS.roundTableBack, (graphics) => {
    graphics.fillStyle(COLORS.table, 1);
    graphics.fillEllipse(
      TABLE_ANCHOR.x,
      TABLE_ANCHOR.y,
      ROUND_TABLE_RADIUS_X * 2,
      ROUND_TABLE_RADIUS_Y * 2,
    );
    graphics.lineStyle(18, COLORS.tableEdge, 1);
    graphics.strokeEllipse(
      TABLE_ANCHOR.x,
      TABLE_ANCHOR.y,
      ROUND_TABLE_RADIUS_X * 2,
      ROUND_TABLE_RADIUS_Y * 2,
    );
    graphics.lineStyle(5, 0xfff1d7, 0.55);
    graphics.strokeEllipse(
      TABLE_ANCHOR.x,
      TABLE_ANCHOR.y,
      (ROUND_TABLE_RADIUS_X - 22) * 2,
      (ROUND_TABLE_RADIUS_Y - 22) * 2,
    );
    drawHole(graphics);
  });

  // Keep the contract's front layer object for depth and future polish,
  // but leave it visually empty while the table is intentionally flat.
  createTexture(scene, ASSET_KEYS.roundTableFront, () => {});
}

function createCatTextures(scene) {
  createTexture(scene, ASSET_KEYS.cat[CAT_STATES.HIDDEN], (graphics) => {
    drawHole(graphics);
    graphics.fillStyle(COLORS.cream, 0.45);
    graphics.fillCircle(445, 420, 18);
    graphics.fillCircle(575, 420, 18);
  });

  createTexture(scene, ASSET_KEYS.cat[CAT_STATES.WARNING], (graphics) => {
    drawHole(graphics);
    graphics.fillStyle(COLORS.cream, 0.45);
    graphics.fillCircle(445, 420, 18);
    graphics.fillCircle(575, 420, 18);
  });

  createTexture(scene, ASSET_KEYS.cat[CAT_STATES.PEEK], (graphics) => {
    drawHole(graphics);
    drawCatHead(graphics, 462);
  });

  createTexture(scene, ASSET_KEYS.cat[CAT_STATES.WATCH], (graphics) => {
    drawHole(graphics);
    drawCatHead(graphics, 440);
    graphics.lineStyle(8, COLORS.warning, 1);
    graphics.strokeCircle(465, 430, 34);
    graphics.strokeCircle(559, 430, 34);
  });

  createTexture(scene, ASSET_KEYS.cat[CAT_STATES.ATTACK], (graphics) => {
    drawHole(graphics);
    drawCatHead(graphics, 465);
    drawPaw(graphics, 735, 525, COLORS.danger);
    graphics.lineStyle(10, COLORS.danger, 1);
    graphics.strokeLineShape(new Phaser.Geom.Line(670, 470, 790, 600));
  });

  createTexture(scene, ASSET_KEYS.cat[CAT_STATES.SABOTAGE], (graphics) => {
    drawHole(graphics);
    drawCatHead(graphics, 465);
    drawPaw(graphics, 680, 610, COLORS.warning);
    graphics.fillStyle(COLORS.warning, 1);
    graphics.fillCircle(805, 570, 16);
    graphics.fillCircle(845, 610, 11);
    graphics.fillCircle(800, 650, 9);
  });

  createTexture(scene, ASSET_KEYS.cat[CAT_STATES.HIDE], (graphics) => {
    drawHole(graphics);
    graphics.fillStyle(COLORS.catDark, 0.4);
    graphics.fillEllipse(512, 475, 160, 70);
  });
}

function createSabotagePawTexture(scene) {
  createTexture(scene, ASSET_KEYS.sabotagePaw, (graphics) => {
    graphics.lineStyle(86, COLORS.cat, 1);
    graphics.beginPath();
    graphics.moveTo(405, 430);
    graphics.lineTo(820, 820);
    graphics.strokePath();
    drawPaw(graphics, 820, 820, COLORS.cream);
  });
}

export function ensurePlaceholderTextures(scene) {
  createTableTextures(scene);
  createCatTextures(scene);
  createSabotagePawTexture(scene);
}

export function createCatTableAssembly(scene, { useRealAssets = false, anchor = TABLE_ANCHOR } = {}) {
  // The table is intentionally a generated circular placeholder for now.
  // Cat state textures and the sabotage paw still use the selected asset set.
  createTableTextures(scene);
  if (!useRealAssets) ensurePlaceholderTextures(scene);

  const container = scene.add.container(anchor.x, anchor.y).setDepth(1);
  container.setName('catTableContainer');

  const tableBack = scene.add.image(0, 0, ASSET_KEYS.roundTableBack)
    .setOrigin(0.5, 0.5)
    .setScale(1);
  tableBack.setName('tableBack').setDepth(ASSEMBLY_DEPTH.BACK);
  const tableFront = scene.add.image(0, 0, ASSET_KEYS.roundTableFront)
    .setOrigin(0.5, 0.5)
    .setScale(1);
  tableFront.setName('tableFront').setDepth(ASSEMBLY_DEPTH.FRONT);
  const catState = scene.add.image(0, 0, ASSET_KEYS.cat[CAT_STATES.HIDDEN])
    .setOrigin(0.5, 0.5)
    .setScale(CAT_HOLE_SCALE)
    .setPosition(0, CAT_HOLE_OFFSET_Y);
  catState.baseScale = CAT_HOLE_SCALE;
  catState.baseY = CAT_HOLE_OFFSET_Y;
  catState.setName('catState').setDepth(ASSEMBLY_DEPTH.MIDDLE);
  const sabotagePaw = scene.add.image(0, CAT_HOLE_OFFSET_Y, ASSET_KEYS.sabotagePaw)
    .setOrigin(SABOTAGE_PAW_ORIGIN.x, SABOTAGE_PAW_ORIGIN.y)
    .setScale(0.44)
    .setVisible(false);
  sabotagePaw.setName('sabotagePaw').setDepth(ASSEMBLY_DEPTH.MIDDLE + 5);

  container.add([tableBack, catState, sabotagePaw, tableFront]);
  container.sort('depth');

  return {
    container,
    tableBack,
    catState,
    sabotagePaw,
    tableFront,
    setCatState(state) {
      const textureState = state === CAT_STATES.SABOTAGE ? CAT_STATES.PEEK : state;
      const textureKey = state === CAT_STATES.WARNING
        ? ASSET_KEYS.cat[CAT_STATES.HIDDEN]
        : ASSET_KEYS.cat[textureState];
      catState.setTexture(textureKey);
    },
  };
}
