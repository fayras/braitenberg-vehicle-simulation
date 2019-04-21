import Phaser from 'phaser';
import logoImg from '../../assets/logo.png';
import Entity from '../Entity';
import BodyComponent from '../components/BodyComponent';
import PhysicsSystem from '../systems/PhysicsSystem';
import MoveSystem from '../systems/MoveSystem';
import RenderComponent from '../components/RenderComponent';
import RenderSystem from '../systems/RenderSystem';
import MotorComponent from '../components/MotorComponent';
import SensorComponent from '../components/SensorComponent';
import MotionSystem from '../systems/MotionSystem';
import SourceComponent from '../components/SourceComponent';

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
    this.createScenes();

    this.matter.world.setBounds();

    for (let i = 0; i < 1; i += 1) {
      const entity = new Entity();
      // entity.addComponent(new BodyComponent(new Phaser.Math.Vector2(300, 300)));
      entity.addComponent(new RenderComponent('logo'));
      entity.addComponent(new SourceComponent(new Phaser.Math.Vector2(300, 300), 100));
      this.entities.push(entity);
    }

    const entity2 = new Entity();
    entity2.addComponent(new BodyComponent(new Phaser.Math.Vector2(300, 50)));
    entity2.addComponent(new RenderComponent('logo'));
    entity2.addComponent(new MotorComponent());
    entity2.addComponent(new SensorComponent({ x: 0, y: 25 }, 50, 0.7));
    entity2.addComponent(new SensorComponent({ x: 10, y: 25 }, 47, 0.7));
    entity2.addComponent(new SensorComponent({ x: 23, y: 25 }, 40, 0.7));
    this.entities.push(entity2);
  }

  private createScenes(): void {
    this.systems = [
      new PhysicsSystem(this),
      new MoveSystem(),
      new MotionSystem(this),
      // new RenderSystem(this)
    ];
  }

  public update(time: number, delta: number): void {
    this.systems.forEach(s => {
      const entities = this.entities.filter(e => e.hasComponents(...s.expectedComponents));

      s.update(entities, delta);
    });
  }
}
