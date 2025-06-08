export class Sprite {
  image = new Image();
  position: { x: number; y: number };
  isLoad = false;
  ctx: CanvasRenderingContext2D;

  constructor({
    image,
    position,
    ctx,
  }: {
    image: string;
    position: { x: number; y: number };
    ctx: CanvasRenderingContext2D;
  }) {
    this.image.src = image;
    this.image.onload = () => {
      this.isLoad = true;
    };
    this.position = position;

    this.ctx = ctx;
  }

  draw() {
    if (this.isLoad) {
      this.ctx.drawImage(this.image, 0, 0);
    }
  }
}
