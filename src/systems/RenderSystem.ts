import Entity from '../Entity';
import ComponentType from '../components/types';
import BodyComponent from '../components/BodyComponent';
import RenderComponent from '../components/RenderComponent';

export default class RenderSystem implements System {
  public expectedComponents: ComponentType[] = [ComponentType.BODY, ComponentType.RENDER];

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

      const physics = entity.getComponent(ComponentType.BODY) as BodyComponent;
      const renderObject = this.renderObjects[entity.id];

      renderObject.setPosition(physics.body.position.x, physics.body.position.y);
    });
  }

  private addEntity(entity: Entity): void {
    const componentPhysics = entity.getComponent(ComponentType.BODY) as BodyComponent;
    const componentRender = entity.getComponent(ComponentType.RENDER) as RenderComponent;
    this.renderObjects[entity.id] = this.scene.add.image(
      componentPhysics.body.position.x,
      componentPhysics.body.position.y,
      componentRender.asset,
    );
  }
}
