import Phaser from 'phaser';
import logoImg from '../../assets/logo.png';
import Entity from '../Entity';
import BodyComponent from '../components/BodyComponent';
import PhysicsSystem from '../systems/PhysicsSystem';
import MoveSystem from '../systems/MoveSystem';
import RenderComponent from '../components/RenderComponent';
import RenderSystem from '../systems/RenderSystem';

export default class MainScene extends Phaser.Scene {
  private systems: System[] = [new PhysicsSystem(this)];

  private entities: Entity[] = [];

  public constructor() {
    super({ key: 'MainScene' });
  }

  public preload(): void {
    this.load.image('logo', logoImg);
  }

  public create(): void {
    const entity = new Entity();
    entity.addComponent(new BodyComponent(new Phaser.Math.Vector2(100, 50)));
    entity.addComponent(new RenderComponent('logo'));
    this.entities.push(entity);

    const entity2 = new Entity();
    entity2.addComponent(new BodyComponent(new Phaser.Math.Vector2(300, 50)));
    entity2.addComponent(new RenderComponent('logo'));
    this.entities.push(entity2);
  }

  public update(time: number, delta: number): void {
    this.systems.forEach(s => {
      const entities = this.entities.filter(e => e.hasComponents(...s.expectedComponents));

      s.update(entities, delta);
    });
  }
}
