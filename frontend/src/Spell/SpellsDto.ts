export interface SpellDto {
  owner: string;
  image: string;
  position: { x: number; y: number };
  ctx: CanvasRenderingContext2D;
  frames: number;
  currentFrame: number;
  side: "left" | "right";
  sessionid: string;
}

export interface FireballDto extends SpellDto {
  dmg: number;
  velocity: number;
}

export interface ShieldDto extends SpellDto {
  hp: number;
}
