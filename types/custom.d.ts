declare module '*.png' {
  const value: string;
  export default value;
}

declare namespace EventMessages {
  interface ApplyForce {
    id: number;
    offset: Phaser.Physics.Matter.Matter.Vector;
    force: Phaser.Physics.Matter.Matter.Vector;
  }
}

type AssetKey = string;
type EventMessage = EventMessages.ApplyForce;
type EventHandler = (event: EventMessage) => void;
