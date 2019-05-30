import { ComponentType } from '../enums';

export default abstract class Component {
  public abstract name: ComponentType;

  public id: number;

  private static count = 0;

  public constructor() {
    this.id = Component.count;
    Component.count += 1;
  }

  public abstract serialize(): string;
}
