import Phaser from 'phaser';
import { System } from './System';
import { Entity } from '../Entity';
import { ComponentType, SubstanceType } from '../enums';
import { TransformableComponent } from '../components/TransformableComponent';
import { SensorComponent } from '../components/SensorComponent';
import { gaussian } from '../utils/reactions';
import { getWorldAngle, getWorldPosition } from '../utils/transform';

export class RenderSensorSystem extends System {
  public constructor(scene: Phaser.Scene) {
    super(scene, [ComponentType.TRANSFORMABLE, ComponentType.SENSOR], false);
  }

  public override internalUpdate(entities: ReadonlySet<Entity>, delta: number): void {
    entities.forEach((entity) => {
      const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
      const sensor = entity.getComponent(ComponentType.SENSOR) as SensorComponent;

      const renderable = sensor.renderableObject.value;
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
    const sensor = entity.getComponent(ComponentType.SENSOR) as SensorComponent;

    console.log('enter sensor', entity);
    this.createRenderable(entity, transform, sensor);

    // const updateTexture = (): void => {
    //   const renderable = this.renderables.get(sensor.id)!;
    // };
    //
    // this.renderableDisposers.set(entity.id, [autorun(updateTexture)]);
  }

  protected override exit(entity: Entity): void {
    const renderable = entity.getComponent<SensorComponent>(ComponentType.SENSOR)?.renderableObject;

    if (renderable?.value) {
      renderable.value.destroy();
      renderable.value = undefined;
    }
  }

  private createRenderable(entity: Entity, transform: TransformableComponent, sensor: SensorComponent): void {
    console.log('createRenderable sensor', entity, sensor);
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
    const values = new Float32Array(width * height);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const v = f(x - halfWidth, y - halfHeight);

        values[y * width + x] = v;

        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          context.fillStyle = `rgba(255, 0, 0, 0.5)`;
        } else if (x === halfWidth || y === halfHeight) {
          context.fillStyle = `rgba(0, 0, 255, 0.3)`;
        } else {
          context.fillStyle = `rgba(50, 50, 100, ${v * 0.6})`;
        }
        context.fillRect(x, y, 1, 1);
      }
    }

    texture.refresh();

    const position = getWorldPosition(entity, transform);

    const image = this.scene.matter.add.image(position.x, position.y, `sensor_texture_${sensor.id}`, undefined, {
      isSensor: true,
      collisionFilter: {
        mask: sensor.reactsTo.value,
      },
    });

    // image.setBlendMode(Phaser.BlendModes.SCREEN);
    image.setDepth(99);
    this.scene.children.bringToTop(image);

    sensor.renderableObject.value = image;
  }
}
