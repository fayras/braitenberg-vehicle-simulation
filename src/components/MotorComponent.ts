import { ComponentType } from '../enums';
import Component from './Component';
import Attribute from './Attribute';
import NumberInput from '../dynamic_input/NumberInput';
import PositionInput from '../dynamic_input/PositionInput';
import TextInput from '../dynamic_input/TextInput';
import HiddenInput from '../dynamic_input/HiddenInput';

interface MotorComponentData {
  position: Vector2D;
  maxSpeed?: number;
  defaultSpeed?: number;
}

export default class MotorComponent extends Component {
  public name: ComponentType = ComponentType.MOTOR;

  public position: Attribute<Vector2D, PositionInput>;

  public defaultSpeed: Attribute<number, NumberInput>;

  public maxSpeed: Attribute<number, NumberInput>;

  public throttle: Attribute<number, HiddenInput>;

  public visualThrottle: Attribute<string | number, TextInput>;

  public constructor(data: MotorComponentData) {
    super();
    this.position = new Attribute(data.position, 'Position', PositionInput);
    this.maxSpeed = new Attribute(data.maxSpeed || 50, 'Maximalgeschwindigkeit', NumberInput);
    this.defaultSpeed = new Attribute(data.defaultSpeed || 0, 'Mindestgeschwindigkeit', NumberInput);
    this.throttle = new Attribute(0 as number, '', HiddenInput);
    this.visualThrottle = new Attribute<string | number, TextInput>('0', 'Aktuelle Geschwindigkeit', TextInput);
  }
}
