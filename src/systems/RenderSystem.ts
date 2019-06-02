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

  public update(): void {
    this.entities.forEach(entity => {
      const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
      const renderObject = this.renderObjects[entity.id];

      renderObject.setPosition(transform.position.x, transform.position.y);
      renderObject.setRotation(transform.angle);
    });
  }

  protected onEntityCreated(entity: Entity): void {
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
    this.entities.push(entity);
  }

  protected onEntityDestroyed(entity: Entity): void {
    const render = this.renderObjects[entity.id];

    render.destroy();
    delete this.renderObjects[entity.id];

    const index = this.entities.findIndex(e => e.id === entity.id);
    if (index > -1) {
      this.entities.splice(index, 1);
    }
  }
}
