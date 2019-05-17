import { ComponentType } from '../enums';

export default class TransformableComponent extends Comment {
  public name: ComponentType = ComponentType.TRANSFORMABLE;

  public position: Phaser.Physics.Matter.Matter.Vector;

  public angle: number;

  public constructor(pos: Phaser.Physics.Matter.Matter.Vector = { x: 0, y: 0 }) {
    super();
    this.position = pos;
    this.angle = 0;
  }
}
