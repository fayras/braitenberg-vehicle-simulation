import { ComponentType } from '../enums';
import Component from './Component';
import Attribute from './RenderableAttribute';
import ConnectionNetwork from '../gui/Inputs/ConnectionNetwork';

export default class ConnectionComponent extends Component {
  public name: string = 'Verbingsnetzwerk';

  public type: ComponentType = ComponentType.CONNECTION;

  public network: Attribute<ConnectionComponentData, typeof ConnectionNetwork>;

  protected maxAmount: number = 1;

  public constructor(data: ConnectionComponentData) {
    super();

    this.network = new Attribute(data, ConnectionNetwork, { label: 'Verbindungen' });
  }
}
