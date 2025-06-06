import { isCast, spellCast } from "../main";
import { Spell } from "./Spell";

export class StaticSpell extends Spell {
  timer: number = 0;
  time: number;
  type: string = "static";
  constructor({
    id,
    image,
    position,
    ctx,
    frames,
    time,
  }: {
    id: number;
    image: string;
    position: { x: number; y: number };
    ctx: CanvasRenderingContext2D;
    frames: number;
    time: number;
  }) {
    super({ image, position, ctx, frames, id });
    this.time = time;
  }

  update({ deltaTime }: { deltaTime: number }) {
    this.timer += deltaTime;
    if (this.timer >= this.time) {
      isCast.value = false;
      spellCast.value = "";
      this.timer = 0;
      return;
    }
    this.draw();
  }
}
