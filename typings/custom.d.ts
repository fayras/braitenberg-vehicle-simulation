declare module '*.png' {
  const value: string;
  export default value;
}

declare module 'mathjs';

declare namespace EventMessages {
  interface ApplyForce {
    id: number;
    offset: Phaser.Physics.Matter.Matter.Vector;
    force: Phaser.Physics.Matter.Matter.Vector;
  }

  interface SensorActive {
    id: number;
    activation: number;
  }

  type Reaction = CollisionBodies;
}

type ComponentPhysicsBody = Phaser.Physics.Matter.Matter.Body & {
  userData: {
    belongsTo: {
      entity: import('../src/Entity').default;
      component: import('../src/components/Component').default;
    };
  };
};

type SensorPhysicsObject = ComponentPhysicsBody & {
  userData: {
    kernel: (x: number, y: number) => number;
    belongsTo: {
      component: import('../src/components/SensorComponent').default;
    };
  };
};

type SourcePhysicsObject = ComponentPhysicsBody & {
  userData: {
    kernel: (x: number, y: number) => number;
    belongsTo: {
      component: import('../src/components/SourceComponent').default;
    };
  };
};

interface CollisionBodies {
  sensor: SensorPhysicsObject;
  other: ComponentPhysicsBody;
}

interface SerializedComponent {
  id: number;
  name: import('../src/enums').ComponentType;
  attributes: object;
}

interface SerializedEntity {
  id: number;
  components: SerializedComponent[];
}

// interface ReactionPair<T extends ComponentPhysicsBody, S extends ComponentPhysicsBody> {

// };

type AssetKey = string;
type EventHandler =
  | ((event: EventMessages.ApplyForce) => void)
  | ((event: EventMessages.SensorActive) => void)
  | ((event: EventMessages.Reaction) => void);
