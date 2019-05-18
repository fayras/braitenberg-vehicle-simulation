import Phaser from 'phaser';

export default class Button {
  public button: Phaser.GameObjects.Sprite;

  public text: Phaser.GameObjects.Text;

  public status: number;

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    status: number,
    action: (btn: Button) => void,
  ) {
    // Text zentrieren ?
    // Status 0 = stop, Status 1= lüft, Status >1 Fehler
    this.status = status;
    this.button = scene.add.sprite(60, 30, 'button', 0).setInteractive();
    this.button.on('pointerdown', () => action(this));
    this.text = scene.add.text(x, y, text);
  }
}
