import { multiply } from 'mathjs';
import System from './System';
import Entity from '../Entity';
import { ComponentType } from '../enums';
import ConnectionComponent from '../components/ConnectionComponent';
import MotorComponent from '../components/MotorComponent';
import SensorComponent from '../components/SensorComponent';

export default class ConnectionSystem extends System {
  public expectedComponents: ComponentType[] = [ComponentType.CONNECTION, ComponentType.MOTOR, ComponentType.SENSOR];

  public update(): void {
    this.entities.forEach(entity => {
      const connection = entity.getComponent(ComponentType.CONNECTION) as ConnectionComponent;
      const motors = entity.getMultipleComponents(ComponentType.MOTOR) as MotorComponent[];
      const sensors = entity.getMultipleComponents(ComponentType.SENSOR) as SensorComponent[];

      const inputs = connection.inputIds.map(id => {
        const sensor = sensors.find(s => s.id === id);
        return sensor ? sensor.activation.get() : 0;
      });

      const outputs = multiply(inputs, connection.weights);

      connection.outputIds.forEach((id, index) => {
        const motor = motors.find(m => m.id === id);
        if (motor) {
          motor.throttle.set(outputs[index]);
        }
      });
    });
  }
}
