import Phaser from 'phaser';

export default class EditorScene extends Phaser.Scene {
  public constructor() {
    super({ key: 'EditorScene' });
  }

  // public preload(): void {
  //   this.load.image('button_test', 'assets/flixel-button.png');
  // }

  public create(data): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xff3300, 1);
    graphics.fillRect(600, 0, 200, 600);
  }
}
