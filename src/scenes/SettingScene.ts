import Phaser from 'phaser';

export default class SettingScene extends Phaser.Scene {
  //public text: Phaser.GameObjects.Text = 'Test';

  public constructor() {
    super({ key: 'SettingScene' });
  }

  public preload(): void {}

  public create(): void {
    const rect = new Phaser.Geom.Rectangle(350, 100, 300, 300);

    const graphics = this.add.graphics({ fillStyle: { color: 0xffbf00 } });
    graphics.fillRectShape(rect);
    //const text = this.scene.add.text(100, 100, 'Anzahl Sensoren');
  }
}
