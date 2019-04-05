declare module '*.png' {
  const value: any;
  export default value;
}

type AssetKey = string;

interface Component {
  name: import('./components/types').default;
}

interface System {
  expectedComponents: import('./components/types').default[];

  update(entities: import('./Entity').default[], delta: number): void;
}

interface PhysicsObjectDictionary {
  [entityId: number]: Matter.Body;
}

interface RenderObjectDictionary {
  [entityId: number]: Phaser.GameObjects.Image;
}