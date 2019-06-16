import Phaser from 'phaser';
import { conv2d, squeeze, tidy, Tensor2D } from '@tensorflow/tfjs-core';
import System from './System';
import { ComponentType, EventType, CORRELATION_SCALE } from '../enums';
import EventBus from '../EventBus';

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

      const sensorComponent = sensor.userData.belongsTo.component;
      const sourceComponent = source.userData.belongsTo.component;
      const lookUpKey = `${sensorComponent.id}:${sourceComponent.id}`;

      if (!this.correlations[lookUpKey] && !this.computing[lookUpKey]) {
        this.computing[lookUpKey] = true;
        tidy(() => {
          const conv = squeeze<Tensor2D>(conv2d(source.userData.tensor, sensor.userData.tensors[0].tensor, 1, 'same'));
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
          sensorComponent.activation = 0;
          return;
        }

        const value = this.correlations[lookUpKey][y][x];
        sensorComponent.activation = value;
      }
    }
  }

  private static reactTogether(sensor: SensorPhysicsObject, source: SourcePhysicsObject): boolean {
    return sensor.userData.belongsTo.component.reactsTo === source.userData.belongsTo.component.substance;
  }
}
