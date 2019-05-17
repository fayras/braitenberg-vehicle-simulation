import { ComponentType } from '../enums';

export default abstract class Component {
  public abstract name: ComponentType;

  public id: number;

  private static numOfEntities = 0;

  public constructor() {
    this.id = Component.numOfEntities;
    Component.numOfEntities += 1;
  }
}
