import System from './System';
import Entity from '../Entity';
import { ComponentType } from '../enums';
import RenderComponent from '../components/RenderComponent';
import TransformableComponent from '../components/TransformableComponent';

interface RenderObjectDictionary {
  [entityId: number]: Phaser.GameObjects.Image;
}

export default class RenderSystem extends System {
  public expectedComponents: ComponentType[] = [ComponentType.TRANSFORMABLE, ComponentType.RENDER];

  private renderObjects: RenderObjectDictionary = {};

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

    const image = this.scene.add.image(transform.position.x, transform.position.y, render.asset);
    const scale = render.size / image.width;
    image.setScale(scale);
    if (render.blendMode) {
      image.setBlendMode(render.blendMode);
    }

    // Alles was man rendert, kann man auch verschieben. Macht es trotzdem
    // vielleicht Sinn eine eigene "DraggableComponent" zu erzeugen und
    // nur anhand dessen ein Objekt draggable zu machen oder nicht?
    image.setInteractive({ draggable: true });
    image.on('drag', (gameObject: unknown, x: number, y: number) => {
      transform.position.x = x;
      transform.position.y = y;
    });

    this.renderObjects[entity.id] = image;
  }
}
