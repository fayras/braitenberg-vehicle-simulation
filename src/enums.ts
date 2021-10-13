export enum BodyShape {
  RECTANGLE = 'Rechteck',
  CIRCLE = 'Kreis',
}

export enum ComponentType {
  SOLID_BODY = 'Körper',
  SENSOR = 'Sensor',
  RENDER = 'Rendering',
  MOTOR = 'Motor',
  SOURCE = 'Quelle',
  TRANSFORMABLE = 'Transform',
  CONNECTION = 'Verbindung',
}

export enum SubstanceType {
  LIGHT = 'Licht',
  BARRIER = 'Hindernis',
}

export enum EmissionType {
  GAUSSIAN = 'GAUSSIAN',
  FLAT = 'FLAT',
}

export enum SensorActivation {
  EXCITATORY = 'EXCITATORY',
  INHIBITORY = 'INHIBITORY',
}

export enum EventType {
  APPLY_FORCE = 'APPLY_FORCE',
  SENSOR_ACTIVE = 'SENSOR_ACTIVE',
  REACTION = 'REACTION',
  ENTITY_CREATED = 'ENTITY_CREATED',
  ENTITY_DESTROYED = 'ENTITY_DESTROYED',
  ENTITY_COMPONENT_ADDED = 'ENTITY_COMPONENT_ADDED',
  ENTITY_COMPONENT_REMOVED = 'ENTITY_COMPONENT_REMOVED',
  SOURCE_CREATED = 'SOURCE_CREATED',
  SENSOR_CREATED = 'SENSOR_CREATED',
  SOURCE_DESTROYED = 'SOURCE_DESTROYED',
  SENSOR_DESTROYED = 'SENSOR_DESTROYED',
}
