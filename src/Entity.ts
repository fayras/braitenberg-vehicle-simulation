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

  public removeComponent(component: Component): Component | null {
    const index = this.components.indexOf(component);
    if (index >= 0) {
      return this.components.splice(index, 1)[0];
    }

    return null;
  }

  public getComponent(name: ComponentType): Component | null {
    const component = this.components.find(c => c.name === name);
    if (component) {
      return component;
    }

    return null;
  }

  public hasComponents(...components: ComponentType[]): boolean {
    return this.components.map(c => c.name).every(name => components.includes(name));
  }
}
