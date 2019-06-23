import Phaser from 'phaser';
import { debounce } from 'lodash-es';
import { conv2d, squeeze, tidy, Tensor2D, tensor4d, keep } from '@tensorflow/tfjs-core';
import System from './System';
import { ComponentType, EventType, SubstanceType } from '../enums';
import { CORRELATION_SCALE } from '../constants';
import EventBus from '../EventBus';
import TransformableComponent from '../components/TransformableComponent';
import SensorComponent from '../components/SensorComponent';
import { AVAILABLE_ANGLES } from '../utils/reactions';

const mod = (x: number, n: number): number => ((x % n) + n) % n;

export default class ReactionSystem extends System {
  public expectedComponents: ComponentType[] = [ComponentType.TRANSFORMABLE, ComponentType.SENSOR];

  private sensors: { [id: number]: EventMessages.NewSensorInfo } = {};

  private sources: { [id: number]: EventMessages.NewSourceInfo } = {};

  private correlations: { [sensorAnglePair: string]: number[][] } = {};

  private sourcesCombined: Float32Array = new Float32Array();

  private width: number = 0;

  private height: number = 0;

  // private compute: (type: SubstanceType) => void;

  public constructor(scene: Phaser.Scene) {
    super(scene);

    EventBus.subscribe(EventType.SENSOR_CREATED, this.onSensorCreated.bind(this));
    EventBus.subscribe(EventType.SOURCE_CREATED, this.onSourceCreated.bind(this));
  }

  public update(): void {
    this.entities.forEach(entity => {
      const transform = entity.getComponent(ComponentType.TRANSFORMABLE) as TransformableComponent;
      const sensors = entity.getMultipleComponents(ComponentType.SENSOR) as SensorComponent[];

      const currentAngle = mod(transform.angle.get(), Math.PI * 2);
      const closestAngle = AVAILABLE_ANGLES.reduce((prev, curr) => {
        return Math.abs(curr - currentAngle) < Math.abs(prev - currentAngle) ? curr : prev;
      });

      sensors.forEach(sensor => {
        const lookUpKey = `${sensor.id}:${closestAngle}`;

        if (!this.correlations[lookUpKey]) {
          return;
        }

        const bodyPosition = transform.position.get();
        const sensorOffset = sensor.position.get();
        const x = Math.floor((bodyPosition.x + sensorOffset.x) / CORRELATION_SCALE);
        const y = Math.floor((bodyPosition.y + sensorOffset.y) / CORRELATION_SCALE);

        if (!this.correlations[lookUpKey][y] || !this.correlations[lookUpKey][y][x]) {
          return;
        }

        const value = this.correlations[lookUpKey][y][x];
        sensor.activation.set(value);
      });
    });
  }

  private computeCorrelation(type: SubstanceType): void {
    const sensors = Object.values(this.sensors).filter(s => s.type === type);

    const { width, height } = this;

    console.log('computeCorrelation', sensors, type);
    sensors.forEach(sensor => {
      Object.entries(sensor.values).forEach(([angle, angleValues]) => {
        const lookUpKey = `${sensor.id}:${angle}`;

        tidy(() => {
          console.log('tidy', angle);
          const sensorTensor = tensor4d(angleValues, [sensor.height, sensor.width, 1, 1]);
          const sourcesTensor = tensor4d(this.sourcesCombined, [1, height, width, 1]);

          const conv = keep(squeeze<Tensor2D>(conv2d(sourcesTensor, sensorTensor, 1, 'same')));

          // conv.array().then(res => {
          //   console.log('gotResult');
          //   this.correlations[lookUpKey] = res;
          // });
          const maxTensor = conv.max();
          maxTensor.data().then(value => {
            tidy(() => {
              const max = value[0];
              const result = conv.div<Tensor2D>(max);
              result.array().then(res => {
                console.log('gotResult');
                this.correlations[lookUpKey] = res;
                conv.dispose();
              });
            });
          });
        });
      });
    });
  }

  private onSourceCreated(payload: EventMessages.NewSourceInfo): void {
    this.sources[payload.id] = payload;

    const combined = new Float32Array(payload.width * payload.height);
    const sources = Object.values(this.sources).filter(s => s.type === payload.type);

    for (let i = 0; i < payload.values.length; i += 1) {
      const sum = sources.reduce((acc, source) => {
        if (source.values[i] !== undefined) {
          return Math.max(acc, source.values[i]);
        }

        return acc;
      }, 0);
      combined[i] = sum;
    }

    this.sourcesCombined = combined;
    this.width = payload.width;
    this.height = payload.height;
    console.log('compute from source');
    this.computeCorrelation(payload.type);
  }

  private onSensorCreated(payload: EventMessages.NewSensorInfo): void {
    console.log('onSensorCreated');
    this.sensors[payload.id] = payload;
    console.log('compute from sensor');
    this.computeCorrelation(payload.type);
  }

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
        return Math.abs(curr - currentAngle) < Math.abs(prev - currentAngle) ? curr : prev;
      });

      // console.log(transform.angle.get(), currentAngle, closestAngle);

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
