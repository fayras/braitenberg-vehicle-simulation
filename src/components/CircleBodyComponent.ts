import { RectangleBodyComponent } from './RectangleBodyComponent';
import { ComponentType } from '../enums';

export class CircleBodyComponent extends RectangleBodyComponent {
  type: ComponentType = ComponentType.SOLID_BODY_CIRCLE;
}
