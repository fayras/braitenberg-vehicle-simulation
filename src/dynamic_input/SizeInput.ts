import BaseInput from './BaseInput';

export default class SizeInput extends BaseInput<Dimensions> {
  protected create(): Element {
    const root = document.createElement('div');
    const input = document.createElement('input');

    input.type = 'number';
    input.value = (this.get() as unknown) as string;
    input.addEventListener('change', () => {
      this.set((input.value as unknown) as Dimensions);
    });

    root.appendChild(input);

    return root;
  }

  // preUpdate(time, delta) {
  //     super.preUpdate(time, delta);
  // }
}
