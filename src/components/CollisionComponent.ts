import { ComponentType } from '../enums';
import { Component } from './Component';
import { Attribute } from './attributes/Attribute';

export class CollisionComponent extends Component {
  public label = 'Kollision';

  public type: ComponentType = ComponentType.COLLISION;

  public layer: Attribute<string>;

  public constructor(layer: string) {
    super();

    this.layer = new Attribute<string>(layer);
  }
}
