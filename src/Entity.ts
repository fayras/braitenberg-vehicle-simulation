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

  // fügt die Übergebene Componente der Entität hinzu, wenn es nicht schon zu viele Componenten gibt
  //  gibt die Id der neu hinzugefügten Componente zurück
  public addComponent(component: Component): number {
    const currentAmount = this.getMultipleComponents(component.name).length;

    if (currentAmount >= component.getMaxAmount()) {
      console.warn(`Die Entität besitzt bereits die maximale Anzahl an Komponenten des Typs ${component.name}`);
      return -1;
    }

    this.components.push(component);
    return component.id;
  }

  // entfernt die übergebene Componente, falls vorhanden
  // gibt entfernte Componente zurück
  public removeComponent(component: Component): Component | undefined {
    const index = this.components.indexOf(component);
    if (index >= 0) {
      return this.components.splice(index, 1)[0];
    }

    return undefined;
  }

  // gibt die erste Componente mit dem Übergebenen Component Typ zurück
  public getComponent<T extends Component>(name: ComponentType): T | undefined {
    return this.components.find(c => c.name === name) as T;
  }

  // gibt alle Componenten mit dem übergebenen Component Type zurück
  public getMultipleComponents(name: ComponentType): Component[] {
    return this.components.filter(c => c.name === name);
  }

  //
  public hasComponents(...components: ComponentType[]): boolean {
    const available = this.components.map(c => c.name);
    return components.every(name => available.includes(name));
  }

  // gibt alle Componenten der Entität zurück
  public getAllComponents(): Component[] {
    return this.components;
  }

  // Serialisierungsfunktion für die Umwandlung in JSON
  public serialize(): SerializedEntity {
    return {
      id: this.id,
      components: this.components.map(component => component.serialize()),
    };
  }
}
