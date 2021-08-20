import { matrix, ones } from 'mathjs';

import { ComponentType } from '../enums';
import Component from './Component';
import Attribute from './RenderableAttribute';
import ConnectionNetwork from '../gui/Inputs/ConnectionNetwork';

interface ConnectionComponentData {
  inputIds: number[];
  outputIds: number[];
  weights?: number[][];
}

export default class ConnectionComponent extends Component {
  public name: ComponentType = ComponentType.CONNECTION;

  public network: Attribute<ConnectionComponentData, typeof ConnectionNetwork>;

  protected maxAmount: number = 1;

  public constructor(data: ConnectionComponentData) {
    super();

    let w: number[][];

    if (data.weights === undefined) {
      const m = matrix(ones(data.inputIds.length, data.outputIds.length).toArray());
      const dim = m.size().length;
      if (dim !== 2) {
        w = [[]];
      } else {
        w = m.toArray();
      }
    } else {
      w = data.weights;
    }

    const attributeData: ConnectionComponentData = {
      inputIds: data.inputIds,
      outputIds: data.outputIds,
      weights: w,
    };

    this.network = new Attribute(attributeData, ConnectionNetwork, { label: 'Verbindungen' });
  }

  public serializeAttributes(): ConnectionComponentData {
    return {
      inputIds: this.network.get().inputIds,
      outputIds: this.network.get().outputIds,
      weights: this.network.get().weights,
    };
  }
}
