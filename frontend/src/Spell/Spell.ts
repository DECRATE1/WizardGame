import { isCast, spellCast } from "../main";
import { Sprite } from "../Sprite/Sprite";

export class Spell extends Sprite {
  frames: number;
  currentFrame: number = 0;
  defaultPos: number;
  constructor({
    image,
    position,
    ctx,
    frames,
  }: {
    image: string;
    position: { x: number; y: number };
    ctx: CanvasRenderingContext2D;
    frames: number;
  }) {
    super({ image, position, ctx });
    this.frames = frames;
    this.defaultPos = this.position.x;
  }

  draw(): void {
    if (this.isLoad) {
      this.ctx.drawImage(
        this.image,
        (this.image.width / this.frames) * this.currentFrame,
        0,
        this.image.width / this.frames,
        this.image.height,
        this.position.x - this.image.width,
        this.position.y - this.image.height,
        this.image.width / this.frames,
        this.image.height
      );
    }
  }

  isColiding({ enemyPos }: { enemyPos: { x: number } }) {
    if (this.position.x >= enemyPos.x - 32 && this.position.x <= enemyPos.x) {
      spellCast.value = "";
      isCast.value = false;
      return true;
    }
    return false;
  }
}
