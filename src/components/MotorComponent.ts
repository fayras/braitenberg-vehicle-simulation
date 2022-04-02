import { ComponentType } from '../enums';
import { Component } from './Component';
import { RenderableAttribute } from './attributes/RenderableAttribute';

import { NumberInput } from '../gui/Inputs/NumberInput';

interface MotorComponentData {
  maxSpeed?: number;
  defaultSpeed?: number;
}

export class MotorComponent extends Component {
  public label = 'Motor';

  public type: ComponentType = ComponentType.MOTOR;

  public defaultSpeed: RenderableAttribute<number, typeof NumberInput>;

  public maxSpeed: RenderableAttribute<number, typeof NumberInput>;

  public throttle: RenderableAttribute<number, typeof NumberInput>;

  public constructor(data: MotorComponentData) {
    super();

    this.maxSpeed = new RenderableAttribute(data.maxSpeed || 50, NumberInput, {
      label: 'Maximalgeschwindigkeit',
      min: 1,
      max: 50,
    });

    this.defaultSpeed = new RenderableAttribute(data.defaultSpeed || 0, NumberInput, {
      label: 'Mindestgeschwindigkeit',
      min: 0,
      max: this.maxSpeed.value,
    });

    this.throttle = new RenderableAttribute(0, NumberInput, {
      label: 'Aktuelle Geschwindigkeit',
      readonly: true,
    });
  }
}
