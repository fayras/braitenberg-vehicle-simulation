import { ComponentType } from '../enums';
import Component from './Component';

export default class ConnectionComponent extends Component {
  public name: ComponentType = ComponentType.CONNECTION;

  public weights: number[][];

  public inputIds: number[];

  public outputIds: number[];

  public constructor(inputIds: number[], outputIds: number[], weights: number[][]) {
    super();
    this.inputIds = inputIds;
    this.outputIds = outputIds;
    this.weights = weights;
  }
}
