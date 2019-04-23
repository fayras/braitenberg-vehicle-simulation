declare module '*.png' {
  const value: string;
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

interface RenderObjectDictionary {
  [entityId: number]: Phaser.GameObjects.Image;
}
