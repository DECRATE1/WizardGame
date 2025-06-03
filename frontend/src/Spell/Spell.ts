import { canvas } from "../main";
import { Sprite } from "../Sprite/Sprite";
import { ctx } from "../main";

export class Spell extends Sprite {
  frames: number;
  currentFrame: number = 0;
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

  update(): void {
    this.draw();
    this.position.x += 1;
  }
}
