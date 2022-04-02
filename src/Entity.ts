import { makeObservable, observable, action } from 'mobx';
import { v4 as uuidV4 } from 'uuid';

import { ComponentType } from './enums';
import { Component, ComponentId } from './components/Component';

function splitIntoSingleBitNumbers(n: number): number[] {
  const numbers: number[] = [];
  let current = n;
  while (current) {
    // extract lowest set bit in number
    // eslint-disable-next-line no-bitwise
    const m = n & -n;
    numbers.push(m);

    // remove lowest set bit from number
    current -= 1;
    // eslint-disable-next-line no-bitwise
    current &= current;
  }

  return numbers;
}

export type EntityID = string;

export class Entity {
  public id: EntityID;

  // private components: Component[] = [];
  private components: Map<ComponentType, Component> = new Map();

  public readonly children: Set<Entity> = new Set();

  private parent: Entity | null = null;

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

  public setParent(entity: Entity): void {
    if (this.parent !== null) {
      this.parent.removeChild(entity);
    }

    entity.addChild(this);
    this.parent = entity;
  }

  public getParent(): Entity | null {
    return this.parent;
  }

  public addChild(entity: Entity): void {
    this.children.add(entity);
  }

  public removeChild(entity: Entity): boolean {
    return this.children.delete(entity);
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
  public addComponent(component: Component): ComponentId {
    if (this.components.get(component.type) !== undefined) {
      throw new Error(`Component of type ${component.type} already present.`);
    }

    this.components.set(component.type, component);

    return component.id;
  }

  // entfernt die übergebene Komponente falls vorhanden
  // gibt entfernte Komponentezurück
  public removeComponent(component: Component): boolean {
    const current = this.components.get(component.type);
    if (current !== component) {
      throw new Error(`Component mismatch`);
    }

    component.dispose();
    return this.components.delete(component.type);
  }

  // gibt die erste Komponentemit dem Übergebenen Component Typ zurück
  public getComponent<T extends Component>(type: ComponentType): T | undefined {
    const current = this.components.get(type);
    return current ? (current as T) : undefined;
  }

  //
  public hasComponents(...components: ComponentType[]): boolean {
    // const available = this.components.map((c) => c.type);
    return components.every((type) => {
      const types = splitIntoSingleBitNumbers(type);
      return types.some((t) => this.components.has(t));
    });
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
