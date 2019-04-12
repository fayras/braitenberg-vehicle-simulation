import ComponentType from './types';

export default class SensorComponent implements Component {
  public name: ComponentType = ComponentType.SENSOR;

  private range: number;

  private angle: number;

  public position: Phaser.Physics.Matter.Matter.Vector;

  public constructor(offsetPos: Phaser.Physics.Matter.Matter.Vector, range: number, angle: number) {
    this.position = offsetPos;
    this.range = range;
    this.angle = angle;
  }
}
