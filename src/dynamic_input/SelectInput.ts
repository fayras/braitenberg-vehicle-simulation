import BaseInput from './BaseInput';

export default class SelectInput<T> extends BaseInput<T> {
  protected create(): Element {
    const root = document.createElement('div');
    const input = document.createElement('input');

    input.type = 'number';
    input.value = (this.value as unknown) as string;
    input.addEventListener('change', () => {
      this.value = (input.value as unknown) as T;
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
