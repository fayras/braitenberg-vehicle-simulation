import Phaser from 'phaser';
import logoImg from '../../assets/logo.png';
import Entity from '../Entity';
import SolidBodyComponent from '../components/SolidBodyComponent';
import PhysicsSystem from '../systems/PhysicsSystem';
import RenderComponent from '../components/RenderComponent';
import MotorComponent from '../components/MotorComponent';
import SensorComponent from '../components/SensorComponent';
import SourceComponent from '../components/SourceComponent';
import TransformableComponent from '../components/TransformableComponent';

export default class MainScene extends Phaser.Scene {
  private systems: System[] = [];

  private entities: Entity[] = [];

  public constructor() {
    super({ key: 'MainScene' });
  }

  public preload(): void {
    this.load.image('logo', logoImg);
  }

  public create(): void {
    this.createSystems();

    this.matter.world.setBounds();

    for (let i = 0; i < 1; i += 1) {
      const entity = new Entity();
      entity.addComponent(new TransformableComponent({ x: 300, y: 100 }));
      entity.addComponent(new SolidBodyComponent());
      entity.addComponent(new RenderComponent('logo'));
      entity.addComponent(new SourceComponent(100));
      this.entities.push(entity);
    }

    const entity2 = new Entity();
    entity2.addComponent(new TransformableComponent({ x: 300, y: 100 }));
    entity2.addComponent(new SolidBodyComponent());
    entity2.addComponent(new RenderComponent('logo'));
    entity2.addComponent(new MotorComponent());
    entity2.addComponent(new SensorComponent({ x: 0, y: 25 }, 50, 0.7));
    entity2.addComponent(new SensorComponent({ x: 10, y: 25 }, 47, 0.7));
    entity2.addComponent(new SensorComponent({ x: 23, y: 25 }, 40, 0.7));
    this.entities.push(entity2);
  }

  private createSystems(): void {
    this.systems = [
      new PhysicsSystem(this),
      // new MoveSystem(),
      // new MotionSystem(this),
      // new RenderSystem(this),
    ];
  }

  public update(time: number, delta: number): void {
    this.systems.forEach(s => {
      const entities = this.entities.filter(e => e.hasComponents(...s.expectedComponents));

      s.update(entities, delta);
    });
  }
}
