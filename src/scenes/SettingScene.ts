import Phaser from 'phaser';
import { get, set } from 'lodash-es';
import Entity from '../Entity';
import { ComponentType, SubstanceType } from '../enums';
import SidebarScene from './SidebarScene';
import Component from '../components/Component';

export default class SettingScene extends SidebarScene {
  public constructor() {
    super('SettingScene');
  }

  public onCreate(container: Phaser.GameObjects.Container, entity: Entity): void {
    const uiElements = entity.getAllComponents().map(component => {
      if (component.name === ComponentType.MOTOR) {
        const element = this.add.dom(0, 0).createFromCache('motor_template');
        SettingScene.bindValues(element, component);
        return element;
      }

      if (component.name === ComponentType.SENSOR) {
        const element = this.add.dom(0, 0).createFromCache('sensor_template');
        const reactsToSelect = element.getChildByName('reactsTo') as HTMLSelectElement;
        Object.entries(SubstanceType).forEach(([key, value]) => {
          reactsToSelect.add(new Option(value, key));
        });
        SettingScene.bindValues(element, component);
        return element;
      }

      if (component.name === ComponentType.SOURCE) {
        const element = this.add.dom(0, 0).createFromCache('source_template');
        const substanceSelect = element.getChildByName('substance') as HTMLSelectElement;
        Object.entries(SubstanceType).forEach(([key, value]) => {
          substanceSelect.add(new Option(value, key));
        });
        SettingScene.bindValues(element, component);
        return element;
      }

      if (component.name === ComponentType.SOLID_BODY) {
        const element = this.add.dom(0, 0).createFromCache('body_template');
        SettingScene.bindValues(element, component);
        return element;
      }

      return undefined;
    });

    this.pack(uiElements);
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
