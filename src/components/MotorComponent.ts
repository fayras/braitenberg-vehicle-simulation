import { ComponentType } from '../enums';
import Component from './Component';
import Attribute from './Attribute';
import NumberInput from '../dynamic_input/NumberInput';
import PositionInput from '../dynamic_input/PositionInput';
import TextInput from '../dynamic_input/TextInput';

export default class MotorComponent extends Component {
  public name: ComponentType = ComponentType.MOTOR;

  public position: Attribute<Vector2D, PositionInput>;

  public defaultSpeed: Attribute<number, NumberInput>;

  public maxSpeed: Attribute<number, NumberInput>;

  public throttle: number;

  public visualThrottle: Attribute<string | number, TextInput>;

  public constructor(pos: Vector2D, speed: number = 50, defaultSpeed: number = 0) {
    super();
    this.position = new Attribute(pos, 'Position', PositionInput);
    this.maxSpeed = new Attribute(speed, 'Maximalgeschwindigkeit', NumberInput);
    this.defaultSpeed = new Attribute(defaultSpeed, 'Mindestgeschwindigkeit', NumberInput);
    this.throttle = 0;
    this.visualThrottle = new Attribute<string | number, TextInput>('0', 'Aktuelle Geschwindigkeit', TextInput);
  }

  public serializeAttributes(): object {
    return {
      position: this.position.get(),
      maxSpeed: this.maxSpeed.get(),
      defaultSpeed: this.defaultSpeed.get(),
    };
  }
}
