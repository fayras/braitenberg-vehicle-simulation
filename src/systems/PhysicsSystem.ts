import Entity from '../Entity';
import ComponentType from '../components/types';
import PhysicsComponent from '../components/PhysicsComponent';

export default class PhysicsSystem implements System {
  public expectedComponents: ComponentType[] = [ComponentType.PHYSICS];

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

      const component = entity.getComponent(ComponentType.PHYSICS) as PhysicsComponent;
      const physicsObject = this.physicsObjects[entity.id];

      physicsObject.setPosition(component.position.x, component.position.y);
      physicsObject.setVelocity(component.velocity.x, component.velocity.y);
    });
  }

  private addEntity(entity: Entity): void {
    const component = entity.getComponent(ComponentType.PHYSICS) as PhysicsComponent;
    this.physicsObjects[entity.id] = this.scene.physics.add.image(
      component.position.x,
      component.position.y,
      component.asset,
    );
  }
}
