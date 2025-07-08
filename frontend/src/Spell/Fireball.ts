import { game } from "../main";
import { Spell } from "./Spell";
import type { FireballDto } from "./SpellsDto";

export class Fireball extends Spell {
  static id = 111;
  static dmg: number = 10;
  static velocity: number = 1;
  constructor({ ctx, side, owner, sessionid }: FireballDto) {
    super({
      position:
        side === "left"
          ? {
              x: 100,
              y: Math.round(import.meta.env.VITE_CANVAS_HEIGHT / 1.32),
            }
          : {
              x: game.players[1].position.x - 100,
              y: Math.round(import.meta.env.VITE_CANVAS_HEIGHT / 1.32),
            },
      ctx,
      frames: 1,
      currentFrame: 0,
      side,
      image: side === "left" ? "/fireball (3).png" : "/fireball (3)reverse.png",
      owner,
      sessionid,
    });
  }

  update(): void {
    this.draw();
    this.isColiding() ? this.onCollision() : "";
    if (this.side === "left") {
      this.position.x += Fireball.velocity!;
      return;
    }
    this.position.x -= Fireball.velocity!;
  }

  useAbility() {
    if (this.owner !== game.socket.id) return;
    game.socket.emit("dealDamage", {
      dmg: 10,
      lobbyid: localStorage.getItem("lobbyid"),
      owner: this.owner,
    });
  }
}
