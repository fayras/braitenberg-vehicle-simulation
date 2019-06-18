import BaseInput from './BaseInput';

export default class NumberInput extends BaseInput<number> {
  private inputElement: HTMLInputElement | null = null;

  protected create(): Element {
    const input = document.createElement('input');

    input.type = 'number';

    input.value = (this.value as unknown) as string;
    input.addEventListener('change', () => {
      this.value = (input.value as unknown) as number;
    });

    setTimeout(() => {
      this.inputElement = input;
    }, 0);

    return input;
  }

  protected onUpdate(): void {
    if (this.inputElement) {
      this.inputElement.value = (this.value as unknown) as string;
    }
  }

  // preUpdate(time, delta) {
  //     super.preUpdate(time, delta);
  // }
}
