import Phaser from 'phaser';
import ComponentType from './types';

export default class BodyComponent implements Component {
  public name: ComponentType = ComponentType.BODY;

  public body: Phaser.Physics.Matter.Matter.Body;

  public constructor(pos = new Phaser.Math.Vector2()) {
    this.body = Phaser.Physics.Matter.Matter.Bodies.circle(pos.x, pos.y, 20);
  }
}
