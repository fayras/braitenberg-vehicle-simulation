import Button from './Button';

export default class ToggleButton extends Button {
  private pressed: boolean = false;

  protected handleClick(action: (btn: Button) => void): void {
    action(this);
    if (this.pressed === false) {
      this.button.setFrame(2);
      this.pressed = true;
    } else {
      this.button.setFrame(0);
      this.pressed = false;
    }
  }

  public isPressed(): boolean {
    return this.pressed;
  }
}
