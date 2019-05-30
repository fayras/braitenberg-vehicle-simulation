import Phaser from 'phaser';
import windowImg from '../../assets/gui_window.png';

export default class SettingScene extends Phaser.Scene {
  public text1: string = 'Anzahl Sensoren';

  public text2: string = 'Anzahl Motoren';

  public constructor() {
    super({ key: 'SettingScene' });
  }

  public preload(): void {
    this.load.image('gui-window', windowImg);
    this.load.html('slider', 'assets/slider.html');
  }

  public create(): void {
    const rect = new Phaser.Geom.Rectangle(570, 10, 220, 580);

    const graphics = this.add.graphics({ fillStyle: { color: 0xffbf00 } });
    graphics.fillRectShape(rect);

    this.add.text(570, 80, this.text1);
    this.add.text(570, 120, this.text2);

    const sliderElement = this.add
      .dom(570, 100)
      .createFromCache('slider')
      .setOrigin(0);
  }
}
