import ComponentType from './types';

export default class SensorComponent implements Component {
  public name: ComponentType = ComponentType.SENSOR;

  private amount: number;

  private angle: number;

  public constructor(amount: number, angle: number) {
    this.amount = amount;
    this.angle = angle;
  }
}
