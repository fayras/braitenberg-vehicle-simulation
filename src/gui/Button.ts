import Phaser from 'phaser';

export default class Button {
  public button: Phaser.GameObjects.Sprite; // schöne Methode schreiben

  public text: Phaser.GameObjects.Text; // schöne Methode schreiben

  public constructor(scene: Phaser.Scene, x: number, y: number, text: string, action: (btn: Button) => void) {
    // Text zentrieren ?
    this.button = scene.add.sprite(60, 30, 'button', 0).setInteractive();
    // this.button.on('pointerover', () => action(this));
    this.button.on('pointerdown', () => action(this));
    // this.button.on('pointerout', () => action(this));
    // this.button.setInteractive();
    this.text = scene.add.text(x, y, text);
  }
}
