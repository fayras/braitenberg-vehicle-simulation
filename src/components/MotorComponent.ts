import { ComponentType } from '../enums';

export default class MotorComponent implements Component {
  public name: ComponentType = ComponentType.MOTOR;

  public defaultSpeed: number;

  public maxSpeed: number;

  public constructor(speed: number = 50, defaultSpeed: number = 0) {
    this.maxSpeed = speed;
    this.defaultSpeed = defaultSpeed;
  }
}
