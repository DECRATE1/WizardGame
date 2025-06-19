import { Game } from "./Game/Game";
import { Spell } from "./Spell/Spell";

import { spellManager } from "./Spell/SpellManager";
import "./style.css";

export const canvas = document.querySelector("#game") as HTMLCanvasElement;
if (!canvas) {
  throw new Error("Canvas не найден");
}
export const ctx = canvas.getContext("2d")!;

function isLogin() {
  if (window.localStorage.getItem("token") !== null) {
    gameButton.style.visibility = "auto";
  }
  gameButton.style.visibility = "hidden";
}

const signUp = document.getElementById("signUp");
const signIn = document.getElementById("signIn");
signIn?.addEventListener("click", () => {
  console.log(1);
  signIn.style.display = "none";
  signUp!.style.display = "block";
});

signUp?.addEventListener("click", () => {
  signIn!.style.display = "block";
  signUp!.style.display = "none";
});

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

const gameButton = document.createElement("div");

gameButton.id = "gameButton";
gameButton.innerHTML = "play";
gameButton.style.left = import.meta.env.VITE_CANVAS_WIDTH / 4 + "px";
gameButton.style.top = import.meta.env.VITE_CANVAS_HEIGHT + "px";
gameButton.style.position = "absolute";
gameButton.addEventListener("click", () => {
  game.transition.forwardAnimation({ stateTo: "lobbyList" });
  gameButton.style.visibility = "hidden";
});

document.body.appendChild(gameButton);
canvas.style.backgroundColor = "black";
function render() {
  isLogin();
  game.render();
  window.requestAnimationFrame(render);
}
render();
