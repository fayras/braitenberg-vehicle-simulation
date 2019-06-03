import Phaser from 'phaser';
import ToggleButton from '../gui/ToggleButton';
import Button from '../gui/Button';
import MainScene from './MainScene';
import buttonSpriteSheet from '../../assets/gui_icons.png';
import EditorScene from './EditorScene';

export default class MainInterfaceScene extends Phaser.Scene {
  private buttons: Button[] = [];

  public constructor() {
    super({ key: 'MainInterfaceScene' });
  }

  public preload(): void {
    this.load.spritesheet('button', buttonSpriteSheet, { frameWidth: 158, frameHeight: 159.2 });
  }

  public create(): void {
    this.scale.on('resize', this.handleResize.bind(this));
    const mainScene = this.scene.get('MainScene') as MainScene;
    this.scene.launch('EditorScene'); // Wofür macht es Sinn die Scene hier zu launchen ?
    this.scene.sleep('EditorScene');

    const start = new ToggleButton(this, 70, 35, '', 4, 8, () => {
      mainScene.pause(!mainScene.isRunning());
    });
    const reset = new Button(this, 200, 35, '', 29, () => {
      MainScene.loadSnapshot();
    });

    const showEditor = new ToggleButton(this, this.cameras.main.displayWidth - 35, 35, '', 2, 2, button => {
      if ((button as ToggleButton).isPressed()) {
        this.scene.sleep('EditorScene');
        button.setPosition(this.cameras.main.width - 35, 35);
      } else {
        this.scene.wake('EditorScene');
        const scene = this.scene.get('EditorScene') as EditorScene;
        button.setPosition(this.cameras.main.width - scene.getWidth() - 35, 35);
      }
    });

    const test = new ToggleButton(this, 350, 35, '', 14, 14, button => {
      if ((button as ToggleButton).isPressed()) {
        this.scene.sleep('SettingScene');
      } else {
        this.scene.launch('SettingScene');
      }
    });

    this.buttons.push(start, reset, showEditor, test);
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    const { width, height } = gameSize;

    this.cameras.resize(width, height);
    const showEditor = this.buttons[2];
    if ((showEditor as ToggleButton).isPressed()) {
      const scene = this.scene.get('EditorScene') as EditorScene;
      showEditor.setPosition(this.cameras.main.width - scene.getWidth() - 35, 35);
    } else {
      showEditor.setPosition(this.cameras.main.width - 35, 35);
    }
  }
}
