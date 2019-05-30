import { ComponentType, SensorActivation, SubstanceType } from '../enums';
import Component from './Component';

export default class SensorComponent extends Component {
  public name: ComponentType = ComponentType.SENSOR;

  public range: number;

  public angle: number;

  public position: Phaser.Physics.Matter.Matter.Vector;

  public activation: number = 0.0;

  public type: SensorActivation = SensorActivation.LINEAR;

  public reactsTo: SubstanceType;

  public constructor(
    offsetPos: Phaser.Physics.Matter.Matter.Vector,
    range: number,
    angle: number,
    reactsTo: SubstanceType = SubstanceType.LIGHT,
  ) {
    super();
    this.position = offsetPos;
    this.range = range;
    this.angle = angle;
    this.reactsTo = reactsTo;
  }
}
