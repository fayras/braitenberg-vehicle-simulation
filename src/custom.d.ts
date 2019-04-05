declare module '*.png' {
  const value: any;
  export default value;
}

interface Component {
  name: import('./components/types').default;
}

interface System {
  expectedComponents: import('./components/types').default[];

  update(entities: import('./Entity').default[], delta: number): void;
}
