import Phaser from 'phaser';
import MainScene from './scenes/MainScene';
import MainInterfaceScene from './scenes/MainInterfaceScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#CCCCCC',
  dom: {
    createContainer: true,
  },
  scene: [MainScene, MainInterfaceScene],
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
