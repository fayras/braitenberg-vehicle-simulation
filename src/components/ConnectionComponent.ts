import { ComponentType } from '../enums';
import Component from './Component';
import Attribute from './Attribute';
import ConnectionNetwork from '../dynamic_input/ConnectionNetwork';

export default class ConnectionComponent extends Component {
  public name: ComponentType = ComponentType.CONNECTION;

  public network: Attribute<ConnectionNetworkData, ConnectionNetwork>;

  public constructor(inputIds: number[], outputIds: number[], weights: number[][]) {
    super();
    this.network = new Attribute(
      {
        inputs: inputIds,
        outputs: outputIds,
        weights,
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
