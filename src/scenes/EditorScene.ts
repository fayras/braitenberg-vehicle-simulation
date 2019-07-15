import Phaser from 'phaser';
import EntityManager from '../EntityManager';
import TransformableComponent from '../components/TransformableComponent';
import SolidBodyComponent from '../components/SolidBodyComponent';
import RenderComponent from '../components/RenderComponent';
import SidebarScene from './SidebarScene';
import SourceComponent from '../components/SourceComponent';
import Entity from '../Entity';
import MotorComponent from '../components/MotorComponent';
import SensorComponent from '../components/SensorComponent';
import ConnectionComponent from '../components/ConnectionComponent';

type DropHandler = (position: { x: number; y: number }) => void;

export default class EditorScene extends SidebarScene {
  public constructor() {
    super('EditorScene');
  }

  public onCreate(container: Phaser.GameObjects.Container): void {
    const prefabBlank = this.add.image(0, 0, 'prefab-blank');
    const prefabSource = this.add.image(0, 0, 'prefab-source');
    const prefab2a = this.add.image(0, 0, 'prefab-2a');
    const prefab2b = this.add.image(0, 0, 'prefab-2b');
    const prefab3a = this.add.image(0, 0, 'prefab-3a');
    const prefab3b = this.add.image(0, 0, 'prefab-3b');

    this.makeInteractable(prefabBlank, position => {
      const entity = new Entity();
      entity.addComponent(
        new TransformableComponent({
          position,
        }),
      );
      entity.addComponent(
        new RenderComponent({
          asset: 'prefab-blank',
          size: 100,
        }),
      );

      EntityManager.addExistingEntity(entity);
    });

    // this.makeInteractable(prefab, position => {
    //   const entity = new Entity();
    //   entity.addComponent(new TransformableComponent(position));
    //   entity.addComponent(new SolidBodyComponent(100));
    //   entity.addComponent(new RenderComponent('vehicle', 100));
    //   const motor1 = entity.addComponent(new MotorComponent({ x: -50, y: 0 }, 20, 2));
    //   const motor2 = entity.addComponent(new MotorComponent({ x: 50, y: 0 }, 20, 2));
    //   const sensor1 = entity.addComponent(new SensorComponent({ x: 0, y: 55 }, 80, 1.3));
    //   entity.addComponent(new ConnectionComponent([sensor1], [motor1, motor2], [[0, 1]]));
    //   EntityManager.addExistingEntity(entity);
    // });

    this.pack([prefabBlank, prefabSource, prefab2a, prefab2b, prefab3a, prefab3b]);
  }

  private makeInteractable(image: Phaser.GameObjects.Image, onDrop: DropHandler): void {
    image.setInteractive({ draggable: true });
    image.on('dragstart', () => {
      this.children.bringToTop(image);
    });

    image.on('drag', (pointer: Phaser.Input.Pointer, x: number, y: number) => {
      image.setPosition(x, y);
    });

    image.on('dragend', (pointer: Phaser.Input.Pointer, x: number, y: number, dropped: boolean) => {
      if (this.container) {
        const position = { x: 0, y: 0 };
        this.container.getWorldTransformMatrix().transformPoint(image.x, image.y, position);
        onDrop(position);
      }
      image.setPosition(image.input.dragStartX, image.input.dragStartY);
    });
  }
}
