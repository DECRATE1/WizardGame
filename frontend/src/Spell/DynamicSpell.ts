import { Spell } from "./Spell";

export class DynamicSpell extends Spell {
  velocity: number;
  type: string = "dynamic";
  constructor({
    id,
    image,
    position,
    ctx,
    frames,
    velocity,
  }: {
    id: number;
    image: string;
    position: {
      x: number;
      y: number;
    };
    ctx: CanvasRenderingContext2D;
    frames: number;
    velocity: number;
  }) {
    super({ image, position, ctx, frames, id });
    this.velocity = velocity;
  }

  update({ enemyPos }: { enemyPos: { x: number } }) {
    if (this.isColiding({ enemyPos })) {
      this.position.x = this.defaultPos;
      return;
    }

    this.draw();
    this.position.x += this.velocity;
  }
}
