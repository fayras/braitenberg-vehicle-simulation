import Phaser from 'phaser';
import tankImg from '../../assets/tank.png';
import EntityManager from '../EntityManager';
import TransformableComponent from '../components/TransformableComponent';
import SolidBodyComponent from '../components/SolidBodyComponent';
import RenderComponent from '../components/RenderComponent';
import SidebarScene from './SidebarScene';

export default class EditorScene extends SidebarScene {
  public constructor() {
    super('EditorScene');
  }

  public preload(): void {
    this.load.image('tank', tankImg);
  }

  public onCreate(container: Phaser.GameObjects.Container): void {
    const tank = this.add.image(EditorScene.getWidth() / 2, 70, 'tank').setInteractive();

    const tank2 = this.add.image(EditorScene.getWidth() / 2, 170, 'tank').setInteractive();

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
}
