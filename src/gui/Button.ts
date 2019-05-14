import Phaser from 'phaser';

export default class Button {
  private button: Phaser.GameObjects.Sprite;

  private text: Phaser.GameObjects.Text;

  public constructor(scene: Phaser.Scene, x: number, y: number, text: string, action: () => void) {
    this.button = scene.add.sprite(60, 30, 'button', 1);
    this.text = scene.add.text(x, y, text);
    // Text zentrieren ?
    this.button.on('pointerdown', action);
    this.button.setInteractive();
  }
}
