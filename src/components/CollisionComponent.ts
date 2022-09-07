import { ComponentType } from '../enums';
import { ECSComponent } from './ECSComponent';
import { Attribute } from './attributes/Attribute';

export class CollisionComponent extends ECSComponent {
  public label = 'Kollision';

  public type: ComponentType = ComponentType.COLLISION;

  public layer: Attribute<string>;

  public constructor(layer: string) {
    super();

    this.layer = new Attribute<string>(layer);
  }
}
