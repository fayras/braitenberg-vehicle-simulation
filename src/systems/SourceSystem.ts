import { debounce } from 'lodash-es';
import Phaser from 'phaser';
import Entity from '../Entity';
import { ComponentType, EmissionType, EventType, SubstanceType } from '../enums';
import { CORRELATION_SCALE } from '../constants';
import System from './System';
import TransformableComponent from '../components/TransformableComponent';
import SourceComponent from '../components/SourceComponent';
import { gaussian, flatRect } from '../utils/reactions';
import SolidBodyComponent from '../components/SolidBodyComponent';
import EventBus from '../EventBus';
import Component from '../components/Component';

export default class SourceSystem extends System {
  public expectedComponents: ComponentType[] = [ComponentType.SOURCE, ComponentType.TRANSFORMABLE];

  private textures: {
    [componentId: number]: Phaser.GameObjects.Image;
  } = {};

  public update(): void {}

  protected onEntityCreated(entity: Entity): void {
    const sources = entity.getMultipleComponents(ComponentType.SOURCE) as SourceComponent[];
    const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
    sources.forEach(source => {
      this.addSourceObject(entity, source);

      source.emissionType.onChange(() => {
        this.removeSourceObject(source);
        this.addSourceObject(entity, source);
      });

      source.range.onChange(() => {
        this.removeSourceObject(source);
        this.addSourceObject(entity, source);
      });

      // Theoretisch wäre es auch notwendig auf das "Change" Event der Tansformable Komponente
      // zu hören und die Quelle entsprechend zu verschieben, aber das ist dann zu aufwändig,
      // da sonst die ganzen Korrelationen neu berechnet werden müssen.
      transform.position.onChange(
        debounce(() => {
          this.removeSourceObject(source);
          this.addSourceObject(entity, source);
        }, 200),
      );
      transform.angle.onChange(
        debounce(() => {
          this.removeSourceObject(source);
          this.addSourceObject(entity, source);
        }, 200),
      );
    });
  }

  protected onEntityDestroyed(entity: Entity): void {
    const sources = entity.getMultipleComponents(ComponentType.SOURCE) as SourceComponent[];
    sources.forEach(source => {
      this.removeSourceObject(source);
    });
  }

  protected onEntityComponentAdded(entity: Entity, component: Component): void {
    if (component.name !== ComponentType.SOURCE) return;

    const source = component as SourceComponent;
    this.addSourceObject(entity, source);

    source.emissionType.onChange(() => {
      this.removeSourceObject(source);
      this.addSourceObject(entity, source);
    });

    source.range.onChange(() => {
      this.removeSourceObject(source);
      this.addSourceObject(entity, source);
    });

    // Theoretisch wäre es auch notwendig auf das "Change" Event der Tansformable Komponente
    // zu hören und die Quelle entsprechend zu verschieben, aber das ist dann zu aufwändig,
    // da sonst die ganzen Korrelationen neu berechnet werden müssen.
    const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
    transform.position.onChange(
      debounce(() => {
        this.removeSourceObject(source);
        this.addSourceObject(entity, source);
      }, 200),
    );
    transform.angle.onChange(
      debounce(() => {
        this.removeSourceObject(source);
        this.addSourceObject(entity, source);
      }, 200),
    );
  }

  protected onEntityComponentRemoved(entity: Entity, component: Component): void {
    if (component.name !== ComponentType.SOURCE) return;

    this.removeSourceObject(component as SourceComponent);
  }

  private addSourceObject(entity: Entity, source: SourceComponent): void {
    const isGaussian = source.emissionType.get() === EmissionType.GAUSSIAN;
    const solidBody = entity.getComponent(ComponentType.SOLID_BODY) as SolidBodyComponent | undefined;

    const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;

    // const { width, height } = this.scene.cameras.main;
    const width = Math.ceil(this.scene.cameras.main.width / CORRELATION_SCALE);
    const height = Math.ceil(this.scene.cameras.main.height / CORRELATION_SCALE);

    // const offScreenCanvas = getCanvas(width, height);
    // const context = getContext(offScreenCanvas);
    const texture = this.scene.textures.createCanvas(`source_texture_${source.id}`, width, height);
    const context = texture.getContext();

    // Das Ganze ggf in einem/mehreren Worker Thread(s) machen?
    const values = new Float32Array(width * height);
    const f = isGaussian
      ? gaussian(transform.position.get(), { x: source.range.get(), y: source.range.get() })
      : flatRect(
          Phaser.Physics.Matter.Matter.Vector.sub(transform.position.get(), {
            x: (solidBody ? solidBody.size.get().width : source.range.get()) / 2,
            y: (solidBody ? solidBody.size.get().height : source.range.get()) / 2,
          }),
          solidBody ? solidBody.size.get().width : source.range.get(),
          solidBody ? solidBody.size.get().height : source.range.get(),
          transform.angle.get(),
        );

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        let v = f(x * CORRELATION_SCALE, y * CORRELATION_SCALE);
        values[y * width + x] = v;

        if (source.substance.get() === SubstanceType.BARRIER) {
          v = Math.round(v * 255);
          context.fillStyle = `rgb(${v}, ${0}, ${0})`;
          context.fillRect(x, y, 1, 1);
        } else if (source.substance.get() === SubstanceType.LIGHT) {
          v = Math.round(v * 255);
          context.fillStyle = `rgb(${v}, ${v}, ${0})`;
          context.fillRect(x, y, 1, 1);
        }
      }
    }

    texture.refresh();
    const image = this.scene.add.image(0, 0, `source_texture_${source.id}`);
    image.setOrigin(0);
    image.setScale(CORRELATION_SCALE);
    image.setBlendMode(Phaser.BlendModes.SCREEN);
    image.setDepth(99);
    this.scene.children.bringToTop(image);

    this.textures[source.id] = image;

    EventBus.publish(EventType.SOURCE_CREATED, {
      id: source.id,
      values,
      type: source.substance.get(),
      width,
      height,
    });
  }

  private removeSourceObject(source: SourceComponent): void {
    EventBus.publish(EventType.SOURCE_DESTROYED, {
      id: source.id,
      type: source.substance.get(),
    });

    if (!this.textures[source.id]) return;

    this.textures[source.id].destroy();
    this.scene.textures.remove(`source_texture_${source.id}`);
    delete this.textures[source.id];
  }
}
