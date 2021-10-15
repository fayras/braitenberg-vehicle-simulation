import { makeObservable, observable, action } from 'mobx';
import { v4 as uuidV4 } from 'uuid';

import { ComponentType } from './enums';
import Component, { ComponentId } from './components/Component';

export type EntityID = string;

export default class Entity {
  public id: EntityID;

  private components: Component[] = [];

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
    const currentAmount = this.getMultipleComponents(component.type).length;

    // Komponenten können angeben, wie viele davon zu einer Entität hinzugefügt werden dürfen.
    if (currentAmount >= component.getMaxAmount()) {
      // TODO: Alert auslösen
      // `Die Entität besitzt bereits die maximale Anzahl an Komponenten des Typs ${component.name}`
      return undefined;
    }

    this.components.push(component);
    return component.id;
  }

  // entfernt die übergebene Komponente falls vorhanden
  // gibt entfernte Komponentezurück
  public removeComponent(component: Component): Component | undefined {
    const index = this.components.indexOf(component);
    if (index >= 0) {
      return this.components.splice(index, 1)[0];
    }

    return undefined;
  }

  // gibt die erste Komponentemit dem Übergebenen Component Typ zurück
  public getComponent<T extends Component>(type: ComponentType): T | undefined {
    return this.components.find((c) => c.type === type) as T;
  }

  // gibt alle Komponente mit dem übergebenen Component Type zurück
  public getMultipleComponents(type: ComponentType): Component[] {
    return this.components.filter((c) => c.type === type);
  }

  //
  public hasComponents(...components: ComponentType[]): boolean {
    const available = this.components.map((c) => c.type);
    return components.every((type) => available.includes(type));
  }

  // gibt alle Komponente der Entität zurück
  public getAllComponents(): Component[] {
    return this.components;
  }

  // Serialisierungsfunktion für die Umwandlung in JSON
  public serialize(): SerializedEntity {
    return {
      id: this.id,
      components: this.components.map((component) => component.serialize()),
    };
  }
}
