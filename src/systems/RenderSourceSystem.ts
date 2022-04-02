import Phaser from 'phaser';
import { System } from './System';
import { Entity } from '../Entity';
import { ComponentType, EmissionType, SubstanceType } from '../enums';
import { TransformableComponent } from '../components/TransformableComponent';
import { flatRect, gaussian } from '../utils/reactions';
import { getWorldAngle, getWorldPosition } from '../utils/transform';
import { SourceComponent } from '../components/SourceComponent';

export class RenderSourceSystem extends System {
  substanceColors: Map<SubstanceType, string> = new Map([[SubstanceType.BARRIER, '255,255,0']]);

  public constructor(scene: Phaser.Scene) {
    super(scene, [ComponentType.TRANSFORMABLE, ComponentType.SOURCE], false);
  }

  public override internalUpdate(entities: ReadonlySet<Entity>, delta: number): void {
    entities.forEach((entity) => {
      const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
      const source = entity.getComponent(ComponentType.SOURCE) as SourceComponent;

      const renderable = source.renderableObject.value;
      if (!renderable) {
        return;
      }

      const position = getWorldPosition(entity, transform);
      renderable.setPosition(position.x, position.y);

      const angle = getWorldAngle(entity, transform);
      renderable.setRotation(angle);
    });
  }

  protected override enter(entity: Entity): void {
    const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
    const source = entity.getComponent(ComponentType.SOURCE) as SourceComponent;

    console.log('enter sensor', entity);
    this.createRenderable(entity, transform, source);

    // TODO: Bie Änderungen an "range" oder "emissionType" Renderable anpassen.
  }

  protected override exit(entity: Entity): void {
    const renderable = entity.getComponent<SourceComponent>(ComponentType.SOURCE)?.renderableObject;

    if (renderable?.value) {
      renderable.value.destroy();
      renderable.value = undefined;
    }
  }

  private createRenderable(entity: Entity, transform: TransformableComponent, source: SourceComponent): void {
    const isGaussian = source.emissionType.value === EmissionType.GAUSSIAN;

    const width = source.range.value;
    const height = source.range.value;
    const texture = this.scene.textures.createCanvas(`source_texture_${source.id}`, width, height);
    const context = texture.getContext();

    // Das Ganze ggf in einem/mehreren Worker Thread(s) machen?
    // const values = new Float32Array(width * height);
    const position = getWorldPosition(entity, transform);
    const angle = getWorldAngle(entity, transform);

    const f = isGaussian
      ? gaussian({ x: width / 2, y: height / 2 }, { x: source.range.value / 5, y: source.range.value / 5 })
      : flatRect({ x: 0, y: 0 }, source.range.value, source.range.value, angle);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const v = f(x, y);
        // values[y * width + x] = v;

        if (source.substance.value === SubstanceType.BARRIER) {
          // v = Math.round(v * 255);
          context.fillStyle = `rgba(255, 0, 0, ${v / 2})`;
          context.fillRect(x, y, 1, 1);
        } else if (source.substance.value === SubstanceType.LIGHT) {
          // v = Math.round(v * 255);
          context.fillStyle = `rgba(255, 255, 0, ${v / 2})`;
          context.fillRect(x, y, 1, 1);
        }
      }
    }

    texture.refresh();
    const image = this.scene.matter.add.image(position.x, position.y, `source_texture_${source.id}`, undefined, {
      isSensor: true,
      collisionFilter: {
        category: source.substance.value,
      },
    });
    // image.setOrigin(0);
    image.setBlendMode(Phaser.BlendModes.HUE);
    image.setDepth(99);
    this.scene.children.bringToTop(image);

    source.renderableObject.value = image;
  }
}
