import Phaser from 'phaser';
import { GameScene } from './game/GameScene.js';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1024,
  height: 1024,
  backgroundColor: '#f3dcc1',
  scene: [GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1024,
    height: 1024,
  },
  input: {
    activePointers: 1,
  },
  render: {
    antialias: true,
    roundPixels: true,
  },
});
