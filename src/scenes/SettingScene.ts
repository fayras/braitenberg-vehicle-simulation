import Phaser from 'phaser';
import { get, set } from 'lodash-es';
import Entity from '../Entity';
import { ComponentType, SubstanceType } from '../enums';
import SidebarScene from './SidebarScene';
import Component from '../components/Component';
import Attribute from '../components/Attribute';

export default class SettingScene extends SidebarScene {
  public constructor() {
    super('SettingScene');
  }

  public onCreate(container: Phaser.GameObjects.Container, entity: Entity): void {
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

    this.pack(uiElements.flat());
  }

  private static bindValues(element: Phaser.GameObjects.DOMElement, component: Component): void {
    const children = element.node.querySelectorAll('*');
    children.forEach(child => {
      const bind = child.getAttribute('component-bind');
      if (bind) {
        const el = child as HTMLInputElement;
        el.value = get(component, bind);
      }
    });

    element.addListener('change');
    element.on('change', (event: { target: HTMLInputElement }) => {
      console.log('change', event);
      const t = event.target;
      const bind = t.getAttribute('component-bind');
      if (bind) {
        set(component, bind, t.value);
      }
    });
  }
}
