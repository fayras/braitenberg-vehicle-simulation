import BaseInput from './BaseInput';
import { parseDOM, getNode } from '../utils/dom';

export default class Checkbox extends BaseInput<boolean> {
  private inputElement: HTMLInputElement | null = null;

  protected showDefaultLabel = false;

  protected create(): Element {
    const html = `
      <label>
        <input type="checkbox">
        <span class="checkable">${this.label}</span>
      </label>
    `;

    const nodes = parseDOM(html);
    const inp = getNode<HTMLInputElement>(nodes, 'input');
    inp.checked = this.value;
    inp.addEventListener('change', () => {
      this.value = inp.checked;
    });

    this.inputElement = inp;

    return nodes.body.childNodes[0] as Element;
  }

  protected onUpdate(): void {
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
