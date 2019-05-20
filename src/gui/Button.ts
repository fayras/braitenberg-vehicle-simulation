import Phaser from 'phaser';

export default class Button {
  public button: Phaser.GameObjects.Sprite;

  public text: Phaser.GameObjects.Text;

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    klickaction: (btn: Button) => void,
    hoveraction: (btn: Button) => void,
  ) {
    this.button = scene.add.sprite(x, y, 'button', 0).setInteractive();

    this.button.on('pointerover', () => {
      this.handleClick(hoveraction);
    });
    this.button.on('pointerdown', () => {
      this.handleClick(klickaction);
    });

    this.text = scene.add.text(x, y, text);
    this.text.x = this.text.x - this.text.displayWidth / 2;
    this.text.y = this.text.y - this.text.displayHeight / 2;
  }

  protected handleClick(klickaction: (btn: Button) => void): void {
    klickaction(this);
    console.log('geklickt');
  }

  protected handleHover(hoveraction: (btn: Button) => void): void {
    hoveraction(this);
    this.add.text(0, 0, 'Testtest', { font: '18px Courier', fill: '#00ff00' }).setScrollFactor(0);
    console.log('gehovert');
  }
}
