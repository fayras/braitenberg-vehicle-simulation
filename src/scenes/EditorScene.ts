import Phaser from 'phaser';
import vehicleImg from '../../assets/vehicle.png';
import sensorImg from '../../assets/sensor.png';
import motorImg from '../../assets/motor.png';
import sourceImg from '../../assets/source_icon.png';
import EntityManager from '../EntityManager';
import TransformableComponent from '../components/TransformableComponent';
import SolidBodyComponent from '../components/SolidBodyComponent';
import RenderComponent from '../components/RenderComponent';
import SidebarScene from './SidebarScene';
import SourceComponent from '../components/SourceComponent';

type DropHandler = (position: { x: number; y: number }) => void;

export default class EditorScene extends SidebarScene {
  public constructor() {
    super('EditorScene');
  }

  public preload(): void {
    this.load.image('vehicle', vehicleImg);
    this.load.image('sensor', sensorImg);
    this.load.image('motor', motorImg);
    this.load.image('source_icon', sourceImg);
  }

  public onCreate(container: Phaser.GameObjects.Container): void {
    const vehicle = this.add.image(0, 0, 'vehicle');
    const source = this.add.image(0, 0, 'source_icon');
    const motor = this.add.image(0, 0, 'motor');
    const sensor = this.add.image(0, 0, 'sensor');

    this.makeInteractable(vehicle, () => {
      const position = { x: 0, y: 0 };
      container.getWorldTransformMatrix().transformPoint(vehicle.x, vehicle.y, position);

      EntityManager.createEntity(
        new TransformableComponent(position),
        new RenderComponent('logo', 100),
        new SolidBodyComponent(100),
      );
    });
    this.makeInteractable(source, position => {
      EntityManager.createEntity(
        new TransformableComponent(position),
        new RenderComponent('source', 100, Phaser.BlendModes.ADD),
        new SourceComponent(100),
      );
    });
    this.makeInteractable(motor, position => {});
    this.makeInteractable(sensor, position => {});

    this.pack([vehicle, source, motor, sensor]);
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
      const position = { x: 0, y: 0 };
      this.container.getWorldTransformMatrix().transformPoint(image.x, image.y, position);

      onDrop(position);

      console.log(x, y, image.x, image.y, dropped);
      image.setPosition(image.input.dragStartX, image.input.dragStartY);
    });
  }
}
