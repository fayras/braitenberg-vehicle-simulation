import BaseInput from './BaseInput';

export default class NumberInput extends BaseInput<number> {
  protected create(): Element {
    const input = document.createElement('input');

    input.type = 'number';
    input.value = (this.value as unknown) as string;
    input.addEventListener('change', () => {
      this.value = (input.value as unknown) as number;
    });

    return input;
  }

  // preUpdate(time, delta) {
  //     super.preUpdate(time, delta);
  // }
}
