import Phaser from 'phaser';
import { get, set } from 'lodash-es';
import Entity from '../Entity';
import { ComponentType, SubstanceType } from '../enums';
import SidebarScene from './SidebarScene';
import Component from '../components/Component';
import Attribute from '../components/Attribute';
import EntityManager from '../EntityManager';

export default class SettingScene extends SidebarScene {
  public constructor() {
    super('SettingScene');
  }

  public onCreate(container: Phaser.GameObjects.Container, entity: Entity): void {
    const addComponent = this.add.dom(0, 0, 'button', '', 'Hinzufügen');
    const deleteEntity = this.add.dom(0, 0, 'button', '', 'Löschen');
    addComponent.addListener('click');
    deleteEntity.addListener('click');
    addComponent.on('click', () => {
      entity.removeComponent(component);
      // alle Componenten der Enittät neu laden
      container.removeAll(true);
      container.height = 0;
      this.onCreate(container, entity);
    });
    deleteEntity.on('click', () => {
      EntityManager.destroyEntity(entity.id);
      this.close();
    });

    const uiElements = entity.getAllComponents().map((component): Phaser.GameObjects.DOMElement[] => {
      const title = this.add.dom(0, 0, 'h3', '', component.name).setClassName('componentTitle');
      const deleteButton = this.add.dom(0, 0, 'div', '', '✖').setClassName('deleteButton');
      deleteButton.setData('ignoreHeight', true);
      deleteButton.addListener('click');
      deleteButton.on('click', () => {
        entity.removeComponent(component);
        // alle Componenten der Enittät neu laden
        container.removeAll(true);
        container.height = 0;
        this.onCreate(container, entity);
      });

      const attributes = Object.keys(component).map(attribute => {
        if (component[attribute] instanceof Attribute) {
          return (component[attribute] as Attribute<any, any>).render(this, entity);
        }

        return undefined;
      });

      return [title, deleteButton, ...attributes];
    });

    this.pack([addComponent, deleteEntity, ...uiElements.flat()]);
  }
}
