import { ComponentType } from '../enums';
import Attribute from './Attribute';

export default abstract class Component {
  [key: string]: any;

  public abstract name: ComponentType;

  public id: number;

  private static count = 0;

  protected maxAmount: number = Infinity;

  protected deletable: boolean = true;

  public constructor() {
    this.id = Component.count;
    Component.count += 1;
  }

  public getMaxAmount(): number {
    return this.maxAmount;
  }

  public isDeletable(): boolean {
    return this.deletable;
  }

  protected serializeAttributes(): any {
    const attrs: { [key: string]: any } = {};
    Object.keys(this).forEach(attr => {
      if (this[attr] instanceof Attribute) {
        attrs[attr] = (this[attr] as Attribute<any, any>).get();
      }
    });

    return attrs;
  }

  public serialize(): SerializedComponent {
    const attributes = this.serializeAttributes();

    return {
      id: this.id,
      name: this.name,
      attributes,
    };
  }
}
