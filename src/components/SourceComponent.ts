import ComponentType from './types';

export default class SourceComponent implements Component {
  public name: ComponentType = ComponentType.SOURCE;

  public range: number;

  public position: Phaser.Physics.Matter.Matter.Vector;

  public constructor(offsetPos: Phaser.Physics.Matter.Matter.Vector, range: number) {
    this.position = offsetPos;
    this.range = range;
  }
}
