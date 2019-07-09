import { ones } from 'mathjs';

import { ComponentType } from '../enums';
import Component from './Component';
import Attribute from './Attribute';
import ConnectionNetwork from '../dynamic_input/ConnectionNetwork';

export default class ConnectionComponent extends Component {
  public name: ComponentType = ComponentType.CONNECTION;

  public network: Attribute<ConnectionNetworkData, ConnectionNetwork>;

  protected maxAmount: number = 1;

  public constructor(inputIds: number[], outputIds: number[], weights: number[][] | undefined = undefined) {
    super();

    let w;

    if (weights === undefined) {
      w = ones(inputIds.length, outputIds.length).toArray();
    } else {
      w = weights;
    }

    this.network = new Attribute(
      {
        inputs: inputIds,
        outputs: outputIds,
        weights: w,
      },
      'Verbindungen',
      ConnectionNetwork,
    );
  }

  public serializeAttributes(): object {
    return {
      inputIds: this.network.get().inputs,
      outputIds: this.network.get().outputs,
      weights: this.network.get().weights,
    };
  }
}
