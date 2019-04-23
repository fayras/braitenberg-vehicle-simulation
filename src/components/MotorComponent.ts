import ComponentType from './types';

export default class MotorComponent implements Component {
  public name: ComponentType = ComponentType.MOTOR;

  public wheelbase: number;

  public maxSpeed: number;

  public constructor(wheelbase: number = 20, speed: number = 50) {
    this.wheelbase = wheelbase;
    this.maxSpeed = speed;
  }
}
