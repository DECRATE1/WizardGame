import { Enemy } from "../Enemy/Enemy";

import { Player } from "../Player/Player";
import { spellManager } from "../Spell/SpellManager";
import { Sprite } from "../Sprite/Sprite";

export class Game {
  state: "menu" | "game" = "menu";
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  background: Sprite;
  player: Player;
  enemy: Enemy;
  rectW = 0;
  transitionCanvas = document.createElement("canvas");
  transitionCanvasCtx = this.transitionCanvas.getContext("2d");

  constructor({
    canvas,
    ctx,
  }: {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
  }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.background = new Sprite({
      image: "/Sprite-0007.png",
      position: { x: 0, y: 0 },
      ctx: this.ctx,
    });

    this.player = new Player({
      image: "/WizardSprite.png",
      position: { x: 140, y: Math.round(this.canvas.height / 1.3) },
      ctx: this.ctx,
      frames: 3,
    });

    this.enemy = new Enemy({
      image: "/Dummy.png",
      position: {
        x: this.canvas.width,
        y: Math.round(this.canvas.height / 1.3),
      },
      ctx: this.ctx,
      frames: 2,
    });
    this.transitionCanvas.style.position = "absolute";
    this.transitionCanvas.style.left = "0px";
    this.transitionCanvas.style.top = "0px";
    this.transitionCanvas.style.zIndex = "-10";
    this.transitionCanvas.width = import.meta.env.VITE_CANVAS_WIDTH;
    this.transitionCanvas.height = import.meta.env.VITE_CANVAS_HEIGHT;

    document.body.appendChild(this.transitionCanvas);
    this.render();
  }

  render() {
    if (this.state === "game") {
      this.background.draw();
      this.player.draw();
      this.enemy.draw();

      spellManager.getQueue().map((spell: any) => {
        if (spell.isDynamic) {
          spell.update();
          return;
        }

        spell.update();
        return;
      });
    }
  }

  transition() {
    if (this.transitionCanvasCtx) {
      this.transitionCanvas.style.zIndex = "10";
      this.transitionCanvasCtx.fillStyle = "red";
      this.playForward();
    }
  }

  private playForward() {
    if (this.transitionCanvasCtx) {
      this.transitionCanvasCtx.clearRect(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.transitionCanvasCtx.fillRect(0, 0, this.rectW, this.canvas.height);
    }
    const animationId = window.requestAnimationFrame(() => this.playForward());
    if (this.rectW >= this.canvas.width) {
      window.cancelAnimationFrame(animationId);
      this.state = "game";
      this.playBackward();

      return;
    }
    this.rectW += 1;
  }

  private playBackward() {
    if (this.transitionCanvasCtx) {
      this.transitionCanvasCtx.clearRect(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.transitionCanvasCtx.fillRect(0, 0, this.rectW, this.canvas.height);
    }
    const animationId = window.requestAnimationFrame(() => this.playBackward());
    if (this.rectW <= 0) {
      window.cancelAnimationFrame(animationId);
      return;
    }
    console.log(1);
    this.rectW -= 1;
  }
}
