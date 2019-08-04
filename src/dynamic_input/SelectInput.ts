import BaseInput from './BaseInput';

export default class SelectInput<T> extends BaseInput<T> {
  protected create(): Element {
    const input = document.createElement('select');

    if (!this.config.options) {
      throw new Error('Die Konfiguration "options" muss für die Klasse "SelectInput" definiert sein.');
    }

    const type = this.config.options;

    Object.values(type).forEach(value => {
      const option = document.createElement('option');
      option.value = value as string;
      option.innerHTML = value as string;
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
