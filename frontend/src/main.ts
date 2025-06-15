import { Game } from "./Game/Game";
import { Spell } from "./Spell/Spell";

import { spellManager } from "./Spell/SpellManager";
import "./style.css";

export const canvas = document.querySelector("#game") as HTMLCanvasElement;
if (!canvas) {
  throw new Error("Canvas не найден");
}
export const ctx = canvas.getContext("2d")!;

export const game = new Game({ ctx, canvas });

const fireball = new Spell({
  image: "/fireball (3).png",
  position: {
    x: 100,
    y: Math.round(import.meta.env.VITE_CANVAS_HEIGHT / 1.32),
  },

  isDynamic: true,
  ctx: game.ctx,
  frames: 1,
  velocity: 1,
  id: 111,
  dmg: 10,
  fn: () => (game.enemy.hp -= fireball.dmg!),
});

const shield = new Spell({
  image: "/Shield.png",
  position: {
    x: import.meta.env.VITE_CANVAS_WIDTH / 2 + 16,
    y: import.meta.env.VITE_CANVAS_HEIGHT / 2.5,
  },

  isDynamic: false,
  deltaTime: 1,
  ctx: game.ctx,
  frames: 1,
  time: 200,
  id: 626,
  fn: () => {
    game.player.hp <= 150 ? (game.player.hp += 10) : "";
  },
});

const wind = new Spell({
  image: "",
  position: { x: 0, y: 0 },
  isDynamic: false,
  deltaTime: 1,
  ctx: game.ctx,
  frames: 0,
  time: 200,
  id: 444,
  fn: () => {
    spellManager.getQueue().forEach((spell: any) => {
      spell.velocity += 10;
      setTimeout(() => {
        spell.velocity = spell.defaultParams.velocity;
      }, wind.time! * 10);
    });
  },
});

spellManager.addSpellToMap({ id: wind.id, value: wind });
spellManager.addSpellToMap({ id: fireball.id, value: fireball });
spellManager.addSpellToMap({ id: shield.id, value: shield });

const gameButton = document.createElement("button");

gameButton.innerHTML = "game";
gameButton.style.width = "100px";
gameButton.style.height = "100px";
gameButton.style.backgroundColor = "red";
gameButton.style.position = "absolute";
gameButton.style.left = "0px";
gameButton.style.top = "0px";
gameButton.addEventListener("click", () => {
  game.transition.forwardAnimation();
  gameButton.style.visibility = "hidden";
});
document.body.appendChild(gameButton);
canvas.style.backgroundColor = "black";
function render() {
  game.render();
  window.requestAnimationFrame(render);
}
render();
