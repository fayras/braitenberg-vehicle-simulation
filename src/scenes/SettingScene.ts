import Phaser from 'phaser';
import { get, set } from 'lodash-es';
import Entity from '../Entity';
import { ComponentType } from '../enums';
import SidebarScene from './SidebarScene';
import Component from '../components/Component';

export default class SettingScene extends SidebarScene {
  public constructor() {
    super('SettingScene');
  }

  public preload(): void {
    this.load.html('motor', 'assets/templates/motor.html');
    this.load.html('sensor', 'assets/templates/sensor.html');
  }

  public onCreate(container: Phaser.GameObjects.Container, entity: Entity): void {
    const uiElements = entity.getAllComponents().map(component => {
      if (component.name === ComponentType.MOTOR) {
        const sliderElement = this.add.dom(0, 0).createFromCache('motor');
        SettingScene.bindValues(sliderElement, component);
        return sliderElement;
      }

      if (component.name === ComponentType.SENSOR) {
        const sliderElement = this.add.dom(0, 0).createFromCache('sensor');
        SettingScene.bindValues(sliderElement, component);
        return sliderElement;
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
