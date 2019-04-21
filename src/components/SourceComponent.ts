import ComponentType from './types';

enum SubstanceType {
  LIGHT = 'LIGHT',
}

export default class SourceComponent implements Component {
  public name: ComponentType = ComponentType.SOURCE;

  public range: number;

  public position: Phaser.Physics.Matter.Matter.Vector;

  public substance: SubstanceType;

  public constructor(
    offsetPos: Phaser.Physics.Matter.Matter.Vector,
    range: number,
    substance: SubstanceType = SubstanceType.LIGHT,
  ) {
    this.position = offsetPos;
    this.substance = substance;
    this.range = range;
  }
}
