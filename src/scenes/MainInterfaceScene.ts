import Phaser from 'phaser';
import ToggleButton from '../gui/ToggleButton';
import Button from '../gui/Button';
import MainScene from './MainScene';
import buttonSpriteSheet from '../../assets/gui_buttons.png';
import EditorScene from './EditorScene';

export default class MainInterfaceScene extends Phaser.Scene {
  private buttons: Button[] = [];

  public constructor() {
    super({ key: 'MainInterfaceScene' });
  }

  public preload(): void {
    this.load.spritesheet('button', buttonSpriteSheet, { frameWidth: 50, frameHeight: 48 });
  }

  public create(): void {
    this.scale.on('resize', this.handleResize.bind(this));
    const mainScene = this.scene.get('MainScene') as MainScene;
    this.scene.launch('EditorScene'); // Wofür macht es Sinn die Scene hier zu launchen ?
    this.scene.sleep('EditorScene');

    const start = new ToggleButton(this, 35, 35, '', 4, 3, () => {
      mainScene.pause(!mainScene.isRunning());
    });

    const reset = new Button(this, 45 + start.getWidth(), 35, '', 5, () => {
      MainScene.loadSnapshot();
    });

    const showEditor = new ToggleButton(this, this.cameras.main.displayWidth - 35, 35, '', 0, 1, button => {
      if ((button as ToggleButton).isPressed()) {
        this.scene.sleep('EditorScene');
        button.setPosition(this.cameras.main.width - 35, 35);
      } else {
        this.scene.wake('EditorScene');
        button.setPosition(this.cameras.main.width - EditorScene.getWidth() - 35, 35);
      }
    });

    this.buttons.push(start, reset, showEditor);
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    const { width, height } = gameSize;

    this.cameras.resize(width, height);
    const showEditor = this.buttons[2];
    if ((showEditor as ToggleButton).isPressed()) {
      showEditor.setPosition(this.cameras.main.width - EditorScene.getWidth() - 35, 35);
    } else {
      showEditor.setPosition(this.cameras.main.width - 35, 35);
    }
  }
}
