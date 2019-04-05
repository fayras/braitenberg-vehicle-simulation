import Entity from '../Entity';
import ComponentType from '../components/types';
import PhysicsComponent from '../components/PhysicsComponent';
import RenderComponent from '../components/RenderComponent';

export default class RenderSystem implements System {
  public expectedComponents: ComponentType[] = [ComponentType.PHYSICS, ComponentType.RENDER];

  private scene: Phaser.Scene;

  private renderObjects: RenderObjectDictionary = {};

  public constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public update(entities: Entity[]): void {
    entities.forEach(entity => {
      if (!this.renderObjects[entity.id]) {
        this.addEntity(entity);
      }

      const physics = entity.getComponent(ComponentType.PHYSICS) as PhysicsComponent;
      const renderObject = this.renderObjects[entity.id];

      renderObject.setPosition(physics.position.x, physics.position.y);
    });
  }

  private addEntity(entity: Entity): void {
    const componentPhysics = entity.getComponent(ComponentType.PHYSICS) as PhysicsComponent;
    const componentRender = entity.getComponent(ComponentType.RENDER) as RenderComponent;
    this.renderObjects[entity.id] = this.scene.add.image(
      componentPhysics.position.x,
      componentPhysics.position.y,
      componentRender.asset,
    );
  }
}
