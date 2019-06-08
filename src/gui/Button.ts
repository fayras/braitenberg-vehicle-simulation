import Phaser from 'phaser';

export default class Button extends Phaser.GameObjects.Sprite {
  public constructor(scene: Phaser.Scene, x: number, y: number, icon: number, action: (btn: Button) => void) {
    super(scene, x, y, 'button', icon);
    scene.add.existing(this);
    this.setInteractive({
      useHandCursor: true,
    });

    this.on('pointerover', () => {
      this.setTint(0xfafafa);
    });
    this.on('pointerout', () => {
      this.setTint(0xffffff);
    });

    this.on('pointerdown', () => {
      this.handleClick(action);
    });
  }

  protected handleClick(action: (btn: Button) => void): void {
    action(this);
  }

  public getWidth(): number {
    return this.width;
  }
}
