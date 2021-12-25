import { makeObservable, observable, action } from 'mobx';
import { v4 as uuidV4 } from 'uuid';

import { ComponentType } from './enums';
import Component, { ComponentId } from './components/Component';

export type EntityID = string;

export class Entity {
  public id: EntityID;

  // private components: Component[] = [];
  private components: Map<ComponentType, Component[]> = new Map();

  /**
   * Erzeugt eine neue Entität.
   * Dies ist möglich, da manchmal nötig, nach Möglichkeit sollten jedoch die
   * entsprechenden Funktionen aus der Klasse `EntityManager` benutzt werden.
   */
  public constructor() {
    this.id = uuidV4();

    makeObservable<Entity, 'components'>(this, {
      components: observable,
      addComponent: action,
      removeComponent: action,
      // getComponent: computed,
      // getMultipleComponents: computed,
      // getAllComponents: computed,
      // hasComponents: computed,
    });
    console.log('constrcutor', this.id, this.components);
  }

  /**
   * Fügt eine neue Komponente zur Entität hinzu, falls die maximal erlaubte
   * Anzahl des Typs noch nicht überschritten wurde.
   *
   * @param component
   *
   * @returns Liefert die ID der Komponente zurück. Wurde die Komponente nicht
   *          hinzugefügt, dann wird `-1` zurückgegeben.
   */
  public addComponent(component: Component): ComponentId | undefined {
    console.log('addComponent', this.id, component.type, console.trace());

    if (this.components.get(component.type) === undefined) {
      this.components.set(component.type, []);
    }

    const current = this.components.get(component.type);
    // Komponenten können angeben, wie viele davon zu einer Entität hinzugefügt werden dürfen.
    if (current && current.length >= component.getMaxAmount()) {
      // TODO: Alert auslösen
      // `Die Entität besitzt bereits die maximale Anzahl an Komponenten des Typs ${component.name}`
      return undefined;
    }

    current?.push(component);
    return component.id;
  }

  // entfernt die übergebene Komponente falls vorhanden
  // gibt entfernte Komponentezurück
  public removeComponent(component: Component): Component | undefined {
    const current = this.components.get(component.type);
    const index = current?.indexOf(component);

    if (current === undefined || index === undefined || index < 0) {
      return undefined;
    }

    return current.splice(index, 1)[0];
  }

  // gibt die erste Komponentemit dem Übergebenen Component Typ zurück
  public getComponent<T extends Component>(type: ComponentType): T | undefined {
    const current = this.components.get(type);
    return current ? (current[0] as T) : undefined;
  }

  // gibt alle Komponente mit dem übergebenen Component Type zurück
  public getComponents<T extends Component>(type: ComponentType): T[] {
    return (this.components.get(type) as T[]) || [];
  }

  //
  public hasComponents(...components: ComponentType[]): boolean {
    // const available = this.components.map((c) => c.type);
    return components.every((type) => this.components.has(type));
  }

  // gibt alle Komponente der Entität zurück
  public getAllComponents(): Component[] {
    return ([] as Component[]).concat(...this.components.values());
  }

  // Serialisierungsfunktion für die Umwandlung in JSON
  public serialize(): SerializedEntity {
    return {
      id: this.id,
      components: this.getAllComponents().map((component) => component.serialize()),
    };
  }
}
