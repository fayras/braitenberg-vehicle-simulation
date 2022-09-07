import { ComponentType } from '../enums';
import { ECSComponent } from './ECSComponent';
import { RenderableAttribute } from './attributes/RenderableAttribute';
import { StringInput } from '../gui/Inputs/StringInput';

export class NameComponent extends ECSComponent {
  public label = 'Name';

  public type: ComponentType = ComponentType.NAME;

  public name: RenderableAttribute<string, typeof StringInput>;

  public constructor(name: string) {
    super();

    this.name = new RenderableAttribute(name, StringInput, { label: 'Name' });
  }
}
