import Phaser from 'phaser';
import Button from '../gui/Button';

export default abstract class SidebarScene extends Phaser.Scene {
  protected container: Phaser.GameObjects.Container | null = null;

  protected background: Phaser.GameObjects.Graphics | null = null;

  protected key: string;

  public constructor(key: string) {
    super({ key });
    this.key = key;
  }

  public static getWidth(): number {
    return 256;
  }

  protected abstract onCreate(container: Phaser.GameObjects.Container, ...args: any): void;

  public create(...args: unknown[]): void {
    const handler = this.handleResize.bind(this);
    this.scale.on('resize', handler);

    const container = this.add.container(this.cameras.main.displayWidth, 0);
    this.container = container;

    this.background = this.add.graphics({ fillStyle: { color: 0xf8f8f8 } });
    this.fillBackground();

    container.add(this.background);

    const close = new Button(this, -35, 35, 0, () => {
      this.tweens.add({
        targets: this.container,
        x: `+=${SidebarScene.getWidth()}`,
        y: 0,
        duration: 100,
        ease: 'Expo.easeInOut',
        onComplete: () => {
          this.scale.off('resize', handler);
          this.scene.stop(this.key);
        },
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

  protected pack(
    objects: (Phaser.GameObjects.Image | Phaser.GameObjects.Sprite | Phaser.GameObjects.DOMElement | undefined)[],
  ): void {
    if (this.container) {
      const padding = 15;
      for (let i = 0; i < objects.length; i += 1) {
        const object = objects[i];

        if (object) {
          const objectHeight = object.height;
          object.setPosition(SidebarScene.getWidth() / 2, this.container.height + objectHeight / 2 + padding);
          this.container.add(object);
          this.container.height += objectHeight + padding;
        }
      }
    }
  }

  private fillBackground(): void {
    if (this.background) {
      const rect = new Phaser.Geom.Rectangle(0, 0, SidebarScene.getWidth(), this.cameras.main.displayHeight);
      this.background.fillRectShape(rect);
      this.background.lineStyle(1, 0xe0e0e0);
      this.background.strokeLineShape(new Phaser.Geom.Line(0, 0, 0, this.cameras.main.displayHeight));
    }
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    const { width, height } = gameSize;

    this.cameras.resize(width, height);
    if (this.container) {
      this.container.setPosition(this.cameras.main.displayWidth - SidebarScene.getWidth(), 0);
    }
    this.fillBackground();
  }
}
