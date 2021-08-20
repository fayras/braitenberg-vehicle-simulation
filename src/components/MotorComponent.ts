import { ComponentType } from '../enums';
import Component from './Component';
import Attribute from './RenderableAttribute';

import PositionInput from '../gui/Inputs/PositionInput';
import NumberInput from '../gui/Inputs/NumberInput';

interface MotorComponentData {
  position: Vector2D;
  maxSpeed?: number;
  defaultSpeed?: number;
}

export default class MotorComponent extends Component {
  public name: ComponentType = ComponentType.MOTOR;

  public position: Attribute<Vector2D, typeof PositionInput>;

  public defaultSpeed: Attribute<number, typeof NumberInput>;

  public maxSpeed: Attribute<number, typeof NumberInput>;

  public throttle: Attribute<number, typeof NumberInput>;

  public visualThrottle: Attribute<string | number, typeof NumberInput>;

  public constructor(data: MotorComponentData) {
    super();
    this.position = new Attribute(data.position, PositionInput, { label: 'Position' });

    this.maxSpeed = new Attribute(data.maxSpeed || 50, NumberInput, {
      label: 'Maximalgeschwindigkeit',
      min: 1,
      max: 50,
    });

    this.defaultSpeed = new Attribute(data.defaultSpeed || 0, NumberInput, {
      label: 'Mindestgeschwindigkeit',
      min: 0,
      max: this.maxSpeed.get(),
    });

    this.throttle = new Attribute(0);
    this.visualThrottle = new Attribute('0' as string | number, NumberInput, {
      label: 'Aktuelle Geschwindigkeit',
      readonly: true,
    });
  }
}
