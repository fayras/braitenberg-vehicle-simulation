import Phaser from 'phaser';
import Entity from '../Entity';
import { ComponentType, EventType } from '../enums';
import { CORRELATION_SCALE } from '../constants';
import SensorComponent from '../components/SensorComponent';
import TransformableComponent from '../components/TransformableComponent';
import System from './System';
import EventBus from '../EventBus';
import { gaussian } from '../utils/reactions';

export default class SensorSystem extends System {
  public expectedComponents: ComponentType[] = [ComponentType.SENSOR, ComponentType.TRANSFORMABLE];

  private textures: {
    [componentId: number]: {
      [angle: string]: Phaser.GameObjects.Image;
    };
  } = {};

  public update(): void {}

  protected onEntityCreated(entity: Entity): void {
    const sensors = entity.getMultipleComponents(ComponentType.SENSOR) as SensorComponent[];
    sensors.forEach(sensor => {
      this.addSensorObject(entity, sensor);
    });
  }

  protected onEntityDestroyed(entity: Entity): void {
    const sensors = entity.getMultipleComponents(ComponentType.SENSOR) as SensorComponent[];
    sensors.forEach(sensor => {
      const angleTextures = this.textures[sensor.id];
      Object.keys(angleTextures).forEach(key => {
        angleTextures[key].destroy();
      });
      delete this.textures[sensor.id];
    });
  }

  private addSensorObject(entity: Entity, sensor: SensorComponent): void {
    const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;

    const halfWidth = Math.ceil((sensor.range.get() * 2) / CORRELATION_SCALE);
    const halfHeight = Math.ceil((sensor.range.get() * 2) / CORRELATION_SCALE);
    const width = halfWidth * 2;
    const height = halfHeight * 2;

    const angleDelta = Math.PI / 2; // 45 Grad
    const angles = [];
    for (let a = 0; a < Math.PI * 2; a += angleDelta) {
      angles.push(a);
    }

    const gauss = gaussian({ x: 0, y: 0 }, { x: sensor.angle.get(), y: sensor.range.get() });
    const f = (x: number, y: number, rotation: number = 0): number => {
      // `atan2` ist für x = 0 und y = 0 nicht definiert.
      if (x === 0 && y === 0) return 1;

      const newX = Math.cos(-rotation) * x - Math.sin(-rotation) * y;
      const newY = Math.sin(-rotation) * x + Math.cos(-rotation) * y;

      const r = Math.sqrt(newX ** 2 + newY ** 2);
      const phi = Math.atan2(newX, newY);
      return gauss(phi, r);
    };

    const textures: { [angle: string]: Phaser.GameObjects.Image } = {};
    const values: { [angle: string]: Float32Array } = {};
    angles.forEach(angle => {
      const texture = this.scene.textures.createCanvas(`sensor_texture_${sensor.id}_${angle}`, width, height);
      const context = texture.getContext();
      const angleValues = new Float32Array(width * height);

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          let v = f((x - halfWidth) * CORRELATION_SCALE, (y - halfHeight) * CORRELATION_SCALE, angle);

          angleValues[y * width + x] = v;

          v = Math.round(v * 255);
          context.fillStyle = `rgb(${v}, ${0}, ${0})`;
          context.fillRect(x, y, 1, 1);
        }
      }

      // window.open(offScreenCanvas.toDataURL(), '_blank');
      // window.open(offScreenCanvasDown.toDataURL(), '_blank');

      texture.refresh();

      const x = transform.position.get().x + sensor.position.get().x;
      const y = transform.position.get().y + sensor.position.get().y;
      const image = this.scene.add.image(x, y, `sensor_texture_${sensor.id}_${angle}`);
      image.setScale(CORRELATION_SCALE);
      image.setBlendMode(Phaser.BlendModes.SCREEN);
      image.setVisible(false);

      textures[angle] = image;
      values[angle] = angleValues;
    });

    // window.open(offScreenCanvas.toDataURL(), '_blank');

    EventBus.publish(EventType.SENSOR_CREATED, {
      id: sensor.id,
      values,
      width,
      height,
    });
  }
}
