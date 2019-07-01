import { ComponentType } from './enums';
import Component from './components/Component';

export default class Entity {
  public id: number;

  private components: Component[] = [];

  public static numOfEntities = 0;

  public constructor() {
    this.id = Entity.numOfEntities;
    Entity.numOfEntities += 1;
  }

  public addComponent(component: Component): number {
    this.components.push(component);

    return component.id;
  }

  public removeComponent(component: Component): Component | undefined {
    const index = this.components.indexOf(component);
    if (index >= 0) {
      return this.components.splice(index, 1)[0];
    }

    return undefined;
  }

  public getComponent<T extends Component>(name: ComponentType): T | undefined {
    return this.components.find(c => c.name === name) as T;
  }

  public getMultipleComponents(name: ComponentType): Component[] {
    return this.components.filter(c => c.name === name);
  }

  public hasComponents(...components: ComponentType[]): boolean {
    const available = this.components.map(c => c.name);
    return components.every(name => available.includes(name));
  }

  public getAllComponents(): Component[] {
    return this.components;
  }

  public serialize(): SerializedEntity {
    return {
      id: this.id,
      components: this.components.map(component => component.serialize()),
    };
  }
}
