import BaseInput from './BaseInput';

export default class SizeInput extends BaseInput<Dimensions> {
  protected create(): Element {
    const root = document.createElement('div');
    const input = document.createElement('input');

    input.type = 'number';
    input.value = (this.value.width as unknown) as string;
    input.addEventListener('change', () => {
      this.value = { width: Number(input.value), height: this.value.height };
    });

    root.appendChild(input);

    return root;
  }

  // eslint-disable-next-line
  protected onUpdate(): void {}

  // preUpdate(time, delta) {
  //     super.preUpdate(time, delta);
  // }
}
