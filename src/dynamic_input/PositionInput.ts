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
    let widthRatio = 1;
    let heightRatio = 1;
    if (solidBody) {
      const { shape, size } = solidBody as SolidBodyComponent;
      rect = calculateAspectRatioFit(size.get().width, size.get().height, 100, 100);
      widthRatio = rect.width / size.get().width;
      heightRatio = rect.height / size.get().height;
    }

    // Die Hälfte der Breite/Höhe des Indikators. Der Wert wird über CSS gesetzt:
    // 10px Breite + je 2px Kante auf beiden Seiten = 14px Breite
    const indicatorSize = 7;
    const snappingSize = 10;
    this.position.x = this.value.x * widthRatio + rect.width / 2 - indicatorSize;
    this.position.y = this.value.y * heightRatio + rect.height / 2 - indicatorSize;

    const html = `
      <div class="position-background" style="width:${rect.width}px;height:${rect.height}px;">
        <div class="direction-indicator" style="left:${rect.width / 2 - 5}px"></div>
        <div class="draggable position-indicator"></div>
      </div>
    `;
    const nodes = parseDOM(html);
    const dragEl = getNode<HTMLDivElement>(nodes, '.position-indicator');
    dragEl.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;

    interact(dragEl)
      .draggable({
        modifiers: [
          interact.modifiers!.restrict({
            restriction: 'parent',
            elementRect: { left: 0.4, right: 0.6, top: 0.4, bottom: 0.6 },
          }),
        ],
      })
      .on('dragmove', event => {
        const { target, dx, dy } = event;
        this.position.x += dx;
        this.position.y += dy;

        const newX = Math.round(this.position.x / (snappingSize * widthRatio)) * snappingSize * widthRatio;
        const newY = Math.round(this.position.y / (snappingSize * heightRatio)) * snappingSize * heightRatio;

        console.log(newX, newY);

        target.style.transform = `translate(${newX}px, ${newY}px)`;
      })
      .on('dragend', () => {
        let x = Math.round((this.position.x - rect.width / 2 + indicatorSize) / widthRatio);
        let y = Math.round((this.position.y - rect.height / 2 + indicatorSize) / heightRatio);

        x = Math.round(x / (snappingSize * widthRatio)) * snappingSize * widthRatio;
        y = Math.round(y / (snappingSize * heightRatio)) * snappingSize * heightRatio;

        console.log(x, y);

        this.value = { x, y };
      });
    return nodes.body.childNodes[0] as Element;
  }
}
