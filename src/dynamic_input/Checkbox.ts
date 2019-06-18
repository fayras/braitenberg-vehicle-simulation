import BaseInput from './BaseInput';

export default class Checkbox extends BaseInput<boolean> {
  private inputElement: HTMLInputElement | null = null;

  protected create(): Element {
    const input = document.createElement('input');

    input.type = 'checkbox';
    input.checked = this.value;
    input.addEventListener('change', () => {
      this.value = input.checked;
    });

    setTimeout(() => {
      this.inputElement = input;
    }, 0);

    return input;
  }

  protected onValueSet(): void {
    if (this.inputElement) {
      this.inputElement.checked = this.value;
    }
  }

  // construcor (attribut: String)
  // {
  //   const div = document.createElement('div');
  //   div.style =
  //     'background-color: rgba(255,0,0,0.9); color: black; width: 250px; height: 100px; font: 24px Arial; font-weight: bold';
  //   const neueZeile = '<br />';
  //   div.innerHTML = attribut;
  //   const inputCheckbox = document.createElement('input');
  //   inputCheckbox.type = 'checkbox';
  //   div.appendChild(inputCheckbox);
  //   const container = this.add.container(this.cameras.main.displayWidth - 200, 100);
  //   const element = this.add.dom(0, 0, div);
  //   container.add([element]);
  // }
}
