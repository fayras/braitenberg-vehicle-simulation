import { ComponentType } from '../enums';

export default class MotorComponent implements Component {
  public name: ComponentType = ComponentType.MOTOR;

  public position: Phaser.Physics.Matter.Matter.Vector;

  public defaultSpeed: number;

  public maxSpeed: number;

  public constructor(pos: Phaser.Physics.Matter.Matter.Vector, speed: number = 50, defaultSpeed: number = 0) {
    this.position = pos;
    this.maxSpeed = speed;
    this.defaultSpeed = defaultSpeed;
  }
}
