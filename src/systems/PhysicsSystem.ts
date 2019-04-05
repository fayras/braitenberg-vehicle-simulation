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

      physicsObject.position.x = component.position.x;
      physicsObject.position.y = component.position.y;
    });
  }

  private addEntity(entity: Entity): void {
    const component = entity.getComponent(ComponentType.PHYSICS) as PhysicsComponent;
    this.physicsObjects[entity.id] = this.scene.matter.add.circle(
      component.position.x,
      component.position.y,
      20,
      {},
      10,
    ) as Matter.Body;
  }
}
