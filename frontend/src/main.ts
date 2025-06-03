import { Enemy } from "./Enemy/Enemy";
import { Player } from "./Player/Player";
import { Spell } from "./Spell/Spell";
import { Sprite } from "./Sprite/Sprite";
import "./style.css";

let spellCast = "";
let isCast = false;
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
  isCast = true;
  console.log(isCast, spellCast);
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
  button.style.background = "blue";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";

  button.style.gridColumn = ((i % 3) + 1).toString();

  button.innerHTML = (1 + i).toString();
  button.style.color = "red";
  button.addEventListener("click", () => {
    spellCast += button.innerHTML;
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

const fireball = new Spell({
  image: "/fireball (3).png",
  position: { x: 100, y: Math.round(canvas.height / 1.32) },
  ctx,
  frames: 1,
});

SpellMap.set(111, fireball);

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

const enemy = new Enemy({
  image: "/Dummy.png",
  position: { x: canvas.width, y: Math.round(canvas.height / 1.3) },
  ctx,
  frames: 2,
});

function render() {
  background.draw();
  player.draw();
  enemy.draw();
  if (isCast) {
    if (SpellMap.has(+spellCast)) {
      SpellMap.get(+spellCast).update();
    }
  }
  window.requestAnimationFrame(render);
}

render();
