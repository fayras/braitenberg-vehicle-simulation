import { Entity, EntityID } from './Entity';

import { ECSComponent } from './components/ECSComponent';
import { ComponentType } from './enums';
import { MotorComponent } from './components/MotorComponent';
import { RectangleBodyComponent } from './components/RectangleBodyComponent';
import { TransformableComponent } from './components/TransformableComponent';
import { SpriteComponent } from './components/SpriteComponent';
import { SensorComponent } from './components/SensorComponent';

import { ConnectionComponent } from './components/ConnectionComponent';
import { SourceComponent } from './components/SourceComponent';
import { EntityQuery } from './EntityQuery';

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

    // eslint-disable-next-line no-restricted-syntax
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

  /**
   * Falls eine Entität manuell angelegt werden musste, kann diese hiermit
   * der Entity-Pool hinzugefügt werden. Das löst auch die Nachricht
   * `ENTITY_CREATED` auf dem Bus aus.
   *
   * @param entity
   */
  public addEntity(entity: Entity): void {
    this.entities[entity.id] = entity;
    for (const [, query] of this.queries) {
      if (entity.hasComponents(...query.types)) {
        query.add(entity);
      }
    }
  }

  /**
   * Erzeugt eine neue Entität mit den übergebenen Komponenten.
   *
   * @param components
   */
  public createEntity(...components: ECSComponent[]): Entity {
    const entity = new Entity();
    components.forEach((c) => {
      entity.addComponent(c);
    });

    this.addEntity(entity);

    return entity;
  }

  /**
   * Zerstört eine Entität.
   *
   * @param id Die ID einer Entität, die zerstört werden soll.
   */
  public removeEntity(id: EntityID): void {
    const entity = this.entities[id];

    for (const [, query] of this.queries) {
      if (query.has(entity)) {
        query.remove(entity);
      }
    }

    delete this.entities[id];
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
  public addComponent(entityId: EntityID, component: ECSComponent): Entity {
    const entity = this.entities[entityId];

    if (!entity) {
      throw new Error(`Entity with ${entityId} not found.`);
    }

    entity.addComponent(component);

    for (const [, query] of this.queries) {
      if (query.has(entity)) {
        // query.update(entity, component);
      } else if (entity.hasComponents(...query.types)) {
        query.add(entity);
      }
    }

    return entity;
  }

  /**
   * Entfernt eine Komponente von einer vorhandenen Entität.
   *
   * @param entityId Die ID einer Entität.
   * @param component
   */
  public removeComponent(entityId: EntityID, component: ECSComponent): void {
    const entity = this.entities[entityId];

    if (!entity) {
      throw new Error(`Entity with id ${entityId} not found.`);
    }

    entity.removeComponent(component);

    for (const [, query] of this.queries) {
      if (query.has(entity)) {
        if (entity.hasComponents(...query.types)) {
          // query.update(entity, undefined, component);
        } else {
          query.remove(entity);
        }
      }
    }
  }

  /**
   * Gibt alle vorhandenen Entität zurück.
   */
  public getEntities(): Entity[] {
    return Object.values(this.entities);
  }

  public getEntity(id: EntityID): Entity {
    return this.entities[id];
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

      this.addEntity(entity);
    });
  }

  /**
   * Eine Hilfsfunktion, um anhand vom Namen und übergebenen Attributen eine neue
   * Instanz der entsprechenden Komponente zu erzeugen.
   *
   * @param type
   * @param attributes Die Attribute als ein Objekt. Dabei ist wichtig, dass es keine
   *                   Überprüfung auch Richtigkeit der Werte gibt! Für nähere Infos
   *                   zu den möglichen Attributen siehe jeweilige Komponenten-Klasse.
   */
  private static getComponent(type: ComponentType, attributes: any): ECSComponent | undefined {
    switch (type) {
      case ComponentType.TRANSFORMABLE:
        return new TransformableComponent(attributes);
      case ComponentType.SOURCE:
        return new SourceComponent(attributes);
      case ComponentType.SOLID_BODY:
        return new RectangleBodyComponent(attributes);
      case ComponentType.RENDER:
        return new SpriteComponent(attributes);
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

// eslint-disable-next-line import/no-default-export
export default new EntityManager();
