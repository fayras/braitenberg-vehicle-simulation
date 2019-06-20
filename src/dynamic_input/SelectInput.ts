import BaseInput from './BaseInput';
import * as enums from '../enums';

export default class SelectInput<T> extends BaseInput<T> {
  protected create(): Element {
    const input = document.createElement('select');

    let type: { [s: number]: string } = {};
    Object.values(enums).forEach(e => {
      if (Object.values(e).includes(this.value)) {
        type = e;
      }
    });

    Object.entries(type).forEach(([key, value]) => {
      const option = document.createElement('option');
      option.value = value as string;
      option.innerHTML = key;
      input.appendChild(option);
    });

    input.value = (this.value as unknown) as string;
    input.addEventListener('change', () => {
      this.value = (input.value as unknown) as T;
    });

    return input;
  }

  // eslint-disable-next-line
  protected onUpdate(): void {}
}
