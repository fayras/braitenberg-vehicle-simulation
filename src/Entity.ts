import ComponentType from './components/types';

export default class Entity {
  public id: number;

  private components: Component[] = [];

  public constructor() {
    this.id = new Date().valueOf();
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

  public hasComponents(...components: ComponentType[]): boolean {
    return this.components.map(c => c.name).every(name => components.includes(name));
  }
}
