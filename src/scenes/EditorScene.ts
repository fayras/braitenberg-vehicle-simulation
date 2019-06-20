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
    const prefab = this.add.image(0, 0, 'vehicle_icon');
    const vehicle = this.add.image(0, 0, 'vehicle_icon');
    const source = this.add.image(0, 0, 'source_icon');
    const motor = this.add.image(0, 0, 'motor_icon');
    const sensor = this.add.image(0, 0, 'sensor_icon');

    const vorlagen = this.add.text(0, 0, 'Vorlagen:');
    const grundformen = this.add.text(0, 0, 'Grundformen:');

    this.makeInteractable(prefab, position => {
      const entity = new Entity();
      entity.addComponent(new TransformableComponent(position));
      entity.addComponent(new SolidBodyComponent(100));
      entity.addComponent(new RenderComponent('vehicle_icon', 100));
      const motor1 = entity.addComponent(new MotorComponent({ x: -50, y: 0 }, 20, 2));
      const motor2 = entity.addComponent(new MotorComponent({ x: 50, y: 0 }, 20, 2));
      const sensor1 = entity.addComponent(new SensorComponent({ x: 0, y: 55 }, 80, 1.3));
      entity.addComponent(new ConnectionComponent([sensor1], [motor1, motor2], [[0, 1]]));
      EntityManager.addExistingEntity(entity);
    });

    this.makeInteractable(vehicle, position => {
      EntityManager.createEntity(
        new TransformableComponent(position),
        new RenderComponent('redX', 100),
        new SolidBodyComponent(100),
      );
    });
    this.makeInteractable(source, position => {
      EntityManager.createEntity(
        new TransformableComponent(position),
        new RenderComponent('source_icon', 100),
        new SourceComponent(100),
      );
    });
    this.makeInteractable(motor, position => {});
    this.makeInteractable(sensor, position => {});

    this.pack([vorlagen, prefab, grundformen, vehicle, source, motor, sensor]);
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

      console.log(x, y, image.x, image.y, dropped);
      image.setPosition(image.input.dragStartX, image.input.dragStartY);
    });
  }
}
