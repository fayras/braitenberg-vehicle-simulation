import { ComponentType } from '../enums';
import { Component } from './Component';
import { RenderableAttribute } from './attributes/RenderableAttribute';
import { StringInput } from '../gui/Inputs/StringInput';

export class NameComponent extends Component {
  public label = 'Name';

  public type: ComponentType = ComponentType.NAME;

  public name: RenderableAttribute<string, typeof StringInput>;

  public constructor(name: string) {
    super();

    this.name = new RenderableAttribute(name, StringInput, { label: 'Name' });
  }
}
