import { game } from "../main";
import { Spell } from "./Spell";
import type { FireballDto } from "./SpellsDto";

export class Fireball extends Spell {
  id: string = "111";
  dmg: number;
  velocity: number;
  constructor({
    image,
    position,
    ctx,
    frames,
    currentFrame,
    side,
    dmg,
    velocity,
    owner,
  }: FireballDto) {
    super({ image, position, ctx, frames, currentFrame, side, owner });
    this.dmg = dmg;
    this.velocity = velocity;
  }

  static create({
    image,
    position,
    ctx,
    frames,
    currentFrame,
    side,
    dmg,
    velocity,
    owner,
  }: FireballDto) {
    return new this({
      image,
      position,
      ctx,
      frames,
      currentFrame,
      side,
      dmg,
      velocity,
      owner,
    });
  }

  update(): void {
    this.draw();

    if (this.isColiding()) {
      this.useAbility();
      return;
    }
    this.side === "left"
      ? (this.position.x += this.velocity!)
      : (this.position.x -= this.velocity!);
    return;
  }

  useAbility() {
    console.log(1);
  }
}
