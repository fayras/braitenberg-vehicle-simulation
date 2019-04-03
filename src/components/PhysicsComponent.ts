import Phaser from 'phaser';
import ComponentType from './types';

export default class PhysicsComponent implements Component {
  public name: ComponentType = ComponentType.PHYSICS;

  public position: Phaser.Math.Vector2;

  public velocity: Phaser.Math.Vector2;

  public speed: number;

  public constructor() {
    this.position = new Phaser.Math.Vector2();
    this.velocity = new Phaser.Math.Vector2();
    this.speed = 0;
  }
}
