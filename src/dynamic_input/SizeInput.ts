import BaseInput from './BaseInput';
import { parseDOM, getNode } from '../utils/dom';

export default class SizeInput extends BaseInput<Dimensions> {
  protected showDefaultLabel = false;

  protected create(): Element {
    const html = `
      <div>
        <label>Breite</label>
        <input name="width" type="number"></input>
        <label>Höhe</label>
        <input name="height" type="number"></input>
      </div>
    `;

    const nodes = parseDOM(html);
    const width = getNode<HTMLInputElement>(nodes, 'input[name="width"]');
    const height = getNode<HTMLInputElement>(nodes, 'input[name="height"]');

    width.value = String(this.value.width);
    height.value = String(this.value.height);

    width.addEventListener('change', () => {
      this.value = { width: Number(width.value), height: Number(height.value) };
    });
    height.addEventListener('change', () => {
      this.value = { width: Number(width.value), height: Number(height.value) };
    });

    return nodes.body.childNodes[0] as Element;
  }
}
