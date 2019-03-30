import Phaser from 'phaser';
import MainScene from './scenes/MainScene';

const config: GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  backgroundColor: '#CCCCCC',
  scene: MainScene,
};

// eslint-disable-next-line
new Phaser.Game(config);
