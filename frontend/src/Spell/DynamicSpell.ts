import { enemy, spellManager } from "../main";
import { Spell } from "./Spell";

export class DynamicSpell extends Spell {
  velocity: number;
  type: string = "dynamic";
  dmg?: number;
  constructor({
    id,
    image,
    position,
    ctx,
    frames,
    velocity,
    dmg,
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
    dmg?: number;
  }) {
    super({ image, position, ctx, frames, id });
    this.velocity = velocity;
    this.dmg = dmg;
  }

  update({ enemyPos }: { enemyPos: { x: number } }) {
    if (this.isColiding({ enemyPos })) {
      this.position.x = this.defaultPos;
      if (this.dmg) {
        enemy.hp -= this.dmg;
      }
      spellManager.removeFromQueue({ id: this.id });
      return;
    }

    this.draw();
    this.position.x += this.velocity;
  }
}
