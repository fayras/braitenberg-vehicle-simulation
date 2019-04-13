import ComponentType from './components/types';

export default class Entity {
  public id: number;

  private components: Component[] = [];

  public static numOfEntities = 0;

  public constructor() {
    this.id = Entity.numOfEntities;
    Entity.numOfEntities += 1;
  }

  public addComponent(component: Component): void {
    this.components.push(component);
  }

  public removeComponent(component: Component): Component | undefined {
    const index = this.components.indexOf(component);
    if (index >= 0) {
      return this.components.splice(index, 1)[0];
    }

    return undefined;
  }

  public getComponent(name: ComponentType): Component | undefined {
    return this.components.find(c => c.name === name);
  }

  public getMultipleComponents(name: ComponentType): Component[] {
    return this.components.filter(c => c.name === name);
  }

  public hasComponents(...components: ComponentType[]): boolean {
    const available = this.components.map(c => c.name);
    return components.every(name => available.includes(name));
  }
}
