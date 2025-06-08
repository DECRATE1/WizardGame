export interface SpellInterface {
  image: string;
  position: { x: number; y: number };
  isDynamic: boolean;
  ctx: CanvasRenderingContext2D;
  frames: number;
  velocity?: number;
  id: number;
  dmg?: number;
  fn?: () => void;
}
