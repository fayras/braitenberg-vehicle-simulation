declare module '*.png' {
  const value: unknown;
  export default value;
}

type AssetKey = string;

interface Component {
  name: import('./enums').ComponentType;
}

interface System {
  expectedComponents: import('./enums').ComponentType[];

  update(entities: import('./Entity').default[], delta: number): void;
}

interface PhysicsObjectDictionary {
  [entityId: number]: boolean;
}

interface RenderObjectDictionary {
  [entityId: number]: Phaser.GameObjects.Image;
}
