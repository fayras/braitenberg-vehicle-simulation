import Phaser from 'phaser';
import ComponentType from './types';

export default class BodyComponent implements Component {
  public name: ComponentType = ComponentType.BODY;

  public body: Phaser.Physics.Matter.Matter.Body;

  public size = 50;

  public constructor(pos = new Phaser.Math.Vector2()) {
    this.body = Phaser.Physics.Matter.Matter.Bodies.rectangle(pos.x, pos.y, this.size, this.size);
  }
}
