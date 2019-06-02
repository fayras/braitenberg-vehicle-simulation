import Phaser from 'phaser';
import tankImg from '../../assets/tank.png';

export default class EditorScene extends Phaser.Scene {
  // public editor: Phaser.GameObjects.Image;
  private dragObject: Phaser.GameObjects.GameObject | null = null;

  public constructor() {
    super({ key: 'EditorScene' });
  }

  public preload(): void {
    this.load.image('tank', tankImg);
  }

  public create(): void {
    this.scale.on('resize', this.handleResize.bind(this));
    const rect = new Phaser.Geom.Rectangle(
      this.cameras.main.displayWidth - 200,
      0,
      this.cameras.main.displayWidth / 6,
      this.cameras.main.displayHeight,
    );

    const graphics = this.add.graphics({ fillStyle: { color: 0xcaff70 } });
    graphics.fillRectShape(rect);

    const tank = this.add
      .image(this.cameras.main.displayWidth - 150, 30, 'tank')
      .setOrigin(0)
      .setInteractive();

    const tank2 = this.add
      .image(this.cameras.main.displayWidth - 150, 130, 'tank')
      .setOrigin(0)
      .setInteractive();

    this.input.setDraggable(tank);
    this.input.setDraggable(tank2);

    this.input.on('dragstart', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => {
      this.children.bringToTop(gameObject);
    });
    this.input.on(
      'drag',
      (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image, dragX: number, dragY: number) => {
        gameObject.setPosition(dragX, dragY);
      },
    );

    this.input.on(
      'dragend',
      (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image, dropped: boolean) => {
        console.log(dropped);
        gameObject.setPosition(gameObject.input.dragStartX, gameObject.input.dragStartY);
      },
    );
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    const { width, height } = gameSize;

    this.cameras.resize(width, height);
  }
}
