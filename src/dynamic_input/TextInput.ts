import BaseInput from './BaseInput';

export default class TextInput extends BaseInput<string | number> {
  protected create(): Element {
    const root = document.createElement('div');
    const input = document.createElement('input');

    input.type = 'number';
    input.value = (this.value as unknown) as string;
    input.addEventListener('change', () => {
      this.value = (input.value as unknown) as string;
    });

    root.appendChild(input);

    return root;
  }

  // eslint-disable-next-line
  protected onValueSet(): void {}

  // preUpdate(time, delta) {
  //     super.preUpdate(time, delta);
  // }
}
