import Phaser from 'phaser';
import tankImg from '../../assets/tank.png';
import EntityManager from '../EntityManager';
import TransformableComponent from '../components/TransformableComponent';
import SolidBodyComponent from '../components/SolidBodyComponent';
import RenderComponent from '../components/RenderComponent';

export default class EditorScene extends Phaser.Scene {
  // public editor: Phaser.GameObjects.Image;
  private dragObject: Phaser.GameObjects.GameObject | null = null;

  private container: Phaser.GameObjects.Container | null = null;

  private background: Phaser.GameObjects.Graphics | null = null;

  public constructor() {
    super({ key: 'EditorScene' });
  }

  public preload(): void {
    this.load.image('tank', tankImg);
  }

  public getWidth(): number {
    return Math.max(150, this.cameras.main.displayWidth / 6);
  }

  public create(): void {
    this.scale.on('resize', this.handleResize.bind(this));

    const container = this.add.container(this.cameras.main.displayWidth - this.getWidth(), 0);
    this.container = container;

    const rect = new Phaser.Geom.Rectangle(0, 0, this.getWidth(), this.cameras.main.displayHeight);
    this.background = this.add.graphics({ fillStyle: { color: 0xcaff70 } });
    this.background.fillRectShape(rect);

    container.add(this.background);

    const tank = this.add.image(this.getWidth() / 2, 70, 'tank').setInteractive();

    const tank2 = this.add.image(this.getWidth() / 2, 170, 'tank').setInteractive();

    container.add(tank);
    container.add(tank2);

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
        const position = { x: 0, y: 0 };
        container.getWorldTransformMatrix().transformPoint(gameObject.x, gameObject.y, position);

        EntityManager.createEntity(
          new TransformableComponent(position),
          new RenderComponent('logo', 100),
          new SolidBodyComponent(100),
        );

        gameObject.setPosition(gameObject.input.dragStartX, gameObject.input.dragStartY);
      },
    );
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    const { width, height } = gameSize;

    this.cameras.resize(width, height);
    if (this.container) {
      this.container.setPosition(this.cameras.main.displayWidth - this.getWidth(), 0);
    }
    if (this.background) {
      const rect = new Phaser.Geom.Rectangle(0, 0, this.getWidth(), this.cameras.main.displayHeight);
      this.background.fillRectShape(rect);
    }
  }
}
