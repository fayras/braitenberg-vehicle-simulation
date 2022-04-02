import Phaser from 'phaser';
import { reaction } from 'mobx';
import { System } from './System';
import { EntityID, Entity } from '../Entity';
import { ComponentType } from '../enums';
import { SpriteComponent, Renderable } from '../components/SpriteComponent';
import { TransformableComponent } from '../components/TransformableComponent';
import { store as selectedEntityStore } from '../gui/_store/selectedEntity';

export class RenderSpriteSystem extends System {
  private disposers: IDisposable[] = [];

  private selected: EntityID | null = null;

  public constructor(scene: Phaser.Scene) {
    super(scene, [ComponentType.TRANSFORMABLE, ComponentType.RENDER], false);

    const disposableOnSelected = reaction(
      () => selectedEntityStore.selectedEntity,
      (entity) => {
        this.selected = entity?.id || null;
      },
    );

    this.disposers.push(disposableOnSelected);
  }

  public override internalUpdate(entities: ReadonlySet<Entity>, delta: number): void {
    entities.forEach((entity) => {
      const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
      const render = entity.getComponent(ComponentType.RENDER) as SpriteComponent;

      const renderable = render.renderableObject.value;
      if (!renderable) {
        return;
      }

      renderable.setTexture(render.asset.value);

      const scaleX = render.size.value.width / renderable.width;
      const scaleY = render.size.value.height === 0 ? scaleX : render.size.value.height / renderable.height;
      renderable.setScale(scaleX, scaleY);

      renderable.setPosition(transform.position.value.x, transform.position.value.y);

      renderable.setRotation(transform.angle.value);

      if (render.blendMode.value) {
        renderable.setBlendMode(render.blendMode.value);
      }

      renderable.setTint(0xffffff);
      const originalDepth = renderable.getData('originalDepth');
      if (originalDepth) {
        renderable.setDepth(originalDepth);
      }

      if (this.selected === entity.id) {
        renderable.setTint(0xddddff);
        renderable.setData('originalDepth', renderable.depth);
        renderable.setDepth(999);
      }
    });
  }

  protected override enter(entity: Entity): void {
    this.createRenderable(entity);
  }

  protected override exit(entity: Entity): void {
    RenderSpriteSystem.cleanUp(entity);
  }

  private createRenderable(entity: Entity): void {
    const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
    const render = entity.getComponent(ComponentType.RENDER) as SpriteComponent;

    const renderable: Renderable = this.scene.add.image(
      transform.position.value.x,
      transform.position.value.y,
      render.asset.value as string,
    );

    // Alles was man rendert, kann man auch verschieben. Macht es trotzdem
    // vielleicht Sinn eine eigene "DraggableComponent" zu erzeugen und
    // nur anhand dessen ein Objekt draggable zu machen oder nicht?
    RenderSpriteSystem.makeInteractable(renderable, transform, entity);

    render.renderableObject.value = renderable;
  }

  private static cleanUp(entity: Entity): void {
    const renderable = entity.getComponent<SpriteComponent>(ComponentType.RENDER)?.renderableObject;

    if (renderable?.value) {
      renderable.value.destroy();
      renderable.value = undefined;
    }
  }

  private static makeInteractable(renderable: Renderable, transform: TransformableComponent, entity: Entity): void {
    renderable.setInteractive({ draggable: true, useHandCursor: true });
    renderable.on('drag', (gameObject: unknown, x: number, y: number) => {
      transform.position.value = { x, y };
    });

    renderable.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const dragThreshold = 1;
      if (pointer.getDistance() <= dragThreshold) {
        selectedEntityStore.select(entity);
      }
    });
  }
}
