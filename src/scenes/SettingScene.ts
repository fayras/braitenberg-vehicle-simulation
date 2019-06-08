import Phaser from 'phaser';
import { get, set } from 'lodash-es';
import Entity from '../Entity';
import { ComponentType } from '../enums';

export default class SettingScene extends Phaser.Scene {
  private container: Phaser.GameObjects.Container | null = null;

  private background: Phaser.GameObjects.Graphics | null = null;

  public constructor() {
    super({ key: 'SettingScene' });
  }

  public preload(): void {
    this.load.html('slider', 'assets/templates/motor.html');
  }

  public static getWidth(): number {
    return 256;
  }

  public create(entity: Entity): void {
    this.scale.on('resize', this.handleResize.bind(this));

    const container = this.add.container(this.cameras.main.displayWidth - SettingScene.getWidth(), 0);
    this.container = container;

    const rect = new Phaser.Geom.Rectangle(0, 0, SettingScene.getWidth(), this.cameras.main.displayHeight);
    this.background = this.add.graphics({ fillStyle: { color: 0xcaff70 } });
    this.background.fillRectShape(rect);

    container.add(this.background);
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

  private handleResize(gameSize: Phaser.Structs.Size): void {
    const { width, height } = gameSize;

    this.cameras.resize(width, height);
    if (this.container) {
      this.container.setPosition(this.cameras.main.displayWidth - SettingScene.getWidth(), 0);
    }
    if (this.background) {
      const rect = new Phaser.Geom.Rectangle(0, 0, SettingScene.getWidth(), this.cameras.main.displayHeight);
      this.background.fillRectShape(rect);
    }
  }
}
