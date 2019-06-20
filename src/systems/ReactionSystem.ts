import Phaser from 'phaser';
import { conv2d, squeeze, tidy, Tensor2D } from '@tensorflow/tfjs-core';
import System from './System';
import { ComponentType, EventType } from '../enums';
import { CORRELATION_SCALE } from '../constants';
import EventBus from '../EventBus';
import TransformableComponent from '../components/TransformableComponent';

const mod = (x: number, n: number): number => ((x % n) + n) % n;

export default class ReactionSystem extends System {
  public expectedComponents: ComponentType[] = [];

  private correlations: { [pair: string]: number[][] } = {};

  private computing: { [pair: string]: boolean } = {};

  public constructor(scene: Phaser.Scene) {
    super(scene);

    EventBus.subscribe(EventType.REACTION, this.handleReaction.bind(this));
  }

  public update(): void {}

  protected onEntityCreated(): void {}

  protected onEntityDestroyed(): void {}

  private handleReaction(payload: EventMessages.Reaction): void {
    if (payload.other.label === ComponentType.SOURCE) {
      const source = payload.other as SourcePhysicsObject;
      const { sensor } = payload;
      if (!ReactionSystem.reactTogether(sensor, source)) return;

      const transform = sensor.userData.belongsTo.entity.getComponent(
        ComponentType.TRANSFORMABLE,
      ) as TransformableComponent;

      const availableAngles = sensor.userData.tensors.map(t => t.angle);
      const currentAngle = mod(transform.angle.get(), Math.PI * 2);

      const closestAngle = availableAngles.reduce((prev, curr) => {
        return Math.abs(curr - currentAngle) < Math.abs(prev - transform.angle.get()) ? curr : prev;
      });

      const sensorComponent = sensor.userData.belongsTo.component;
      const sourceComponent = source.userData.belongsTo.component;
      const lookUpKey = `${sensorComponent.id}:${sourceComponent.id}:${closestAngle}`;

      if (!this.correlations[lookUpKey] && !this.computing[lookUpKey]) {
        this.computing[lookUpKey] = true;
        tidy(() => {
          const sensorTensor = sensor.userData.tensors.find(t => t.angle === closestAngle);

          if (!sensorTensor) {
            console.warn(`could not find kernel for angle ${closestAngle}`);
            return;
          }

          const conv = squeeze<Tensor2D>(conv2d(source.userData.tensor, sensorTensor.tensor, 1, 'same'));
          const maxValue = conv.max().dataSync()[0];
          const result = conv.div<Tensor2D>(maxValue);
          result.array().then(value => {
            this.correlations[lookUpKey] = value;
            this.computing[lookUpKey] = false;
          });
        });
      }

      if (this.correlations[lookUpKey]) {
        const y = Math.floor(sensor.position.y / CORRELATION_SCALE);
        const x = Math.floor(sensor.position.x / CORRELATION_SCALE);

        if (!this.correlations[lookUpKey][y] || !this.correlations[lookUpKey][y][x]) {
          // sensorComponent.activation = sensorComponent.activation;
          return;
        }

        const value = this.correlations[lookUpKey][y][x];
        sensorComponent.activation.set(Math.max(value, sensorComponent.activation.get()));
      }
    }
  }

  private static reactTogether(sensor: SensorPhysicsObject, source: SourcePhysicsObject): boolean {
    return sensor.userData.belongsTo.component.reactsTo.get() === source.userData.belongsTo.component.substance.get();
  }
}
