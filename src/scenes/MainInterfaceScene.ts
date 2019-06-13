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

    const start = new ToggleButton(this, 35, 35, 4, 3, () => {
      mainScene.pause(!mainScene.isRunning());
    });

    const reset = new Button(this, 45 + start.getWidth(), 35, 5, () => {
      MainScene.loadSnapshot();
    });

    const showEditor = new Button(this, this.cameras.main.displayWidth - 35, 35, 1, () => {
      this.scene.launch('EditorScene');
    });

    //To-Do passendes Icon suchen
    const save = new Button(this, 120 + start.getWidth(), 35, 1, () => {
      MainScene.createSnapshot();
    });

    this.buttons.push(start, reset, showEditor);
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    const { width, height } = gameSize;

    this.cameras.resize(width, height);
    const showEditor = this.buttons[2];

    showEditor.setPosition(this.cameras.main.width - 35, 35);
  }
}
