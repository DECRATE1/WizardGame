import { Game } from "./Game/Game";
import { Spell } from "./Spell/Spell";

import { spellManager } from "./Spell/SpellManager";
import "./style.css";

export function drawAGame() {
  const section = document.createElement("div");
  const board = document.createElement("div");
  const button = document.createElement("div");
  const castLine = document.createElement("div");
  castLine.id = "castLine";

  castLine.style.width = "523px";
  castLine.style.height = "64px";
  castLine.style.backgroundColor = "blue";
  castLine.style.position = "absolute";
  castLine.style.top = "64px";
  castLine.style.left = import.meta.env.VITE_CANVAS_WIDTH / 3.1 + "px";
  castLine.style.display = "flex";
  castLine.style.overflow = "hidden";
  castLine.style.flexWrap = "nowrap";
  castLine.style.gap = "11px";

  section.style.display = "flex";
  section.style.flexDirection = "column";
  section.style.position = "absolute";
  section.style.top = "0";
  section.style.left = "0";
  section.style.width = "100%";
  section.style.justifyItems = "center";
  section.style.alignItems = "center";
  section.style.marginTop = "20px";

  button.style.backgroundImage = `url('/button.png')`;
  button.style.textAlign = "center";
  button.style.color = "white";
  button.style.width = "128px";
  button.style.height = "128px";
  button.style.backgroundSize = "cover";
  button.style.backgroundRepeat = "no-repeat";
  button.onclick = () => {
    spellManager.addToCasting({ id: +spellManager.spellCast });
    spellManager.spellCast = "";

    while (castLine.firstChild) {
      castLine.removeChild(castLine.lastChild as ChildNode);
    }
  };

  board.id = "#board";
  board.style.width = "400px";
  board.style.height = "400px";
  board.style.display = "grid";
  board.style.gap = "10px";

  for (let i = 0; i < 9; i++) {
    const button = document.createElement("span");
    button.style.width = (+board.style.width / 9).toString();
    button.style.height = (+board.style.height / 9).toString();
    button.style.display = "flex";

    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.backgroundImage = `url('/${i}.png')`;
    button.style.backgroundRepeat = "no-repeat";
    button.style.backgroundSize = "cover";

    button.style.gridColumn = ((i % 3) + 1).toString();

    button.style.color = "red";
    button.addEventListener("click", () => {
      spellManager.spellCast += i + 1;

      button.style.filter = "opacity(20%)";
      if (castLine) {
        const div = document.createElement("div");
        div.style.backgroundImage = `url('/${i}.png')`;
        div.style.backgroundRepeat = "no-repeat";
        div.style.backgroundSize = "cover";
        div.style.width = "64px";
        div.style.height = "64px";
        div.style.flexShrink = "0";
        castLine.appendChild(div);
      }
      setTimeout(() => {
        button.style.filter = "none";
      }, 200);
    });
    board.appendChild(button);
  }

  section.appendChild(board);
  section.appendChild(button);
  document.body.appendChild(section);
  document.body.appendChild(castLine);
}

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
