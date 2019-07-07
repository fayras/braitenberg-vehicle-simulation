import Phaser from 'phaser';
import MainScene from './scenes/MainScene';
import MainInterfaceScene from './scenes/MainInterfaceScene';
import LoadingScene from './scenes/LoadingScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#EAEAEA',
  parent: 'body',
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%',
  },
  dom: {
    createContainer: true,
  },
  input: {
    windowEvents: false,
  },
  scene: [LoadingScene, MainScene, MainInterfaceScene],
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 0 },
      // debug: true,
      debugBodyColor: 0xffffff,
    },
  },
};

// eslint-disable-next-line
window.game = new Phaser.Game(config);
