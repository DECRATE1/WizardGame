import { enemy, spellManager } from "../main";
import { Sprite } from "../Sprite/Sprite";

export class Spell extends Sprite {
  id: number;
  frames: number;
  isDynamic: boolean;
  currentFrame: number = 0;
  defaultPos: number;
  dmg?: number;
  velocity?: number;
  deltaTime?: number;
  fn?: () => void;
  timer: number = 0;
  time?: number;
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
    this.defaultPos = this.position.x;
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
    }

    this.timer += this.deltaTime!;
    if (this.timer <= this.time!) {
      this.useAbility();

      return;
    }
    this.timer = 0;
    spellManager.removeFromQueue({ id: this.id });
  }

  isColiding() {
    if (
      this.position.x >= enemy.position.x - 32 &&
      this.position.x <= enemy.position.x
    ) {
      return true;
    }
    return false;
  }

  private onCollision() {
    this.useAbility();
    this.position.x = this.defaultPos;
    spellManager.removeFromQueue({ id: this.id });
    return;
  }

  private useAbility() {
    if (this.fn) this.fn();
    return;
  }
}
