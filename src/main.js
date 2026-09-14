import Phaser from 'phaser';
import { GameScene } from './game/GameScene.js';
import './styles/fonts.css';
import './styles/tokens.css';

const MOBILE_CANVAS_WIDTH = 1024;
const MOBILE_CANVAS_HEIGHT = 1820;

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  width: MOBILE_CANVAS_WIDTH,
  height: MOBILE_CANVAS_HEIGHT,
  backgroundColor: '#f3dcc1',
  scene: [GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: MOBILE_CANVAS_WIDTH,
    height: MOBILE_CANVAS_HEIGHT,
  },
  input: {
    activePointers: 1,
  },
  render: {
    antialias: true,
    roundPixels: true,
  },
});
