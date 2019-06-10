import Phaser from 'phaser';
import { get, set } from 'lodash-es';
import Entity from '../Entity';
import { ComponentType } from '../enums';
import SidebarScene from './SidebarScene';

export default class SettingScene extends SidebarScene {
  public constructor() {
    super('SettingScene');
  }

  public preload(): void {
    this.load.html('slider', 'assets/templates/motor.html');
  }

  public onCreate(container: Phaser.GameObjects.Container, entity: Entity): void {
    let height = 0;
    entity.getAllComponents().forEach(component => {
      if (component.name === ComponentType.MOTOR) {
        const sliderElement = this.add
          .dom(0, height)
          .createFromCache('slider')
          .setOrigin(0, 0);

        const children = sliderElement.node.querySelectorAll('*');
        children.forEach(child => {
          const bind = child.getAttribute('component-bind');
          if (bind) {
            child.value = get(component, bind);
          }
        });

        sliderElement.addListener('change');
        sliderElement.on('change', event => {
          console.log('change', event);
          const t = event.target;
          const bind = t.getAttribute('component-bind');
          set(component, bind, t.value);
        });

        container.add(sliderElement);
        height += sliderElement.height;
      }
    });
  }
}
