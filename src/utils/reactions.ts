type KernelFunction = (x: number, y: number) => number;
type VectorLike = Phaser.Types.Math.Vector2Like;

export function gaussian(center: VectorLike, sigma: VectorLike): KernelFunction {
  const x0 = center.x || 0;
  const y0 = center.y || 0;
  const sigmaX = sigma.x || 0;
  const sigmaY = sigma.y || 0;
  const sX = 2 * sigmaX ** 2;
  const sY = 2 * sigmaY ** 2;

  return (x: number, y: number) => {
    const exponent = -((x - x0) ** 2 / sX + (y - y0) ** 2 / sY);
    return Math.exp(exponent);
  };
}

export function flat(): KernelFunction {
  return () => 1.0;
}

export function flatCircle(center: VectorLike, radius: number): KernelFunction {
  const x0 = center.x || 0;
  const y0 = center.y || 0;
  const r2 = radius ** 2;

  return (x: number, y: number) => {
    return (x - x0) ** 2 + (y - y0) ** 2 <= r2 ? 1 : 0;
  };
}
