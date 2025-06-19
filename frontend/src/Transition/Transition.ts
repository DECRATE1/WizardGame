import { game } from "../main";

export class Transition {
  firstLine = { x: 0, y: 0, w: 0 };
  secondLine = {
    x: import.meta.env.VITE_CANVAS_WIDTH,
    y: Math.floor(import.meta.env.VITE_CANVAS_HEIGHT / 3.5),
    w: 0,
  };
  thirdLine = {
    x: 0,
    y: Math.floor(import.meta.env.VITE_CANVAS_HEIGHT / 1.75),
    w: 0,
  };
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.canvas.width = import.meta.env.VITE_CANVAS_WIDTH;
    this.canvas.height = import.meta.env.VITE_CANVAS_HEIGHT;
    this.canvas.style.position = "absolute";
    this.canvas.style.left = "0px";
    this.canvas.style.top = "0px";
    this.canvas.style.zIndex = "-10";

    document.body.appendChild(this.canvas);
  }

  forwardAnimation({
    stateTo,
  }: {
    stateTo: "menu" | "game" | "lobbyList" | "lobby";
  }) {
    this.canvas.style.zIndex = "10";
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(
        this.firstLine.x,
        this.firstLine.y,
        this.firstLine.w,
        Math.floor(this.canvas.height / 3.5)
      );

      this.ctx.fillStyle = "blue";
      this.ctx.fillRect(
        this.secondLine.x,
        this.secondLine.y,
        this.secondLine.w,
        Math.floor(this.canvas.height / 3.5)
      );

      this.ctx.fillStyle = "red";
      this.ctx.fillRect(
        this.thirdLine.x,
        this.thirdLine.y,
        this.thirdLine.w,
        Math.floor(this.canvas.height / 3.5)
      );

      this.firstLine.w += 2;
      this.secondLine.w -= 2;
      this.thirdLine.w += 2;

      const animationId = window.requestAnimationFrame(() =>
        this.forwardAnimation({ stateTo })
      );

      if (
        this.firstLine.w >= this.canvas.width &&
        this.secondLine.w >= -this.canvas.width &&
        this.thirdLine.w >= this.canvas.width
      ) {
        window.cancelAnimationFrame(animationId);

        this.backwardAnimation();
        game.state = stateTo;
        return;
      }
    }
  }

  backwardAnimation() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "white";

      this.ctx.fillRect(
        this.firstLine.x,
        this.firstLine.y,
        this.firstLine.w,
        Math.floor(this.canvas.height / 3.5)
      );

      this.ctx.fillStyle = "blue";

      this.ctx.fillRect(
        this.secondLine.x,
        this.secondLine.y,
        this.secondLine.w,
        Math.floor(this.canvas.height / 3.5)
      );

      this.ctx.fillStyle = "red";

      this.ctx.fillRect(
        this.thirdLine.x,
        this.thirdLine.y,
        this.thirdLine.w,
        Math.floor(this.canvas.height / 3.5)
      );

      this.firstLine.w -= 2;
      this.secondLine.w += 2;
      this.thirdLine.w -= 2;
    }
    const animationId = window.requestAnimationFrame(() =>
      this.backwardAnimation()
    );
    if (
      this.firstLine.w < 0 &&
      this.secondLine.w < this.canvas.width &&
      this.thirdLine.w < 0
    ) {
      this.canvas.style.zIndex = "-10";
      window.cancelAnimationFrame(animationId);
      return;
    }
  }
}
