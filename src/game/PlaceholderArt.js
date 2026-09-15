import Phaser from 'phaser';
import { ASSET_KEYS } from './AssetManifest.js';
import { createCatRigRuntime } from './CatRigRuntime.js';
import {
  ASSEMBLY_DEPTH,
  CANVAS_SIZE,
  CAT_STATES,
  HOLE_CAT_OFFSET_Y,
  HOLE_CAT_SCALE,
  SABOTAGE_PAW_ORIGIN,
  TABLE_ANCHOR,
  TABLE_ASSEMBLY_ANCHOR,
  TABLE_BACK_OFFSET_Y,
  TABLE_FRONT_OFFSET_Y,
  TABLE_HOLE_OFFSET_Y,
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

// The source assets are authored around the hole center. Keeping every table
// layer on the same anchor makes the in-game assembly match the reference
// preview and leaves one stable coordinate system for the future Cat Rig.
const TABLE_SCALE = 1;
const ROUND_TABLE_SCALE = 0.8;
// Round-mode cat cutouts were generated with a larger subject than the 1024px
// source. Keep the subject inside the new ring while leaving the paws free to
// overlap the near rim naturally.
const ROUND_CAT_SCALE = 0.58;
const ROUND_TABLE_FRONT_CROP_Y = 760;
const CAT_HOLE_OFFSET_Y = HOLE_CAT_OFFSET_Y;
const PLACEHOLDER_ART_OFFSET_Y = TABLE_HOLE_OFFSET_Y;

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
  y += PLACEHOLDER_ART_OFFSET_Y;
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
  createTexture(scene, ASSET_KEYS.tableBack, (graphics) => {
    graphics.fillStyle(COLORS.table, 1);
    graphics.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    graphics.fillStyle(0xe9c49e, 1);
    graphics.fillRoundedRect(58, 58, 908, 908, 46);
    graphics.lineStyle(18, COLORS.tableEdge, 1);
    graphics.strokeRoundedRect(58, 58, 908, 908, 46);
    graphics.lineStyle(5, 0xfff1d7, 0.55);
    graphics.strokeRoundedRect(90, 90, 844, 844, 34);
    drawHole(graphics);
  });

  createTexture(scene, ASSET_KEYS.tableFront, (graphics) => {
    graphics.fillStyle(0xa96f4f, 1);
    graphics.fillRoundedRect(75, 790, 874, 190, 34);
    graphics.lineStyle(14, COLORS.tableEdge, 1);
    graphics.strokeRoundedRect(75, 790, 874, 190, 34);
    graphics.fillStyle(0xd99c6e, 0.85);
    graphics.fillRoundedRect(108, 830, 808, 94, 22);
    graphics.fillStyle(0x8f5945, 0.8);
    graphics.fillRoundedRect(438, 858, 148, 34, 17);
  });
}

function createCatTextures(scene) {
  createTexture(scene, ASSET_KEYS.cat[CAT_STATES.HIDDEN], (graphics) => {
    drawHole(graphics);
    graphics.fillStyle(COLORS.cream, 0.45);
    graphics.fillCircle(445, 420 + PLACEHOLDER_ART_OFFSET_Y, 18);
    graphics.fillCircle(575, 420 + PLACEHOLDER_ART_OFFSET_Y, 18);
  });

  createTexture(scene, ASSET_KEYS.cat[CAT_STATES.WARNING], (graphics) => {
    drawHole(graphics);
    graphics.fillStyle(COLORS.cream, 0.45);
    graphics.fillCircle(445, 420 + PLACEHOLDER_ART_OFFSET_Y, 18);
    graphics.fillCircle(575, 420 + PLACEHOLDER_ART_OFFSET_Y, 18);
  });

  createTexture(scene, ASSET_KEYS.cat[CAT_STATES.PEEK], (graphics) => {
    drawHole(graphics);
    drawCatHead(graphics, 462);
  });

  createTexture(scene, ASSET_KEYS.cat[CAT_STATES.WATCH], (graphics) => {
    drawHole(graphics);
    drawCatHead(graphics, 440);
    graphics.lineStyle(8, COLORS.warning, 1);
    graphics.strokeCircle(465, 430 + PLACEHOLDER_ART_OFFSET_Y, 34);
    graphics.strokeCircle(559, 430 + PLACEHOLDER_ART_OFFSET_Y, 34);
  });

  createTexture(scene, ASSET_KEYS.cat[CAT_STATES.ATTACK], (graphics) => {
    drawHole(graphics);
    drawCatHead(graphics, 465);
    drawPaw(graphics, 735, 525 + PLACEHOLDER_ART_OFFSET_Y, COLORS.danger);
    graphics.lineStyle(10, COLORS.danger, 1);
    graphics.strokeLineShape(new Phaser.Geom.Line(
      670,
      470 + PLACEHOLDER_ART_OFFSET_Y,
      790,
      600 + PLACEHOLDER_ART_OFFSET_Y,
    ));
  });

  createTexture(scene, ASSET_KEYS.cat[CAT_STATES.SABOTAGE], (graphics) => {
    drawHole(graphics);
    drawCatHead(graphics, 465);
    drawPaw(graphics, 680, 610 + PLACEHOLDER_ART_OFFSET_Y, COLORS.warning);
    graphics.fillStyle(COLORS.warning, 1);
    graphics.fillCircle(805, 570 + PLACEHOLDER_ART_OFFSET_Y, 16);
    graphics.fillCircle(845, 610 + PLACEHOLDER_ART_OFFSET_Y, 11);
    graphics.fillCircle(800, 650 + PLACEHOLDER_ART_OFFSET_Y, 9);
  });

  createTexture(scene, ASSET_KEYS.cat[CAT_STATES.HIDE], (graphics) => {
    drawHole(graphics);
    graphics.fillStyle(COLORS.catDark, 0.4);
    graphics.fillEllipse(512, 475 + PLACEHOLDER_ART_OFFSET_Y, 160, 70);
  });
}

function createSabotagePawTexture(scene) {
  createTexture(scene, ASSET_KEYS.sabotagePaw, (graphics) => {
    graphics.lineStyle(86, COLORS.cat, 1);
    graphics.beginPath();
    graphics.moveTo(405, 430 + PLACEHOLDER_ART_OFFSET_Y);
    graphics.lineTo(820, 820 + PLACEHOLDER_ART_OFFSET_Y);
    graphics.strokePath();
    drawPaw(graphics, 820, 820 + PLACEHOLDER_ART_OFFSET_Y, COLORS.cream);
  });
}

export function ensurePlaceholderTextures(scene) {
  createTableTextures(scene);
  createCatTextures(scene);
  createSabotagePawTexture(scene);
}

export function createCatTableAssembly(scene, {
  useRealAssets = false,
  anchor = TABLE_ASSEMBLY_ANCHOR,
  showRigBlockout = false,
  showRoundTableMockup = false,
} = {}) {
  if (!useRealAssets) ensurePlaceholderTextures(scene);

  const container = scene.add.container(anchor.x, anchor.y).setDepth(1);
  container.setName('catTableContainer');

  const canUseRoundTable = showRoundTableMockup && scene.textures.exists(ASSET_KEYS.tableRoundBase);
  const catTextureMap = canUseRoundTable ? ASSET_KEYS.catRound : ASSET_KEYS.cat;
  const catScale = canUseRoundTable ? ROUND_CAT_SCALE : HOLE_CAT_SCALE;
  const tableBack = scene.add.image(
    0,
    canUseRoundTable ? TABLE_HOLE_OFFSET_Y : TABLE_BACK_OFFSET_Y,
    canUseRoundTable ? ASSET_KEYS.tableRoundBase : ASSET_KEYS.tableBack,
  )
    .setOrigin(0.5, 0.5)
    .setScale(canUseRoundTable ? ROUND_TABLE_SCALE : TABLE_SCALE);
  tableBack.setName('tableBack').setDepth(ASSEMBLY_DEPTH.BACK);
  const tableFront = scene.add.image(
    0,
    canUseRoundTable ? TABLE_HOLE_OFFSET_Y : TABLE_FRONT_OFFSET_Y,
    canUseRoundTable ? ASSET_KEYS.tableRoundBase : ASSET_KEYS.tableFront,
  )
    .setOrigin(0.5, 0.5)
    .setScale(canUseRoundTable ? ROUND_TABLE_SCALE : TABLE_SCALE)
    .setCrop(
      0,
      canUseRoundTable ? ROUND_TABLE_FRONT_CROP_Y : 0,
      CANVAS_SIZE,
      canUseRoundTable ? CANVAS_SIZE - ROUND_TABLE_FRONT_CROP_Y : CANVAS_SIZE,
    );
  tableFront.setName('tableFront').setDepth(ASSEMBLY_DEPTH.FRONT);
  const catState = scene.add.image(0, 0, catTextureMap[CAT_STATES.HIDDEN])
    .setOrigin(0.5, 0.5)
    .setScale(catScale)
    .setPosition(0, CAT_HOLE_OFFSET_Y);
  catState.baseScale = catScale;
  catState.baseY = CAT_HOLE_OFFSET_Y;
  catState.setName('catState').setDepth(ASSEMBLY_DEPTH.MIDDLE);
  const sabotagePaw = scene.add.image(0, CAT_HOLE_OFFSET_Y, ASSET_KEYS.sabotagePaw)
    .setOrigin(SABOTAGE_PAW_ORIGIN.x, SABOTAGE_PAW_ORIGIN.y)
    .setScale(0.44)
    .setVisible(false);
  sabotagePaw.setName('sabotagePaw').setDepth(ASSEMBLY_DEPTH.MIDDLE + 5);

  container.add([tableBack, catState, sabotagePaw, tableFront]);

  const catRig = showRigBlockout
    ? createCatRigRuntime(scene, {
      parent: container,
      offsetY: CAT_HOLE_OFFSET_Y,
      showDebug: true,
    })
    : null;
  if (catRig) catState.setVisible(false);

  container.sort('depth');

  return {
    container,
    tableBack,
    catState,
    sabotagePaw,
    tableFront,
    usesRoundTable: canUseRoundTable,
    catRig,
    setCatState(state) {
      const textureState = state === CAT_STATES.SABOTAGE ? CAT_STATES.PEEK : state;
      const textureKey = state === CAT_STATES.WARNING
        ? catTextureMap[CAT_STATES.HIDDEN]
        : catTextureMap[textureState];
      catState.setTexture(textureKey);
    },
  };
}
