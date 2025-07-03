import { Spell } from "./Spell";
import type { FireballDto } from "./SpellsDto";

export class Fireball extends Spell {
  static id = 111;
  static dmg: number = 10;
  static velocity: number = 1;
  static image = "/fireball (3).png";
  constructor({ ctx, side, owner }: FireballDto) {
    super({
      image: Fireball.image,
      position:
        side === "left"
          ? {
              x: 100,
              y: Math.round(import.meta.env.VITE_CANVAS_HEIGHT / 1.32),
            }
          : { x: 0, y: 0 },
      ctx,
      frames: 1,
      currentFrame: 0,
      side,
      owner,
    });
  }

  update(): void {
    this.draw();
    this.useAbility();
    this.position.x += Fireball.velocity!;
  }

  useAbility() {
    console.log(1);
  }
}
