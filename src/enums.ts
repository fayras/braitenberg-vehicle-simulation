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

export enum SensorActivation {
  LINEAR = 'LINEAR',
  QUADRATIC = 'QUADRATIC',
}

export enum EventType {
  APPLY_FORCE = 'APPLY_FORCE',
  SENSOR_ACTIVE = 'SENSOR_ACTIVE',
  REACTION = 'REACTION',
}
