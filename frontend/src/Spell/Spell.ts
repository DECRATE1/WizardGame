import { game } from "../main";
import { Sprite } from "../Sprite/Sprite";
import type { SpellDto } from "./SpellsDto";
import { spellManager } from "./SpellManager";

/*export class Spell extends Sprite {
  id: number;
  sessionid?: string;
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
  side = "left";
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
      this.side === "left"
        ? (this.position.x += this.velocity!)
        : (this.position.x -= this.velocity!);
      return;
    } else {
      if (this.timer <= this.time!) {
        !this.abilityIsUsed ? this.useAbility() : "";
        this.timer += this.deltaTime!;
        return;
      }

      this.abilityIsUsed = false;
      this.setTimerToDefault();
      spellManager.removeFromQueue({
        id: this.id,
        sessionid: this.sessionid as string,
      });
      return;
    }
  }

  setTimerToDefault() {
    this.timer = 0;
  }

  isColiding() {
    if (
      this.side === "left" &&
      this.position.x >=
        game.players[1].position.x - game.players[1].image.width + 16 &&
      this.position.x <= game.players[1].position.x
    ) {
      console.log(this.position.x, game.players[1].position.x);

      return true;
    } else if (
      this.side === "right" &&
      this.position.x >=
        game.players[0].position.x - game.players[0].image.width &&
      this.position.x <= game.players[0].position.x - 52
    ) {
      console.log(1);
      return true;
    }
    return false;
  }

  private onCollision() {
    this.useAbility();
    game.enemy.takeADamage();
    this.position.x = this.defaultParams.pos.x;
    spellManager.removeFromQueue({
      id: this.id,
      sessionid: this.sessionid as string,
    });
    return;
  }

  private useAbility() {
    if (this.fn) {
      this.fn();
      this.abilityIsUsed = true;
    }
  }
}*/

export class Spell extends Sprite {
  static id = 0;
  static image = "sex";
  owner: string;
  sessionid: string;
  frames: number;
  side: "left" | "right";
  currentFrame: number;
  constructor({
    image,
    position,
    ctx,
    frames,
    side,
    owner,
    currentFrame,
    sessionid,
  }: SpellDto) {
    super({ image, position, ctx });
    this.frames = frames;
    this.side = side;
    this.owner = owner;
    this.currentFrame = currentFrame;
    this.sessionid = sessionid;
  }

  draw(): void {
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

  isColiding() {
    if (
      this.side === "left" &&
      this.position.x >=
        game.players[1].position.x - game.players[1].image.width + 16 &&
      this.position.x <= game.players[1].position.x
    ) {
      return true;
    } else if (
      this.side === "right" &&
      this.position.x >=
        game.players[0].position.x - game.players[0].image.width &&
      this.position.x <= game.players[0].position.x - 52
    ) {
      return true;
    }
    return false;
  }

  update() {
    this.draw();
  }

  useAbility() {
    console.log("Ability is used");
  }

  onCollision(): void {
    this.useAbility();
    spellManager.removeFromQueue(this.sessionid);
  }

  static getSpellId() {
    return this.id.toString();
  }
}
