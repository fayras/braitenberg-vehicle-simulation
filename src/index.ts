import Phaser from 'phaser';
import MainScene from './scenes/MainScene';

const config: GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  backgroundColor: '#CCCCCC',
  scene: MainScene,
  physics: {
    default: 'matter',
    matter: { gravity: { y: 0 } },
  },
};

// eslint-disable-next-line
window.game = new Phaser.Game(config);
