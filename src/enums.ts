export enum BodyShape {
  RECTANGLE = 'R',
  CIRCLE = 'C',
}

export enum ComponentType {
  SOLID_BODY = 'BODY',
  SENSOR = 'SENSOR',
  RENDER = 'RENDER',
  MOTOR = 'MOTOR',
  SOURCE = 'SOURCE',
  TRANSFORMABLE = 'TRANSFORMABLE',
  CONNECTION = 'CONNECTION',
}

export enum SubstanceType {
  LIGHT = 'LIGHT',
  BARRIER = 'BARRIER',
}

export enum EmissionType {
  GAUSSIAN = 'GAUSSIAN',
  FLAT = 'FLAT',
}

export enum SensorActivation {
  LINEAR = 'LINEAR',
  QUADRATIC = 'QUADRATIC',
}

export enum EventType {
  APPLY_FORCE = 'APPLY_FORCE',
  SENSOR_ACTIVE = 'SENSOR_ACTIVE',
  REACTION = 'REACTION',
  ENTITY_CREATED = 'ENTITY_CREATED',
  ENTITY_DESTROYED = 'ENTITY_DESTROYED',
  ENTITY_SELECTED = 'ENTITY_SELECTED',
}

export const CORRELATION_SCALE = 4;
