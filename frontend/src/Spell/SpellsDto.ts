export interface SpellDto {
  owner: number;
  image: string;
  position: { x: number; y: number };
  ctx: CanvasRenderingContext2D;
  frames: number;
  currentFrame: number;
  side: "left" | "right";
}

export interface FireballDto extends SpellDto {
  dmg: number;
  velocity: number;
}
