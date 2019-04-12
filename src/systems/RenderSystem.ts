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

      const body = entity.getComponent(ComponentType.BODY) as BodyComponent;
      const renderObject = this.renderObjects[entity.id];

      renderObject.setPosition(body.body.position.x, body.body.position.y);
      renderObject.setRotation(body.body.angle);
    });
  }

  private addEntity(entity: Entity): void {
    const body = entity.getComponent(ComponentType.BODY) as BodyComponent;
    const render = entity.getComponent(ComponentType.RENDER) as RenderComponent;

    this.renderObjects[entity.id] = this.scene.add.image(body.body.position.x, body.body.position.y, render.asset);
    this.renderObjects[entity.id].setDisplaySize(body.size + 30, body.size + 30);
  }
}
