import Phaser from 'phaser';
import windowImg from '../../assets/gui_window.png';

export default class SettingScene extends Phaser.Scene {
  public text: Phaser.GameObjects.Text = new Text();

  public constructor() {
    super({ key: 'SettingScene' });
  }

  public preload(): void {
    this.load.image('gui-window', windowImg);
  }

  public create(): void {
    const rect = new Phaser.Geom.Rectangle(350, 100, 300, 300);

    const graphics = this.add.graphics({ fillStyle: { color: 0xffbf00 } });
    graphics.fillRectShape(rect);

    this.text = this.add.text(500, 130, 'Anzahl Sensoren');
  }
}
