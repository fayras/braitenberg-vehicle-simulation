import { ComponentType } from '../enums';
import Component from './Component';

export default class MotorComponent extends Component {
  public name: ComponentType = ComponentType.MOTOR;

  public position: Phaser.Physics.Matter.Matter.Vector;

  public defaultSpeed: number;

  public maxSpeed: number;

  public throttle: number = 0;

  public constructor(pos: Phaser.Physics.Matter.Matter.Vector, speed: number = 50, defaultSpeed: number = 0) {
    super();
    this.position = pos;
    this.maxSpeed = speed;
    this.defaultSpeed = defaultSpeed;
  }

  public serializeAttributes(): object {
    return {
      position: this.position,
      maxSpeed: this.maxSpeed,
      defaultSpeed: this.defaultSpeed,
    };
  }
}
