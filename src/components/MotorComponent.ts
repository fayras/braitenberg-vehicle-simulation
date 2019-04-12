import ComponentType from './types';

export default class MotorComponent implements Component {
  public name: ComponentType = ComponentType.MOTOR;

  public wheelbase: number;

  public constructor(wheelbase: number = 20) {
    this.wheelbase = wheelbase;
  }
}
