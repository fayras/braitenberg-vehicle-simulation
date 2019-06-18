import BaseInput from './BaseInput';

export default class Checkbox extends BaseInput<boolean> {
  protected create(): Element {
    const root = document.createElement('div');
    const input = document.createElement('input');

    input.type = 'number';
    input.value = (this.get() as unknown) as string;
    input.addEventListener('change', () => {
      this.set((input.value as unknown) as boolean);
    });

    root.appendChild(input);

    return root;
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
