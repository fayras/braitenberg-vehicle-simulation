import { ComponentType } from '../enums';
import Component from './Component';
import Attribute from './Attribute';
import NumberInput from '../dynamic_input/NumberInput';

export default class MotorComponent extends Component {
  public name: ComponentType = ComponentType.MOTOR;

  public position: Attribute<Vector2D, NumberInput>;

  public defaultSpeed: Attribute<number, NumberInput>;

  public maxSpeed: Attribute<number, NumberInput>;

  public throttle: Attribute<number, NumberInput>;

  public constructor(pos: Vector2D, speed: number = 50, defaultSpeed: number = 0) {
    super();
    this.position = new Attribute(pos, 'Position', NumberInput);
    this.maxSpeed = new Attribute(speed, 'Max Speed', NumberInput);
    this.defaultSpeed = new Attribute(defaultSpeed, 'Default Speed', NumberInput);
    this.throttle = new Attribute(0, 'default speed', NumberInput);
  }

  public serializeAttributes(): object {
    return {
      position: this.position.get(),
      maxSpeed: this.maxSpeed.get(),
      defaultSpeed: this.defaultSpeed.get(),
    };
  }
}
