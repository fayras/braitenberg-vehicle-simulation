import Phaser from 'phaser';
import windowImg from '../../assets/gui_window.png';
import Entity from '../Entity';
import { ComponentType } from '../enums';

export default class SettingScene extends Phaser.Scene {
  private container: Phaser.GameObjects.Container | null = null;

  private background: Phaser.GameObjects.Graphics | null = null;

  public constructor() {
    super({ key: 'SettingScene' });
  }

  public preload(): void {
    this.load.image('gui-window', windowImg);
    this.load.html('slider', 'assets/slider.html');
  }

  // eslint-disable-next-line
  public getWidth(): number {
    return 250;
  }

  public create(entity: Entity): void {
    this.scale.on('resize', this.handleResize.bind(this));

    const container = this.add.container(this.cameras.main.displayWidth - this.getWidth(), 0);
    this.container = container;

    const rect = new Phaser.Geom.Rectangle(0, 0, this.getWidth(), this.cameras.main.displayHeight);
    this.background = this.add.graphics({ fillStyle: { color: 0xcaff70 } });
    this.background.fillRectShape(rect);

    container.add(this.background);
    entity.getAllComponents().forEach((component, index) => {
      if (component.name === ComponentType.MOTOR) {
        const sliderElement = this.add
          .dom(0, index * 30)
          .createFromCache('slider')
          .setOrigin(0, 0);

        container.add(sliderElement);
      }
    });
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    const { width, height } = gameSize;

    this.cameras.resize(width, height);
    if (this.container) {
      this.container.setPosition(this.cameras.main.displayWidth - this.getWidth(), 0);
    }
    if (this.background) {
      const rect = new Phaser.Geom.Rectangle(0, 0, this.getWidth(), this.cameras.main.displayHeight);
      this.background.fillRectShape(rect);
    }
  }
}
