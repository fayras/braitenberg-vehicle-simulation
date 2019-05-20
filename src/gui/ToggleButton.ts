import Button from './Button';

export default class ToggleButton extends Button {
  public status: number = 0;

  protected handleClick(action: (btn: Button) => void): void {
    action(this);
    if (this.status === 0) {
      this.button.setFrame(2);
      this.status = 1;
    } else if (this.status === 1) {
      this.button.setFrame(0);
      this.status = 0;
    } else {
      console.log('Fehler');
    }
  }
}
