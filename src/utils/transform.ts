import { Entity } from '../Entity';
import { TransformableComponent } from '../components/TransformableComponent';
import { ComponentType } from '../enums';

export function getWorldPosition(entity: Entity, local: TransformableComponent): Vector2D {
  const parent = entity.getParent();

  if (!parent) {
    return local.position.value;
  }

  const parentTransform = parent.getComponent<TransformableComponent>(ComponentType.TRANSFORMABLE)!;
  const parentPosition = getWorldPosition(parent, parentTransform);
  const angle = parentTransform.angle.value;

  const xLocal = local.position.value.x;
  const yLocal = local.position.value.y;

  return {
    x: xLocal * Math.cos(angle) - yLocal * Math.sin(angle) + parentPosition.x,
    y: xLocal * Math.sin(angle) + yLocal * Math.cos(angle) + parentPosition.y,
  };
}

export function getWorldAngle(entity: Entity, local: TransformableComponent): number {
  const parent = entity.getParent();

  if (!parent) {
    return local.angle.value;
  }

  const parentTransform = parent.getComponent<TransformableComponent>(ComponentType.TRANSFORMABLE)!;
  const parentAngle = getWorldAngle(parent, parentTransform);

  return local.angle.value + parentAngle;
}
