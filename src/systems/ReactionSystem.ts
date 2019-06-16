import Phaser from 'phaser';
import { conv2d, squeeze, tidy, Tensor2D } from '@tensorflow/tfjs-core';
import System from './System';
import { ComponentType, EventType } from '../enums';
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
          console.log('conv: ', source.userData.tensor.shape, sensor.userData.tensors[0].tensor.shape);
          const conv = squeeze<Tensor2D>(conv2d(source.userData.tensor, sensor.userData.tensors[0].tensor, 1, 'same'));
          const maxValue = conv.max().dataSync()[0];
          // const normalized = localResponseNormalization(conv);
          const result = conv.div<Tensor2D>(maxValue);
          console.log(result.shape);
          result.array().then(value => {
            console.log(value);
            this.correlations[lookUpKey] = value;
            this.computing[lookUpKey] = false;
          });
        });
      }

      const SCALE = 3;
      if (this.correlations[lookUpKey]) {
        const x = Math.floor(sensor.position.x / SCALE);
        const y = Math.floor(sensor.position.y / SCALE);
        const value = this.correlations[lookUpKey][y][x];
        sensorComponent.activation = value;
      }

      // const distance = Phaser.Physics.Matter.Matter.Vector.sub(sensor.position, source.position);
      // const activation = source.userData.kernel(distance.x, distance.y);

      // sensor.userData.belongsTo.component.activation = activation;
    }
  }

  private static reactTogether(sensor: SensorPhysicsObject, source: SourcePhysicsObject): boolean {
    return sensor.userData.belongsTo.component.reactsTo === source.userData.belongsTo.component.substance;
  }
}
