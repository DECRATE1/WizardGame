import { Enemy } from "../Enemy/Enemy";
import { drawAGame } from "../main";

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
}
