import interact from 'interactjs';
import BaseInput from './BaseInput';
import Entity from '../Entity';
import { ComponentType } from '../enums';
import SolidBodyComponent from '../components/SolidBodyComponent';
import { calculateAspectRatioFit } from '../utils/size';

export default class PositionInput extends BaseInput<Vector2D> {
  protected position: Vector2D = { x: 0, y: 0 };

  protected create(entity: Entity): Element {
    const solidBody = entity.getComponent(ComponentType.SOLID_BODY);

    let rect = { width: 100, height: 100 };
    if (solidBody) {
      const { shape, size } = solidBody as SolidBodyComponent;
      rect = calculateAspectRatioFit(size.get().width, size.get().height, 100, 100);
    }

    this.position = { x: this.value.x, y: this.value.y };

    const html = `
      <div class="position-background" style="width:${rect.width}px;height:${rect.height}px;">
        <div class="draggable position-indicator"></div>
      </div>
    `;
    const nodes = new DOMParser().parseFromString(html.trim(), 'text/html');
    const dragEl = nodes.querySelector('.position-indicator') as HTMLDivElement;
    dragEl.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;

    interact(dragEl).draggable({
      listeners: {
        move: event => {
          const { target } = event;
          this.position.x += event.dx;
          this.position.y += event.dy;

          target.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
        },
      },
      modifiers: [
        interact.modifiers.restrict({
          restriction: 'parent',
        }),
        interact.modifiers.snap({
          targets: [interact.snappers.grid({ x: 10, y: 10 })],
          relativePoints: [{ x: 0.5, y: 0.5 }],
          offset: { x: 0, y: 0 },
        }),
      ],
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
