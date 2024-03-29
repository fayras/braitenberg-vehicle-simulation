import { matrix, multiply, subset, index as matrixIndex, range, resize, zeros } from 'mathjs';
import System from './System';
import Entity from '../Entity';
import { ComponentType } from '../enums';
import ConnectionComponent from '../components/ConnectionComponent';
import MotorComponent from '../components/MotorComponent';
import SensorComponent from '../components/SensorComponent';
import Component from '../components/Component';

export default class ConnectionSystem extends System {
  public expectedComponents: ComponentType[] = [ComponentType.CONNECTION, ComponentType.MOTOR, ComponentType.SENSOR];

  public update(): void {
    if (this.isPaused) return;

    this.entities.forEach((entity) => {
      const connection = entity.getComponent(ComponentType.CONNECTION) as ConnectionComponent;
      const motors = entity.getMultipleComponents(ComponentType.MOTOR) as MotorComponent[];
      const sensors = entity.getMultipleComponents(ComponentType.SENSOR) as SensorComponent[];

      const inputs = connection.network.get().inputIds.map((id) => {
        const sensor = sensors.find((s) => s.id === id);
        return sensor ? sensor.activation.get() : 0;
      });

      const outputs = multiply(inputs, connection.network.get().weights);

      connection.network.get().outputIds.forEach((id, index) => {
        const motor = motors.find((m) => m.id === id);
        if (motor) {
          let value = outputs[index];

          const neg = Math.sign(outputs[index]) === -1;
          if (neg) {
            value += 1;
          }

          motor.throttle.set(value);
        }
      });
    });
  }

  // eslint-disable-next-line
  protected onEntityComponentAdded(entity: Entity, component: Component): void {
    if (component.type !== ComponentType.MOTOR && component.type !== ComponentType.SENSOR) return;

    if (!entity.hasComponents(ComponentType.CONNECTION)) {
      return;
    }

    const connection = entity.getComponent(ComponentType.CONNECTION) as ConnectionComponent;
    const motors = entity.getMultipleComponents(ComponentType.MOTOR) as MotorComponent[];
    const sensors = entity.getMultipleComponents(ComponentType.SENSOR) as SensorComponent[];

    const m = matrix(connection.network.get().weights);
    const size = m.size();
    let { inputIds, outputIds } = connection.network.get();
    let weights;

    if (component.type === ComponentType.MOTOR) {
      // `size[1]` ist die Größe des "inneren" Arrays, das heißt ist size == 0, dann wissen
      // wir, dass keine Motoren davor verhanden waren, also müssen wir auch die Werte
      // für die Inputs neu anlegen und somit die gesamte Gewichtsmatrix.
      if (size[1] > 0) {
        weights = resize(m, [size[0], size[1] + 1]).toArray();
      } else {
        weights = zeros(sensors.length, 1).toArray();
      }
    }

    if (component.type === ComponentType.SENSOR) {
      if (size[1] > 0) {
        weights = resize(m, [size[0] + 1, size[1]]).toArray();
      } else {
        weights = zeros(1, motors.length).toArray();
      }
    }

    inputIds = sensors.map((sensor) => sensor.id);
    outputIds = motors.map((motor) => motor.id);

    connection.network.set({
      inputIds,
      outputIds,
      weights,
    });
  }

  // eslint-disable-next-line
  protected onEntityComponentRemoved(entity: Entity, component: Component): void {
    if (component.type !== ComponentType.MOTOR && component.type !== ComponentType.SENSOR) return;

    if (!entity.hasComponents(ComponentType.CONNECTION)) {
      return;
    }

    const connection = entity.getComponent(ComponentType.CONNECTION) as ConnectionComponent;
    const m = matrix(connection.network.get().weights);
    const size = m.size();
    let { inputIds, outputIds, weights } = connection.network.get();

    if (component.type === ComponentType.MOTOR) {
      const index = outputIds.findIndex((id) => id === component.id);
      const rows = range(0, size[0]).toArray();
      const cols = range(0, size[1]).toArray();

      cols.splice(index, 1);

      if (cols.length > 0) {
        weights = subset(m, matrixIndex(rows, cols)).toArray();
      } else {
        weights = [[]];
      }

      const motors = entity.getMultipleComponents(ComponentType.MOTOR) as MotorComponent[];
      outputIds = motors.map((motor) => motor.id);
    }

    if (component.type === ComponentType.SENSOR) {
      const index = inputIds.findIndex((id) => id === component.id);
      const rows = range(0, size[0]).toArray();
      const cols = range(0, size[1]).toArray();

      rows.splice(index, 1);

      if (rows.length > 0) {
        weights = subset(m, matrixIndex(rows, cols)).toArray();
      } else {
        weights = [[]];
      }

      const sensors = entity.getMultipleComponents(ComponentType.SENSOR) as SensorComponent[];
      inputIds = sensors.map((sensor) => sensor.id);
    }

    connection.network.set({
      inputIds,
      outputIds,
      weights,
    });
  }
}
