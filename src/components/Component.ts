import { v4 as uuidV4 } from 'uuid';
import { ComponentType } from '../enums';
import RenderableAttribute from './RenderableAttribute';

export type ComponentId = string;
type UnknownRenderableAttribute = RenderableAttribute<unknown, React.FunctionComponent<unknown>>;

function isRenderableAttribute(argument: unknown): argument is UnknownRenderableAttribute {
  return argument instanceof RenderableAttribute;
}

export default abstract class Component {
  // Hier wird einmal festgelegt, was für Typen die Klasse enthalten kann,
  // das ist nötig, damit später über diese mit `Object.keys(this)` drüber
  // iteriert werden kann.
  [key: string]: number | boolean | string | RenderableAttribute<any, any> | Function;

  public abstract type: ComponentType;

  public abstract name: string;

  public id: ComponentId;

  protected maxAmount: number = Infinity;

  protected deletable: boolean = true;

  protected infoTip: string = '';

  public constructor() {
    this.id = uuidV4();
  }

  public getMaxAmount(): number {
    return this.maxAmount;
  }

  public isDeletable(): boolean {
    return this.deletable;
  }

  public getInfo(): string {
    return this.infoTip;
  }

  public getRenderableAttributes(): UnknownRenderableAttribute[] {
    return Object.values(this).filter(isRenderableAttribute);
  }

  protected serializeAttributes(): any {
    const attrs: { [key: string]: any } = {};
    Object.keys(this).forEach((attr) => {
      if (this[attr] instanceof RenderableAttribute) {
        attrs[attr] = (this[attr] as RenderableAttribute<any, any>).get();
      }
    });

    return attrs;
  }

  public serialize(): SerializedComponent {
    const attributes = this.serializeAttributes();

    return {
      id: this.id,
      type: this.type,
      attributes,
    };
  }
}
