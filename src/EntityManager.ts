import Entity, { EntityID } from './Entity';

import Component from './components/Component';
import { EventType, ComponentType } from './enums';
import MotorComponent from './components/MotorComponent';
import SolidBodyComponent from './components/SolidBodyComponent';
import TransformableComponent from './components/TransformableComponent';
import RenderComponent from './components/RenderComponent';
import SensorComponent from './components/SensorComponent';

import ConnectionComponent from './components/ConnectionComponent';
import SourceComponent from './components/SourceComponent';
import { IReactionDisposer } from 'mobx';

export class EntityQuery {
  private mEntities: Set<Entity> = new Set();
  public types: readonly ComponentType[];
  private onAddedHandlers: Set<(entity: Entity) => any> = new Set();
  private onRemovedHandlers: Set<(entity: Entity) => any> = new Set();

  constructor(types: ComponentType[]) {
    this.types = types;
  }

  public static getKey(types: readonly ComponentType[]) {
    return types.reduce((a, b) => a | b);
  }

  get key() {
    return EntityQuery.getKey(this.types);
  }

  get entities(): ReadonlySet<Entity> {
    return this.mEntities;
  }

  public add(entity: Entity) {
    this.mEntities.add(entity);
    this.onAddedHandlers.forEach((handler) => handler(entity));
  }

  public remove(entity: Entity) {
    this.mEntities.delete(entity);
    this.onRemovedHandlers.forEach((handler) => handler(entity));
  }

  public has(entity: Entity) {
    return this.mEntities.has(entity);
  }

  public onEntityAdded(callback: (entity: Entity) => any): IDisposable {
    this.onAddedHandlers.add(callback);

    return () => this.onAddedHandlers.delete(callback);
  }

  public onEntityRemoved(callback: (entity: Entity) => any): IDisposable {
    this.onRemovedHandlers.add(callback);

    return () => this.onRemovedHandlers.delete(callback);
  }
}

class EntityManager {
  private entities: { [id: EntityID]: Entity } = {};
  private queries: Map<ComponentType, EntityQuery> = new Map();

  public createQuery(types: ComponentType[]): EntityQuery {
    const key = EntityQuery.getKey(types);
    let query = this.queries.get(key);

    if (query !== undefined) {
      return query;
    }

    const entities = this.getEntities();
    query = new EntityQuery(types);

    for (const entity of entities) {
      if (entity.hasComponents(...types)) {
        query.add(entity);
      }
    }

    this.queries.set(key, query);

    return query;
  }

  public getQuery(types: ComponentType[]): EntityQuery | undefined {
    const key = EntityQuery.getKey(types);

    return this.queries.get(key);
  }

  private updateQueries(entity: Entity) {
    for (const [key, query] of this.queries) {
      if (this.entities[entity.id] && entity.hasComponents(...query.types)) {
        query.add(entity);
      } else if (query.has(entity)) {
        query.remove(entity);
      }
    }
  }

  /**
   * Falls eine Entität manuell angelegt werden musste, kann diese hiermit
   * der Entity-Pool hinzugefügt werden. Das löst auch die Nachricht
   * `ENTITY_CREATED` auf dem Bus aus.
   *
   * @param entity
   */
  public addExistingEntity(entity: Entity): void {
    this.entities[entity.id] = entity;
    this.updateQueries(entity);
  }

  /**
   * Erzeugt eine neue Entität mit den übergebenen Komponenten.
   *
   * @param components
   */
  public createEntity(...components: Component[]): Entity {
    const entity = new Entity();
    components.forEach((c) => {
      entity.addComponent(c);
    });
    this.entities[entity.id] = entity;
    this.updateQueries(entity);

    return entity;
  }

  /**
   * Zerstört eine Entität.
   *
   * @param id Die ID einer Entität, die zerstört werden soll.
   */
  public destroyEntity(id: EntityID): void {
    const entity = this.entities[id];
    delete this.entities[id];

    this.updateQueries(entity);
  }

  /**
   * Fügt einer vorhandenen Entität eine Komponente hinzu. Diese Methode sollte
   * nach Möglichkeit Entity.addComponent vorgezogen werden, da diese die
   * entsprechende Nachricht `ENTITY_COMPONENT_ADDED` auf dem Bus sendet.
   *
   * @param entityId Die ID einer Entität.
   * @param component
   *
   * @returns Gibt die entsprechende Entität zurück, zu der die Komponente hin-
   *          zugefügt wurde, oder aber `undefined`, wenn dies nicht passiert
   *          ist.
   */
  public addComponent(entityId: EntityID, component: Component): Entity | undefined {
    const entity = this.entities[entityId];

    if (!entity) {
      // TODO: Alert auslösen
      // new Noty({ text: `Entität mit ID ${entityId} konnte nicht gefunden werden` }).show();
      return undefined;
    }

    const id = entity.addComponent(component);

    // Eine ID "undefined" heißt, dass die Komponente nicht hinzugefügt wurde. Dann
    // dürfen wir auch keine Nachricht über den Bus schicken.
    if (id === undefined) {
      return undefined;
    }

    this.updateQueries(entity);

    return entity;
  }

  /**
   * Entfernt eine Komponente von einer vorhanden Entität.
   *
   * @param entityId Die ID einer Entität.
   * @param component
   */
  public removeComponent(entityId: EntityID, component: Component): void {
    const entity = this.entities[entityId];

    if (!entity) {
      // TODO: Alert auslösen
      // new Noty({ text: `Entität mit ID ${entityId} konnte nicht gefunden werden` }).show();
      return;
    }

    entity.removeComponent(component);
    this.updateQueries(entity);
  }

  /**
   * Gibt alle vorhandenen ENtität zurück.
   */
  public getEntities(): Entity[] {
    return Object.values(this.entities);
  }

  /**
   * Deserialisiert alle Entitäten eines Objekts und fügt diese den vorhanden
   * Entitäten hinzu.
   * Achtung! Die Funktion fügt neue Entitäten nur hinzu, d.h. es werden bereits
   * vorhandene Entitäten nicht gelöscht, darum muss sich der Entwickler selbst
   * kümmern.
   *
   * @param allEntities
   */
  public loadEntities(allEntities: SerializedEntity[]): void {
    allEntities.forEach((serializedEntity) => {
      const entity = new Entity();

      serializedEntity.components.forEach((serializedComponent) => {
        const { type, id, attributes } = serializedComponent;
        const component = EntityManager.getComponent(type, attributes);

        // Normalerweise sollte es immer eine richtige Komponente sein, wenn diese
        // mit der App exportiert wurde. Falls aber aus welchen Gründen auch immer
        // eine unbekannte Komponente erzeugt wurde, dann fangen wir das hier ab.
        if (component) {
          component.id = id;
          entity.addComponent(component);
        }
      });

      this.addExistingEntity(entity);
    });
  }

  /**
   * Eine Hilfsfunktion, um anhand vom Namen und übergebenen Attributen eine neue
   * Instanz der entsprechenden Komponente zu erzeugen.
   *
   * @param name Der Name bzw. Typ der Komponente.
   * @param attributes Die Attribute als ein Objekt. Dabei ist wichtig, dass es keine
   *                   Überprüfung auch Richtigkeit der Werte gibt! Für nähere Infos
   *                   zu den möglichen Attributen siehe jeweilige Komponenten-Klasse.
   */
  private static getComponent(type: ComponentType, attributes: any): Component | undefined {
    switch (type) {
      case ComponentType.TRANSFORMABLE:
        return new TransformableComponent(attributes);
      case ComponentType.SOURCE:
        return new SourceComponent(attributes);
      case ComponentType.SOLID_BODY:
        return new SolidBodyComponent(attributes);
      case ComponentType.RENDER:
        return new RenderComponent(attributes);
      case ComponentType.MOTOR:
        return new MotorComponent(attributes);
      case ComponentType.SENSOR:
        return new SensorComponent(attributes);
      case ComponentType.CONNECTION:
        return new ConnectionComponent(attributes);
      default:
        return undefined;
    }
  }
}

export default new EntityManager();
