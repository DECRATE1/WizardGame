import { Sprite } from "../Sprite/Sprite";

export class Player extends Sprite {
  frames: number;
  currentFrame: number = 0;
  hp = 100;
  prevHealth;

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
    this.prevHealth = this.hp;
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

  createHitbox(): void {
    this.ctx.fillStyle = "rgba(255,0,0,255)";
    this.ctx.fillRect(
      this.position.x - this.image.width,
      this.position.y - this.image.height,
      this.image.width / this.frames,
      this.image.height
    );
  }

  drawHpBar(): void {
    if (this.image.src.split("/")[3] === "WizardSprite_Reversed.png") {
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(this.position.x + this.image.width - 50, 5, 100, 1);
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(this.position.x - this.image.width - 50, 5, this.hp, 1);
      return;
    }

    this.ctx.fillStyle = "white";
    this.ctx.fillRect(this.position.x - this.image.width + 10, 5, 100, 1);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.position.x - this.image.width + 10, 5, this.hp, 1);
  }
}
