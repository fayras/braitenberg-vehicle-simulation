import Phaser from 'phaser';
import ToggleButton from '../gui/ToggleButton';
import Button from '../gui/Button';
import MainScene from './MainScene';

export default class MainInterfaceScene extends Phaser.Scene {
  private buttons: Button[] = [];

  public constructor() {
    super({ key: 'MainInterfaceScene' });
  }

  public create(): void {
    this.scale.on('resize', this.handleResize.bind(this));
    const mainScene = this.scene.get('MainScene') as MainScene;

    const start = new ToggleButton(this, 35, 35, 5, 8, () => {
      mainScene.pause(!mainScene.isRunning());
    });

    const reset = new Button(this, 45 + start.getWidth(), 35, 11, () => {
      MainScene.loadSnapshot();
    });

    const save = new Button(this, 110 + start.getWidth(), 35, 10, () => {
      MainScene.createSnapshot();
    });

    const showEditor = new Button(this, this.cameras.main.displayWidth - 35, 35, 1, () => {
      this.scene.launch('EditorScene');
    });

    const importButton = new Button(this, 175 + start.getWidth(), 35, 7, () => {
      // this.scene.launch('EditorScene');
    });

    const exportButton = new Button(this, 240 + start.getWidth(), 35, 3, () => {
      // this.scene.launch('EditorScene');
    });

    this.buttons.push(start, reset, showEditor, save, importButton);
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    const showEditor = this.buttons[2];

    showEditor.setPosition(gameSize.width - 35, 35);
  }
}
