import { ComponentType } from '../enums';

export default abstract class Component {
  public abstract name: ComponentType;

  public id: number;

  private static count = 0;

  public constructor() {
    this.id = Component.count;
    Component.count += 1;
  }

  protected abstract serializeAttributes(): object;

  // protected serializeAttributes(): any {
  //   const attrs: { [key: string]: any } = {};
  //   Object.keys(this).forEach(attr => {
  //     attrs[attr] = this[attr];
  //   });

  //   return attrs;
  // }

  public serialize(): SerializedComponent {
    const attributes = this.serializeAttributes();

    return {
      id: this.id,
      name: this.name,
      attributes,
    };
  }
}
