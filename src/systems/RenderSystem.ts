import Phaser from 'phaser';
import System from './System';
import { EntityID, Entity } from '../Entity';
import { ComponentType } from '../enums';
import RenderComponent from '../components/RenderComponent';
import TransformableComponent from '../components/TransformableComponent';
import { store as selectedEntityStore } from '../gui/_store/selectedEntity';
import { autorun, reaction, IReactionDisposer } from 'mobx';

type Renderable = Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle;

export class RenderSystem extends System {
  private renderables: Map<EntityID, Renderable> = new Map();

  private renderableDisposers: Map<EntityID, IReactionDisposer[]> = new Map();

  private globalDisposers: IDisposable[] = [];

  private selected: EntityID | null = null;

  public constructor(scene: Phaser.Scene) {
    super(scene, [ComponentType.TRANSFORMABLE, ComponentType.RENDER], false);

    const disposableOnSelected = reaction(
      () => selectedEntityStore.selectedEntity,
      (entity) => {
        this.selected = entity?.id || null;
      },
    );

    this.globalDisposers.push(disposableOnSelected);
  }

  public override internalUpdate(entities: ReadonlySet<Entity>, delta: number): void {
    entities.forEach((entity) => {
      this.setHighlight(entity);
    });
  }

  protected override enter(entity: Entity) {
    console.log(entity.serialize());
    this.createRenderable(entity);

    const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
    const render = entity.getComponent(ComponentType.RENDER) as RenderComponent;

    const updateTexture = (): void => {
      const renderable = this.renderables.get(entity.id)!;
      (renderable as Phaser.GameObjects.Image).setTexture(render.asset.value as string);
    };

    const updateScale = () => {
      const renderable = this.renderables.get(entity.id)!;
      const scaleX = render.size.value.width / renderable.width;
      const scaleY = render.size.value.height === 0 ? scaleX : render.size.value.height / renderable.height;
      renderable.setScale(scaleX, scaleY);
    };

    const updatePosition = () => {
      const renderable = this.renderables.get(entity.id)!;
      renderable.setPosition(transform.position.value.x, transform.position.value.y);
    };

    const updateRotation = () => {
      const renderable = this.renderables.get(entity.id)!;
      renderable.setRotation(transform.angle.value);
    };

    const updateBlendMode = () => {
      const renderable = this.renderables.get(entity.id)!;
      if (render.blendMode.value) {
        renderable.setBlendMode(render.blendMode.value);
      }
    };

    this.renderableDisposers.set(entity.id, [
      autorun(updateTexture),
      autorun(updateScale),
      autorun(updatePosition),
      autorun(updateRotation),
      autorun(updateBlendMode),
    ]);
  }

  protected override exit(entity: Entity) {
    this.cleanUp(entity);
    this.renderableDisposers.get(entity.id)?.forEach((disposer) => disposer());
  }

  private createRenderable(entity: Entity) {
    if (this.renderables.has(entity.id)) {
      return;
    }

    const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
    const render = entity.getComponent(ComponentType.RENDER) as RenderComponent;

    console.log(entity, transform, render);
    console.log(this.query.entities);

    const renderable: Renderable = this.scene.add.image(
      transform.position.value.x,
      transform.position.value.y,
      render.asset.value as string,
    );

    // Alles was man rendert, kann man auch verschieben. Macht es trotzdem
    // vielleicht Sinn eine eigene "DraggableComponent" zu erzeugen und
    // nur anhand dessen ein Objekt draggable zu machen oder nicht?
    this.makeInteractable(renderable, transform, entity);

    this.renderables.set(entity.id, renderable);
  }

  private cleanUp(entity: Entity) {
    const renderable = this.renderables.get(entity.id);

    if (renderable) {
      renderable.destroy();
      this.renderables.delete(entity.id);
    }
  }

  private makeInteractable(renderable: Renderable, transform: TransformableComponent, entity: Entity) {
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

  private setHighlight(entity: Entity) {
    const renderable = this.renderables.get(entity.id)!;

    (renderable as Phaser.GameObjects.Image).setTint(0xffffff);
    const originalDepth = renderable.getData('originalDepth');
    if (originalDepth) {
      renderable.setDepth(originalDepth);
    }
    if (this.selected === entity.id) {
      (renderable as Phaser.GameObjects.Image).setTint(0xddddff);
      renderable.setData('originalDepth', renderable.depth);
      renderable.setDepth(999);
    }
  }
}
