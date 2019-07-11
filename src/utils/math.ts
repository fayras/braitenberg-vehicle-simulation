export function noop(): void {}

export function gaussianRand(): number {
  let rand = 0;

  for (let i = 0; i < 6; i += 1) {
    rand += Math.random();
  }

  return rand / 6;
}

export function gaussianRandom(start: number, end: number): number {
  return Math.floor(start + gaussianRand() * (end - start + 1));
}
