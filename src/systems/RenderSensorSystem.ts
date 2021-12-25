import Phaser from 'phaser';
import { autorun, reaction, IReactionDisposer } from 'mobx';
import System from './System';
import { Entity } from '../Entity';
import { ComponentType } from '../enums';
import RenderComponent from '../components/RenderComponent';
import TransformableComponent from '../components/TransformableComponent';
import { ComponentId } from '../components/Component';
import SensorComponent from '../components/SensorComponent';
import { gaussian } from '../utils/reactions';

type Renderable = Phaser.GameObjects.Image;

export class RenderSensorSystem extends System {
  private renderables: Map<ComponentId, Renderable> = new Map();

  private renderableDisposers: Map<ComponentId, IReactionDisposer[]> = new Map();

  public constructor(scene: Phaser.Scene) {
    super(scene, [ComponentType.TRANSFORMABLE, ComponentType.SENSOR], false);
  }

  public override internalUpdate(entities: ReadonlySet<Entity>, delta: number): void {
    entities.forEach((entity) => {

    });
  }

  protected override change(entity: Entity, added?: SensorComponent, removed?: SensorComponent) {
    if(added) {

    }

    if(removed) {

    }
  }

  protected override enter(entity: Entity) {
    const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
    const sensor = entity.getComponent(ComponentType.SENSOR) as SensorComponent;

    this.createRenderable(transform, sensor);

    const updateTexture = (): void => {
      const renderable = this.renderables.get(sensor.id)!;
      sensor.
    };

    this.renderableDisposers.set(entity.id, [
      autorun(updateTexture)
    ]);
  }

  protected override exit(entity: Entity) {
    this.cleanUp(entity);
    this.renderableDisposers.get(entity.id)?.forEach((disposer) => disposer());
  }

  private createRenderable(transform: TransformableComponent, sensor: SensorComponent) {
    if (this.renderables.has(sensor.id)) {
      return;
    }

    const halfWidth = Math.ceil(sensor.range.value * 3);
    const halfHeight = Math.ceil(sensor.range.value * 3);
    const width = halfWidth * 2;
    const height = halfHeight * 2;

    const gauss = gaussian({ x: 0, y: 0 }, { x: sensor.angle.value, y: sensor.range.value });
    const f = (x: number, y: number, rotation = 0): number => {
      // `atan2` ist für x = 0 und y = 0 nicht definiert.
      if (x === 0 && y === 0) return 1;

      const newX = Math.cos(-rotation) * x - Math.sin(-rotation) * y;
      const newY = Math.sin(-rotation) * x + Math.cos(-rotation) * y;

      const r = Math.sqrt(newX ** 2 + newY ** 2);
      const phi = Math.atan2(newX, newY);
      return gauss(phi, r);
    };

    const texture = this.scene.textures.createCanvas(`sensor_texture_${sensor.id}`, width, height);
    const context = texture.getContext();
    const angleValues = new Float32Array(width * height);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const v = f(x - halfWidth, y - halfHeight);

        angleValues[y * width + x] = v;

        context.fillStyle = `rgba(50, 50, 100, ${v * 0.6})`;
        context.fillRect(x, y, 1, 1);
      }
    }

    texture.refresh();

    const x = transform.position.value.x + sensor.position.value.x;
    const y = transform.position.value.y + sensor.position.value.y;
    const image = this.scene.add.image(x, y, `sensor_texture_${sensor.id}`);

    // image.setBlendMode(Phaser.BlendModes.SCREEN);
    image.setVisible(false);
    image.setDepth(99);
    this.scene.children.bringToTop(image);

    this.renderables.set(sensor.id, image);
  }

  private cleanUp(entity: Entity) {
    const renderable = this.renderables.get(entity.id);

    if (renderable) {
      renderable.destroy();
      this.renderables.delete(entity.id);
    }
  }
}
