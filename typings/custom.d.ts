declare module '*.png' {
  const value: string;
  // eslint-disable-next-line import/no-default-export
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

  interface NewSourceInfo {
    id: number;
    values: Float32Array;
    type: import('../src/enums').SubstanceType;
    width: number;
    height: number;
  }

  interface NewSensorInfo {
    id: number;
    values: { [angle: number]: Float32Array };
    type: import('../src/enums').SubstanceType;
    width: number;
    height: number;
  }

  interface SourceOrSensorDestroyedInfo {
    id: number;
    type: import('../src/enums').SubstanceType;
  }

  type Reaction = CollisionBodies;
}

type ComponentPhysicsBody = Phaser.Physics.Matter.Matter.Body & {
  userData: {
    belongsTo: {
      entity: import('../src/Entity').default;
      component: import('../src/components/ECSComponent').default;
    };
  };
};

type SensorPhysicsObject = ComponentPhysicsBody & {
  userData: {
    kernel: (x: number, y: number) => number;
    tensors: {
      angle: number;
      tensor: import('@tensorflow/tfjs-core').Tensor4D;
    }[];
    belongsTo: {
      component: import('../src/components/SensorComponent').default;
    };
  };
};

type SourcePhysicsObject = ComponentPhysicsBody & {
  userData: {
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
  id: string;
  type: import('../src/enums').ComponentType;
  attributes: any;
}

interface SerializedEntity {
  id: string;
  components: SerializedComponent[];
}

interface IDisposable {
  (): void;
}

// interface ReactionPair<T extends ComponentPhysicsBody, S extends ComponentPhysicsBody> {

// };

interface Dimensions {
  width: number;
  height: number;
}

type ConnectionPair = {
  input: ComponentId;
  output: ComponentId;
  weight: number;
};

type ConnectionComponentData = ConnectionPair[];

type Vector2D = Phaser.Physics.Matter.Matter.Vector;
