import interact from 'interactjs';
import BaseInput from './BaseInput';
import Entity from '../Entity';
import { ComponentType } from '../enums';
import SolidBodyComponent from '../components/SolidBodyComponent';
import { calculateAspectRatioFit } from '../utils/size';
import { parseDOM, getNode } from '../utils/dom';

export default class PositionInput extends BaseInput<Vector2D> {
  protected position: Vector2D = { x: 0, y: 0 };

  protected create(entity: Entity): Element {
    const solidBody = entity.getComponent(ComponentType.SOLID_BODY);

    let rect = { width: 100, height: 100 };
    if (solidBody) {
      const { shape, size } = solidBody as SolidBodyComponent;
      rect = calculateAspectRatioFit(size.get().width, size.get().height, 100, 100);
    }

    // Die Hälfte der Breite/Höhe des Indikators. Der Wert wird über CSS gesetzt:
    // 10px Breite + je 2px Kante auf beiden Seiten = 14px Breite
    const indicatorSize = 7;
    const snappingSize = 10;
    this.position.x = this.value.x + rect.width / 2 - indicatorSize;
    this.position.y = this.value.y + rect.height / 2 - indicatorSize;

    const html = `
      <div class="position-background" style="width:${rect.width}px;height:${rect.height}px;">
        <div class="draggable position-indicator"></div>
      </div>
    `;
    const nodes = parseDOM(html);
    const dragEl = getNode<HTMLDivElement>(nodes, '.position-indicator');
    dragEl.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;

    interact(dragEl)
      .draggable({
        modifiers: [
          interact.modifiers.restrict({
            restriction: 'parent',
            elementRect: { left: 0.5, right: 0.5, top: 0.5, bottom: 0.5 },
          }),
        ],
      })
      .on('dragmove', event => {
        const { target, dx, dy } = event;
        this.position.x += dx;
        this.position.y += dy;

        const newX = Math.round(this.position.x / 10) * 10;
        const newY = Math.round(this.position.y / 10) * 10;

        console.log(newX, newY);

        target.style.transform = `translate(${newX}px, ${newY}px)`;
      })
      .on('dragend', () => {
        let x = Math.round(this.position.x - rect.width / 2 + indicatorSize);
        let y = Math.round(this.position.y - rect.height / 2 + indicatorSize);

        x = Math.round(x / 10) * 10;
        y = Math.round(y / 10) * 10;

        console.log(x, y);

        this.value = { x, y };
      });

    // inputX.type = 'number';
    // inputY.type = 'number';
    // inputX.step = '0.01';
    // inputY.step = '0.01';
    // inputX.style.display = 'block';
    // inputY.style.display = 'block';
    // inputX.value = (this.value.x as unknown) as string;
    // inputY.value = (this.value.y as unknown) as string;
    // inputX.addEventListener('change', () => {
    //   this.value.x = (inputX.value as unknown) as number;
    // });
    // inputY.addEventListener('change', () => {
    //   this.value.y = (inputY.value as unknown) as number;
    // });

    // setTimeout(() => {
    //   this.inputElementX = inputX;
    //   this.inputElementY = inputY;
    // }, 0);

    // container.appendChild(inputX);
    // container.appendChild(inputY);
    // container.appendChild(dragEl);

    return nodes.body.childNodes[0] as Element;
  }

  protected onUpdate(): void {
    // if (this.inputElementX) {
    //   this.inputElementX.value = this.value.x.toFixed(2);
    // }
    // if (this.inputElementY) {
    //   this.inputElementY.value = this.value.y.toFixed(2);
    // }
  }

  // preUpdate(time, delta) {
  //     super.preUpdate(time, delta);
  // }
}
