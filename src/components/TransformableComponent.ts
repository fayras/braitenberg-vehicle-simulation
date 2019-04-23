import { ComponentType } from '../enums';

export default class TransformableComponent implements Component {
  public name: ComponentType = ComponentType.TRANSFORMABLE;

  public position: Phaser.Physics.Matter.Matter.Vector;

  public angle: number;

  public constructor(pos: Phaser.Physics.Matter.Matter.Vector = { x: 0, y: 0 }) {
    this.position = pos;
    this.angle = 0;
  }
}
