import { Player } from "../Player/Player";

export class Enemy extends Player {
  currentFrame: number = 0;
  constructor({
    image,
    position,
    frames,

    ctx,
  }: {
    image: string;
    position: {
      x: number;
      y: number;
    };
    frames: number;
    ctx: CanvasRenderingContext2D;
  }) {
    super({ image, position, frames, ctx });
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
}
