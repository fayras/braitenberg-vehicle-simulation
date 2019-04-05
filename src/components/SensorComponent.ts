import ComponentType from './types';

export default class SensorComponent implements Component {
  public name: ComponentType = ComponentType.SENSOR;

  private range: number;

  private angle: number;

  public constructor(range: number, angle: number) {
    this.range = range;
    this.angle = angle;
  }
}
