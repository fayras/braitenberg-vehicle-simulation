import ComponentType from './types';

export default class SensorComponent implements Component {
  public name: ComponentType = ComponentType.SENSOR;

  public range: number;

  public angle: number;

  public position: Phaser.Physics.Matter.Matter.Vector;

  public activation: number = 0.0;

  public constructor(offsetPos: Phaser.Physics.Matter.Matter.Vector, range: number, angle: number) {
    this.position = offsetPos;
    this.range = range;
    this.angle = angle;
  }
}
