import Entity from '../Entity';
import { ComponentType } from '../enums';
import RenderComponent from '../components/RenderComponent';
import TransformableComponent from '../components/TransformableComponent';

interface RenderObjectDictionary {
  [entityId: number]: Phaser.GameObjects.Image;
}

export default class RenderSystem implements System {
  public expectedComponents: ComponentType[] = [ComponentType.TRANSFORMABLE, ComponentType.RENDER];

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

      const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
      const renderObject = this.renderObjects[entity.id];

      renderObject.setPosition(transform.position.x, transform.position.y);
      renderObject.setRotation(transform.angle);
    });
  }

  private addEntity(entity: Entity): void {
    const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
    const render = entity.getComponent(ComponentType.RENDER) as RenderComponent;

    this.renderObjects[entity.id] = this.scene.add.image(transform.position.x, transform.position.y, render.asset);
    this.renderObjects[entity.id].setDisplaySize(render.width, render.height || render.width);
  }
}
