import { enemy, spellManager } from "../main";
import { Sprite } from "../Sprite/Sprite";

export class Spell extends Sprite {
  id: number;
  frames: number;
  isDynamic: boolean;
  currentFrame: number = 0;

  dmg?: number;
  velocity?: number;
  deltaTime?: number;
  fn?: () => void;
  timer: number = 0;
  time?: number;
  abilityIsUsed = false;
  defaultParams: {
    pos: { x: number };
    timer?: number;
    dmg?: number;
    velocity?: number;
  };
  constructor({
    id,
    isDynamic,
    image,
    position,
    ctx,
    frames,
    dmg,
    velocity,
    deltaTime,
    time,
    fn,
  }: {
    id: number;
    image: string;
    isDynamic: boolean;
    position: { x: number; y: number };
    ctx: CanvasRenderingContext2D;
    frames: number;
    dmg?: number;
    velocity?: number;
    deltaTime?: number;
    time?: number;
    fn: () => void;
  }) {
    super({ image, position, ctx });
    this.frames = frames;
    this.id = id;
    this.dmg = dmg;
    this.velocity = velocity;
    this.deltaTime = deltaTime;
    this.fn = fn;
    this.defaultParams = {
      pos: { x: this.position.x },
      timer: this.timer,
      dmg: this.dmg,
      velocity: this.velocity,
    };
    this.time = time;
    this.isDynamic = isDynamic;
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

  update() {
    this.draw();

    if (this.isDynamic) {
      if (this.isColiding()) {
        this.onCollision();
        return;
      }
      this.position.x += this.velocity!;
      return;
    } else {
      if (this.timer <= this.time!) {
        !this.abilityIsUsed ? this.useAbility() : "";
        this.timer += this.deltaTime!;
        return;
      }

      this.fn!();
      this.abilityIsUsed = false;
      this.setTimerToDefault();
      spellManager.removeFromQueue({ id: this.id });
      return;
    }
  }

  setTimerToDefault() {
    this.timer = 0;
  }

  isColiding() {
    if (
      (this.position.x >= enemy.position.x - 32 &&
        this.position.x <= enemy.position.x) ||
      this.position.x >= import.meta.env.VITE_CANVAS_WIDTH
    ) {
      return true;
    }
    return false;
  }

  private onCollision() {
    this.useAbility();
    this.position.x = this.defaultParams.pos.x;
    spellManager.removeFromQueue({ id: this.id });
    return;
  }

  private useAbility() {
    if (this.fn) {
      this.fn();
      this.abilityIsUsed = true;
    }
  }
}
