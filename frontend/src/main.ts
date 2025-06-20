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
    gameButton.style.display = "block";
    loginDiv!.style.display = "none";
    return;
  }
  gameButton.style.display = "none";
  return;
}
let signUpIsShown: boolean = true;
const signUp = document.getElementById("signUp");
const signIn = document.getElementById("signIn");
const inputContainer = document.getElementById("inputContainer");
const usernameInput: HTMLInputElement = document.createElement("input");
const passwordInput: HTMLInputElement = document.createElement("input");
usernameInput.id = "usernameInput";
passwordInput.id = "passwordInput";
usernameInput.placeholder = "username";
passwordInput.placeholder = "password";

usernameInput.type = "text";
passwordInput.type = "password";

usernameInput.addEventListener("change", (e) => {
  e.preventDefault();
  usernameInput.value = (e.target as HTMLInputElement).value;
});
passwordInput.addEventListener("change", (e) => {
  e.preventDefault();
  passwordInput.value = (e.target as HTMLInputElement).value;
});
inputContainer?.appendChild(usernameInput);
inputContainer?.appendChild(passwordInput);
const loginDiv = document.getElementById("loginDiv");
const submitButton = document.getElementById("submitButton");
const submitFunction = async () => {
  const url = signUpIsShown
    ? "http://localhost:3000/api/user/create"
    : "http://localhost:3000/api/user/login";
  const body = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: usernameInput.value,
      password: passwordInput.value,
    }),
  });
  const data = await body.json();
  const token = data.access_token;
  localStorage.setItem("token", token);
};
submitButton!.onclick = (e) => {
  e.preventDefault();
  submitFunction();
};

signIn?.addEventListener("click", () => {
  signIn.style.display = "none";
  signUp!.style.display = "block";
  usernameInput.value = "";
  passwordInput.value = "";
  signUpIsShown = false;
});

signUp?.addEventListener("click", () => {
  signIn!.style.display = "block";
  signUp!.style.display = "none";
  usernameInput.value = "";
  passwordInput.value = "";
  signUpIsShown = true;
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
