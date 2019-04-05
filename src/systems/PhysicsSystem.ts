import Phaser from 'phaser';
import Entity from '../Entity';
import ComponentType from '../components/types';
import BodyComponent from '../components/BodyComponent';

export default class PhysicsSystem implements System {
  public expectedComponents: ComponentType[] = [ComponentType.BODY];

  private scene: Phaser.Scene;

  private physicsObjects: PhysicsObjectDictionary = {};

  public constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public update(entities: Entity[], delta: number): void {
    entities.forEach(entity => {
      if (!this.physicsObjects[entity.id]) {
        this.addEntity(entity);
      }

      const component = entity.getComponent(ComponentType.BODY) as BodyComponent;
      const x = Phaser.Math.FloatBetween(-1, 1);
      const y = Phaser.Math.FloatBetween(-1, 1);
      Phaser.Physics.Matter.Matter.Body.setVelocity(component.body, {x, y});
    });
  }

  private addEntity(entity: Entity): void {
    const component = entity.getComponent(ComponentType.BODY) as BodyComponent;
    this.scene.matter.world.add(component.body);
    this.physicsObjects[entity.id] = true;
  }
}
