import System from './System';
import Entity from '../Entity';
import { ComponentType, EventType } from '../enums';
import RenderComponent from '../components/RenderComponent';
import TransformableComponent from '../components/TransformableComponent';
import EventBus from '../EventBus';
import SolidBodyComponent from '../components/SolidBodyComponent';
import Component from '../components/Component';

interface RenderObjectDictionary {
  [entityId: number]: Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle;
}

export default class RenderSystem extends System {
  public expectedComponents: ComponentType[] = [ComponentType.TRANSFORMABLE, ComponentType.RENDER];

  private renderObjects: RenderObjectDictionary = {};

  public update(): void {
    this.entities.forEach(entity => {
      const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
      const renderObject = this.renderObjects[entity.id];

      renderObject.setPosition(transform.position.get().x, transform.position.get().y);
      renderObject.setRotation(transform.angle.get());
    });
  }

  protected onEntityCreated(entity: Entity): void {
    const render = entity.getComponent(ComponentType.RENDER) as RenderComponent;

    render.asset.onChange(value => {
      this.onEntityDestroyed(entity);
      this.createImage(entity, render);
    });

    render.size.onChange(value => {
      const image = this.renderObjects[entity.id];
      const scale = value / image.width;
      image.setScale(scale);
    });

    this.createImage(entity, render);
  }

  protected createImage(entity: Entity, render: RenderComponent): void {
    const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
    const body = entity.getComponent(ComponentType.SOLID_BODY) as SolidBodyComponent;

    let image: Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle;
    if (body && typeof render.asset.get() === 'number') {
      image = this.scene.add.rectangle(
        transform.position.get().x,
        transform.position.get().y,
        body.size.get().width,
        body.size.get().height,
        render.asset.get() as number,
      );
    } else {
      image = this.scene.add.image(
        transform.position.get().x,
        transform.position.get().y,
        render.asset.get() as string,
      );
      const scale = render.size.get() / image.width;
      image.setScale(scale);
    }

    if (render.blendMode.get()) {
      image.setBlendMode(render.blendMode.get() as Phaser.BlendModes);
    }

    // Alles was man rendert, kann man auch verschieben. Macht es trotzdem
    // vielleicht Sinn eine eigene "DraggableComponent" zu erzeugen und
    // nur anhand dessen ein Objekt draggable zu machen oder nicht?
    image.setInteractive({ draggable: true });
    image.on('drag', (gameObject: unknown, x: number, y: number) => {
      transform.position.set({ x, y });
    });

    image.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const dragThreshold = 3;
      if (pointer.getDistance() > dragThreshold) {
        return;
      }

      EventBus.publish(EventType.ENTITY_SELECTED, entity);
    });

    this.renderObjects[entity.id] = image;
  }

  protected onEntityDestroyed(entity: Entity): void {
    const render = this.renderObjects[entity.id];

    render.destroy();
    delete this.renderObjects[entity.id];
  }

  protected onEntityComponentAdded(entity: Entity, component: Component): void {
    if (component.name !== ComponentType.RENDER) return;

    this.onEntityCreated(entity);
  }

  protected onEntityComponentRemoved(entity: Entity, component: Component): void {
    if (component.name !== ComponentType.RENDER) return;

    this.onEntityDestroyed(entity);
  }
}
