import Phaser from 'phaser';
import ToggleButton from '../gui/ToggleButton';
import Button from '../gui/Button';
import MainScene from './MainScene';
import buttonSpriteSheet from '../../assets/gui_icons.png';

export default class MainInterfaceScene extends Phaser.Scene {
  public constructor() {
    super({ key: 'MainInterfaceScene' });
  }

  public preload(): void {
    this.load.spritesheet('button', buttonSpriteSheet, { frameWidth: 158, frameHeight: 159.2 });
  }

  public create(): void {
    const mainScene = this.scene.get('MainScene') as MainScene;

    const startButton = new ToggleButton(this, 70, 35, '', 4, 8, button => {
      mainScene.pause(!mainScene.isRunning());
    });
    const resetButton = new Button(this, 200, 35, '', 29, button => {});
    const EditorButton = new ToggleButton(this, 700, 35, '', 2, 2, button => {
      if ((button as ToggleButton).isPressed()) {
        this.scene.sleep('EditorScene');
        button.setPosition(700, 35);
      } else {
        this.scene.launch('EditorScene', { x: 500, y: 0 });
        button.setPosition(535, 35);
      }
    });
    const testButton = new ToggleButton(this, 350, 35, '', 14, 14, button => {
      if ((button as ToggleButton).isPressed()) {
        this.scene.sleep('SettingScene');
      } else {
        this.scene.launch('SettingScene');
      }
    });
  }
}
