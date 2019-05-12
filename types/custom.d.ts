declare module '*.png' {
  const value: string;
  export default value;
}

type AssetKey = string;

interface Component {
  name: import('../src/enums').ComponentType;
}
