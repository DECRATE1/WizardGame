import { Enemy } from "../Enemy/Enemy";

import { Player } from "../Player/Player";
import { spellManager } from "../Spell/SpellManager";
import { Sprite } from "../Sprite/Sprite";
import { Transition } from "../Transition/Transition";

export class Game {
  state: "menu" | "game" = "menu";
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  background: Sprite;
  player: Player;
  enemy: Enemy;
  transition = new Transition();
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

  /*transition({ state }: { state: "menu" | "game" }) {
    if (this.transitionCanvasCtx) {
      this.transitionCanvas.style.zIndex = "10";
      this.transitionCanvasCtx.fillStyle = "red";
      this.playForward({ state });
    }
  }

  private playForward({ state }: { state: "menu" | "game" }) {
    if (this.transitionCanvasCtx) {
      this.transitionCanvasCtx.clearRect(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.transitionCanvasCtx.fillRect(0, 0, this.rectW, this.canvas.height);
    }
    const animationId = window.requestAnimationFrame(() =>
      this.playForward({ state })
    );
    if (this.rectW >= this.canvas.width) {
      window.cancelAnimationFrame(animationId);
      this.state = state;
      drawAGame();
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
  }*/
}
