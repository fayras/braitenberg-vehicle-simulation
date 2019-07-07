import Phaser from 'phaser';

export default class ScrollableContainer extends Phaser.GameObjects.Container {
  private scrollOffset: number = 0;

  private scrollbar: Phaser.GameObjects.Rectangle;

  private visibleWidth: number;

  private visibleHeight: number;

  private mouseOver: boolean = false;

  private handlers: (() => void)[] = [];

  public constructor(scene: Phaser.Scene, visibleWidth: number, visibleHeight: number) {
    super(scene);

    this.visibleWidth = visibleWidth;
    this.visibleHeight = visibleHeight;

    this.setInteractive(new Phaser.Geom.Rectangle(0, 0, visibleWidth, visibleHeight), Phaser.Geom.Rectangle.Contains);

    this.on('wheel', (p: Phaser.Input.Pointer, dx: number, dy: number) => {
      this.scroll(dy * 20);
    });

    // window.addEventListener();

    // this.on('pointerout', () => {
    //   console.log('pointerout!');
    // });

    this.scrollbar = scene.add.rectangle(0, 0, 10, 100, 0xd8d8d8);
    this.scrollbar.setInteractive({ draggable: true });
    this.scrollbar.setOrigin(1, 0);
    this.scrollbar.on('drag', (gameObject: unknown, x: number, y: number) => {
      const delta = y - this.scrollbar.y;
      this.scroll(delta);
    });
    this.scrollbar.setDepth(999);

    scene.add.existing(this);
    scene.children.bringToTop(this);
    scene.children.bringToTop(this.scrollbar);
  }

  public scroll(delta: number): void {
    const overflow =
      this.scrollOffset + delta < 0 || this.scrollOffset + this.scrollbar.height + delta > this.visibleHeight;
    this.scrollOffset = Phaser.Math.Clamp(this.scrollOffset + delta, 0, this.visibleHeight);

    if (overflow) return;

    this.scrollbar.setPosition(
      this.scrollbar.x,
      Phaser.Math.Clamp(this.scrollbar.y + delta, 0, this.visibleHeight - this.scrollbar.height),
    );

    const newY = this.y - (delta / (this.visibleHeight - this.scrollbar.height)) * (this.height - this.visibleHeight);
    super.setPosition(this.x, newY);
  }

  public setHeight(height: number): void {
    this.height = height;
  }

  public setPosition(x: number, y: number): this {
    super.setPosition(x, y);
    if (this.scrollbar) {
      this.scrollbar.setPosition(this.x + this.visibleWidth, this.y + this.scrollOffset);
    }

    return this;
  }

  protected preDestroy(): void {
    super.preDestroy();
    this.scrollbar.destroy();
  }
}
