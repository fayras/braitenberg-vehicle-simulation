declare module '*.png' {
  const value: any;
  export default value;
}

interface Component {
  name: import('./components/types').default;
}

interface System {
  update(entities: import('./Entity').default[], delta: number): void;
}
