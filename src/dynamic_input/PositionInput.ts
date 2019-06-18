import BaseInput from './BaseInput';

export default class PositionInput extends BaseInput<Vector2D> {
  private inputElementX: HTMLInputElement | null = null;

  private inputElementY: HTMLInputElement | null = null;

  protected create(): Element {
    const container = document.createElement('div');
    const inputX = document.createElement('input');
    const inputY = document.createElement('input');

    inputX.type = 'number';
    inputY.type = 'number';
    inputX.step = '0.01';
    inputY.step = '0.01';
    inputX.style.display = 'block';
    inputY.style.display = 'block';
    inputX.value = (this.value.x as unknown) as string;
    inputY.value = (this.value.y as unknown) as string;
    inputX.addEventListener('change', () => {
      this.value.x = (inputX.value as unknown) as number;
    });
    inputY.addEventListener('change', () => {
      this.value.y = (inputY.value as unknown) as number;
    });

    setTimeout(() => {
      this.inputElementX = inputX;
      this.inputElementY = inputY;
    }, 0);

    container.appendChild(inputX);
    container.appendChild(inputY);

    return container;
  }

  protected onUpdate(): void {
    if (this.inputElementX) {
      this.inputElementX.value = this.value.x.toFixed(2);
    }
    if (this.inputElementY) {
      this.inputElementY.value = this.value.y.toFixed(2);
    }
  }

  // preUpdate(time, delta) {
  //     super.preUpdate(time, delta);
  // }
}
