import Button from './Button';

export default class ToggleButton extends Button {
  private pressed: boolean = false;

  protected handleClick(action: (btn: Button) => void): void {
    action(this);
    if (this.pressed === false) {
      this.button.setFrame(4);
      this.pressed = true;
    } else {
      this.button.setFrame(8);
      this.pressed = false;
    }
  }

  public isPressed(): boolean {
    return this.pressed;
  }
}
