import { ComponentType } from '../enums';
import Component from './Component';

export default class TransformableComponent extends Component {
  public name: ComponentType = ComponentType.TRANSFORMABLE;

  public position: Phaser.Physics.Matter.Matter.Vector;

  public angle: number;

  public constructor(pos: Phaser.Physics.Matter.Matter.Vector = { x: 0, y: 0 }) {
    super();
    this.position = pos;
    this.angle = 0;
  }

  public serialize(): string {
    const attributes = {
      position: this.position,
      angle: this.angle,
    };

    return JSON.stringify(attributes);
  }
}
