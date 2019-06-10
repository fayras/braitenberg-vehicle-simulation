import Phaser from 'phaser';
import Button from '../gui/Button';

export default abstract class SidebarScene extends Phaser.Scene {
  protected container: Phaser.GameObjects.Container | null = null;

  protected background: Phaser.GameObjects.Graphics | null = null;

  public constructor(key: string) {
    super({ key });
  }

  public static getWidth(): number {
    return 256;
  }

  protected abstract onCreate(container: Phaser.GameObjects.Container, ...args: any): void;

  public create(...args: unknown[]): void {
    this.scale.on('resize', this.handleResize.bind(this));

    const container = this.add.container(this.cameras.main.displayWidth, 0);
    this.container = container;

    const rect = new Phaser.Geom.Rectangle(0, 0, SidebarScene.getWidth(), this.cameras.main.displayHeight);
    this.background = this.add.graphics({ fillStyle: { color: 0xcaff70 } });
    this.background.fillRectShape(rect);
    container.add(this.background);

    const close = new Button(this, -35, 35, 0, () => {
      this.tweens.add({
        targets: this.container,
        x: `+=${SidebarScene.getWidth()}`,
        y: 0,
        duration: 100,
        ease: 'Expo.easeInOut',
        onComplete: () => this.scene.stop('SidebarScene'),
      });
    });
    container.add(close);

    this.onCreate(container, ...args);

    this.tweens.add({
      targets: this.container,
      x: `-=${SidebarScene.getWidth()}`,
      y: 0,
      duration: 200,
      ease: 'Expo.easeInOut',
    });
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    const { width, height } = gameSize;

    this.cameras.resize(width, height);
    if (this.container) {
      this.container.setPosition(this.cameras.main.displayWidth - SidebarScene.getWidth(), 0);
    }
    if (this.background) {
      const rect = new Phaser.Geom.Rectangle(0, 0, SidebarScene.getWidth(), this.cameras.main.displayHeight);
      this.background.fillRectShape(rect);
    }
  }
}
