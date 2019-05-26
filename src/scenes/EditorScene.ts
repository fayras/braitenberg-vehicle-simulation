import Phaser from 'phaser';
import windowImg from '../../assets/gui_window.png';
import tankImg from '../../assets/tank.png';

export default class EditorScene extends Phaser.Scene {
  // public editor: Phaser.GameObjects.Image;

  public constructor() {
    super({ key: 'EditorScene' });
  }

  public preload(): void {
    this.load.image('gui-window', windowImg);
    this.load.image('tank', tankImg);
  }

  public create(data): void {
    // this.editor = this.add.image(data.x, data.y, 'gui-window').setOrigin(0);
    const rect = new Phaser.Geom.Rectangle(570, 10, 220, 580);

    const graphics = this.add.graphics({ fillStyle: { color: 0xcaff70 } });
    graphics.fillRectShape(rect);

    this.add.image(580, 50, 'tank').setOrigin(0);
  }
}
