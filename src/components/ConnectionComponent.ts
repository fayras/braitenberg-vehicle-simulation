import { ComponentType } from '../enums';
import { Component } from './Component';
import { RenderableAttribute } from './attributes/RenderableAttribute';
import { ConnectionNetwork } from '../gui/Inputs/ConnectionNetwork';

export class ConnectionComponent extends Component {
  public label = 'Verbingsnetzwerk';

  public type: ComponentType = ComponentType.CONNECTION;

  public network: RenderableAttribute<ConnectionComponentData, typeof ConnectionNetwork>;

  public constructor(data: ConnectionComponentData) {
    super();

    this.network = new RenderableAttribute(data, ConnectionNetwork, { label: 'Verbindungen' });
  }
}
