import { Sprite } from "../Sprite/Sprite";

export class Player extends Sprite {
  frames: number;
  currentFrame: number = 0;
  hp = 100;
  constructor({
    image,
    position,
    frames,
    ctx,
  }: {
    image: string;
    position: { x: number; y: number };
    frames: number;
    ctx: CanvasRenderingContext2D;
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
    this.createHitbox();
    this.drawHpBar();
  }

  createHitbox(): void {
    this.ctx.fillStyle = "rgba(255,0,0,0)";
    this.ctx.fillRect(
      this.position.x - this.image.width,
      this.position.y - this.image.height,
      this.image.width / this.frames,
      this.image.height
    );
  }

  drawHpBar(): void {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(
      this.position.x / 2 - this.image.width / this.frames,
      5,
      100,
      5
    );
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(
      this.position.x / 2 - this.image.width / this.frames,
      5,
      this.hp,
      5
    );
  }
}
