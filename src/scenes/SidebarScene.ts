import Phaser from 'phaser';
import Button from '../gui/Button';

export default abstract class SidebarScene extends Phaser.Scene {
  protected container: Phaser.GameObjects.Container | null = null;

  protected background: Phaser.GameObjects.Rectangle | null = null;

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

    this.background = this.add.rectangle(0, 0, SidebarScene.getWidth(), this.cameras.main.displayHeight, 0xf8f8f8);
    this.background.setOrigin(0);
    this.background.setPosition(this.cameras.main.displayWidth, 0);
    this.background.setDepth(0);

    const container = this.add.container(this.cameras.main.displayWidth, 0);
    this.container = container;
    this.container.setDepth(1);

    const close = new Button(this, -35, 35, 19, () => {
      this.tweens.add({
        targets: [this.container, this.background],
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
      targets: [this.container, this.background],
      x: `-=${SidebarScene.getWidth()}`,
      y: 0,
      duration: 200,
      ease: 'Expo.easeInOut',
    });
  }

  protected pack(
    objects: (
      | Phaser.GameObjects.Image
      | Phaser.GameObjects.Sprite
      | Phaser.GameObjects.DOMElement
      | Phaser.GameObjects.Text
      | undefined)[],
    usePadding: boolean = true,
  ): void {
    if (this.container) {
      const padding = usePadding ? 15 : 0;
      for (let i = 0; i < objects.length; i += 1) {
        const object = objects[i];

        if (object) {
          const objectHeight = object.height;
          object.setPosition(SidebarScene.getWidth() / 2, this.container.height + objectHeight / 2 + padding);

          if (object instanceof Phaser.GameObjects.Text) {
            object
              .setFontSize(23)
              .setColor('black')
              .setFontFamily('Calibri');
            object.setPosition(SidebarScene.getWidth() / 2 - 60, this.container.height + objectHeight / 2 + padding);
          }
          this.container.add(object);
          this.container.height += objectHeight + padding;
        }
      }
    }
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    if (this.container) {
      this.container.setPosition(gameSize.width - SidebarScene.getWidth(), 0);
    }
    if (this.background) {
      this.background.setPosition(gameSize.width - SidebarScene.getWidth(), 0);
      this.background.setSize(SidebarScene.getWidth(), gameSize.height);
    }
  }
}
