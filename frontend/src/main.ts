import { Enemy } from "./Enemy/Enemy";
import { Player } from "./Player/Player";
import { Spell } from "./Spell/Spell";

import { SpellManager } from "./Spell/SpellManager";

import { Sprite } from "./Sprite/Sprite";
import "./style.css";

export const SpellMap = new Map<number, any>();
const section = document.createElement("div");
const board = document.createElement("div");
const button = document.createElement("div");
section.style.display = "flex";
section.style.flexDirection = "column";
section.style.position = "absolute";
section.style.top = "0";
section.style.left = "0";
section.style.width = "100%";
section.style.justifyItems = "center";
section.style.alignItems = "center";
section.style.marginTop = "20px";

button.innerHTML = "submit";
button.style.textAlign = "center";
button.style.color = "white";
button.style.width = "100%";
button.style.height = "30px";
button.onclick = () => {
  spellManager.addToCasting({ id: +spellManager.spellCast });
  spellManager.spellCast = "";
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
    setTimeout(() => {
      button.style.filter = "none";
    }, 200);
  });
  board.appendChild(button);
}

section.appendChild(board);
section.appendChild(button);
document.body.appendChild(section);

export const canvas = document.querySelector("#game") as HTMLCanvasElement;

if (!canvas) {
  throw new Error("Canvas не найден");
}

export const ctx = canvas.getContext("2d")!;

export const spellManager = new SpellManager();

const fireball = new Spell({
  image: "/fireball (3).png",
  position: {
    x: 100,
    y: Math.round(import.meta.env.VITE_CANVAS_HEIGHT / 1.32),
  },
  isDynamic: true,
  ctx,
  frames: 1,
  velocity: 2,
  id: 111,
  dmg: 10,
  fn: () => (enemy.hp -= fireball.dmg!),
});

const shield = new Spell({
  image: "/Shield.png",
  position: {
    x: import.meta.env.VITE_CANVAS_WIDTH / 2 + 16,
    y: canvas.height / 2.5,
  },
  isDynamic: false,
  deltaTime: 1,
  ctx,
  frames: 1,
  time: 200,
  id: 626,
  fn: () => {
    player.hp = 110;
    if (shield.timer >= shield.time!) {
      player.hp = 100;
    }
  },
});

spellManager.addSpellToMap({ id: fireball.id, value: fireball });
spellManager.addSpellToMap({ id: shield.id, value: shield });

const background = new Sprite({
  image: "/Sprite-0007.png",
  position: { x: 0, y: 0 },
  ctx,
});

const player = new Player({
  image: "/WizardSprite.png",
  position: { x: 140, y: Math.round(canvas.height / 1.3) },
  ctx,
  frames: 3,
});

export const enemy = new Enemy({
  image: "/Dummy.png",
  position: { x: canvas.width, y: Math.round(canvas.height / 1.3) },
  ctx,
  frames: 2,
});

function render() {
  background.draw();
  player.draw();
  enemy.draw();

  spellManager
    .getQueue()
    .map((spell: any) =>
      spell.type === "dynamic" ? spell.update() : spell.update({ deltaTime: 1 })
    );

  window.requestAnimationFrame(render);
}

render();
