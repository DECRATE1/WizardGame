import { Game } from "./Game/Game";
import { Fireball } from "./Spell/Fireball";
import { Spell } from "./Spell/Spell";

import { spellManager } from "./Spell/SpellManager";
import "./style.css";

export const canvas = document.querySelector("#game") as HTMLCanvasElement;
if (!canvas) {
  throw new Error("Canvas не найден");
}
export const ctx = canvas.getContext("2d")!;

function isLogin() {
  if (
    localStorage.getItem("accessToken") !== null &&
    localStorage.getItem("accessToken") !== undefined &&
    localStorage.getItem("refreshToken") !== null &&
    localStorage.getItem("refreshToken") !== undefined
  ) {
    gameButton.style.display = "block";
    loginDiv!.style.display = "none";
    return;
  }
  loginDiv!.style.display = "flex";
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

async function getUser(username: string) {
  console.log(username);
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const isValid = await fetch(
    `http://localhost:3000/api/user/getByUsername/${username}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    }
  );
  if (!isValid.ok) {
    console.log(username);
    const tokens = await fetch("http://localhost:3000/api/auth/refresh", {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
      method: "GET",
    }).then(async (tokens) => await tokens.json());

    if (!tokens.ok) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refresToken");
      return;
    }
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("accessToken", tokens.refresToken);
  }
}

getUser(localStorage.getItem("username") as string);

const loginDiv = document.getElementById("loginDiv");
const submitButton = document.getElementById("submitButton");
const submitFunction = async () => {
  const url = signUpIsShown
    ? "http://localhost:3000/api/auth/signup"
    : "http://localhost:3000/api/auth/signin";
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
  if (body.ok) {
    localStorage.setItem("username", usernameInput.value);

    const data = await body.json();

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    const response = await fetch(
      `http://localhost:3000/api/user/getByUsername/${usernameInput.value}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    const user = await response.json();
    localStorage.setItem("id", user.id);
    return;
  }

  if (document.getElementById("message") !== null) {
    const message = document.getElementById("message");
    message!.style.display = "block";
    return;
  }
  const message = document.createElement("div");
  message.id = "message";
  message.innerHTML = await JSON.parse(await body.text()).message;
  loginDiv!.appendChild(message);
  return;
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

  const message = document.getElementById("message");
  if (message) {
    message!.style.display = "none";
    return;
  }
  message!.style.display = "";
});

signUp?.addEventListener("click", () => {
  signIn!.style.display = "block";
  signUp!.style.display = "none";
  usernameInput.value = "";
  passwordInput.value = "";
  signUpIsShown = true;
});

export const game = new Game({ ctx, canvas });

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
window.onbeforeunload = () => {
  sessionStorage.clear();
};
document.body.appendChild(gameButton);
canvas.style.backgroundColor = "black";

const fireball = Fireball.create({
  image: "1",
  position: { x: 1, y: 1 },
  ctx: game.ctx,
  side: "left",
  dmg: 10,
  velocity: 1,
  owner: 1,
  frames: 1,
  currentFrame: 1,
});

function render() {
  isLogin();
  game.render();
  window.requestAnimationFrame(render);
}
render();
