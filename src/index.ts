import Phaser from 'phaser';
import MainScene from './scenes/MainScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  backgroundColor: '#CCCCCC',
  dom: {
    createContainer: true,
  },
  scene: MainScene,
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 0 },
      debug: true,
      debugBodyColor: 0xffffff,
    },
  },
};

// eslint-disable-next-line
window.game = new Phaser.Game(config);
