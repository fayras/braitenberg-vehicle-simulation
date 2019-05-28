import Button from './Button';

export default class ToggleButton extends Button {
  private pressed: boolean = false;

  private activeIcon: number;

  private deactiveIcon: number;

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    deaktivIcon: number,
    activIcon: number,
    klickaction: (btn: Button) => void,
  ) {
    super(scene, x, y, text, deaktivIcon, klickaction);
    this.activeIcon = activIcon;
    this.deactiveIcon = deaktivIcon;
  }

  protected handleClick(action: (btn: Button) => void): void {
    action(this);
    if (this.pressed === false) {
      this.button.setFrame(this.deactiveIcon);
      this.pressed = true;
    } else {
      this.button.setFrame(this.activeIcon);
      this.pressed = false;
    }
  }

  public isPressed(): boolean {
    return this.pressed;
  }
}
