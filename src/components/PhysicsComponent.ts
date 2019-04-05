import Phaser from 'phaser';
import ComponentType from './types';

export default class PhysicsComponent implements Component {
  public name: ComponentType = ComponentType.PHYSICS;

  public position: Phaser.Math.Vector2;

  public velocity: Phaser.Math.Vector2;

  public constructor(pos = new Phaser.Math.Vector2(), vel = new Phaser.Math.Vector2()) {
    this.position = pos;
    this.velocity = vel;
  }
}
