import { Spell } from "./Spell";
import type { ShieldDto } from "./SpellsDto";

export class Shield extends Spell {
  hp: number = 5;
  constructor({ position, ctx, frames, currentFrame, side, owner }: ShieldDto) {
    super({
      image: "Shield.png",
      position,
      ctx,
      frames,
      currentFrame,
      side,
      owner,
    });
  }

  useAbility(): void {
    console.log(this.hp);
  }
}
