import { Enemy } from "../Enemy/Enemy";
import { game } from "../main";
import { io, Socket } from "socket.io-client";
import { Player } from "../Player/Player";
import { spellManager } from "../Spell/SpellManager";
import { Sprite } from "../Sprite/Sprite";
import { Transition } from "../Transition/Transition";

export class Game {
  state: "menu" | "game" | "lobbyList" | "lobby" = "menu";
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  background: Sprite;
  players: Player[];
  transition = new Transition();
  isScaled = false;
  connectedToSocket = false;
  socket: Socket = io();
  constructor({
    canvas,
    ctx,
  }: {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
  }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.background = new Sprite({
      image: "/Sprite-0007.png",
      position: { x: 0, y: 0 },
      ctx: this.ctx,
    });

    this.players = [];

    this.render();
  }

  render() {
    switch (this.state) {
      case "game": {
        this.drawAGame();
        this.drawAGameScene();
        break;
      }
      case "lobbyList": {
        this.drawALobbyList();
        break;
      }
      case "lobby": {
        this.drawALobby();
        break;
      }
    }
  }

  /*transition({ state }: { state: "menu" | "game" }) {
    if (this.transitionCanvasCtx) {
      this.transitionCanvas.style.zIndex = "10";
      this.transitionCanvasCtx.fillStyle = "red";
      this.playForward({ state });
    }
  }

  private playForward({ state }: { state: "menu" | "game" }) {
    if (this.transitionCanvasCtx) {
      this.transitionCanvasCtx.clearRect(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.transitionCanvasCtx.fillRect(0, 0, this.rectW, this.canvas.height);
    }
    const animationId = window.requestAnimationFrame(() =>
      this.playForward({ state })
    );
    if (this.rectW >= this.canvas.width) {
      window.cancelAnimationFrame(animationId);
      this.state = state;
      drawAGame();
      this.playBackward();

      return;
    }
    this.rectW += 1;
  }

  private playBackward() {
    if (this.transitionCanvasCtx) {
      this.transitionCanvasCtx.clearRect(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.transitionCanvasCtx.fillRect(0, 0, this.rectW, this.canvas.height);
    }
    const animationId = window.requestAnimationFrame(() => this.playBackward());
    if (this.rectW <= 0) {
      window.cancelAnimationFrame(animationId);
      return;
    }
    console.log(1);
    this.rectW -= 1;
  }*/

  drawAGame() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.background.draw();

    /*this.player.position = {
      x: 140,
      y: Math.round(this.canvas.height / 1.3),
    };*/

    this.players.forEach((player) => {
      player.draw();
      player.drawHpBar();
      player.createHitbox();
    });

    spellManager.getSpellQueue().map((spell: any) => {
      spell.update();
    });
  }

  drawAGameScene() {
    if (
      document.getElementById("section") &&
      document.getElementById("castLine")
    )
      return;

    const section = document.createElement("div");
    section.id = "section";
    const board = document.createElement("div");
    const buttonSpell = document.createElement("div");
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

    buttonSpell.style.backgroundImage = `url('/button.png')`;
    buttonSpell.style.textAlign = "center";
    buttonSpell.style.color = "white";
    buttonSpell.style.width = "128px";
    buttonSpell.style.height = "128px";
    buttonSpell.style.backgroundSize = "cover";
    buttonSpell.style.backgroundRepeat = "no-repeat";
    buttonSpell.onclick = async () => {
      while (castLine.firstChild) {
        castLine.removeChild(castLine.lastChild as ChildNode);
      }
      const id = spellManager.spellCast;
      spellManager.spellCast = "";
      const userid = localStorage.getItem("id");
      const response = await fetch(
        `http://localhost:3000/api/lobby/getSide/${userid}`,
        {
          method: "GET",
        }
      );
      const side = await response.json().then((res) => res.sessionSide);

      this.socket.emit("castSpell", {
        lobbyid: localStorage.getItem("lobbyid"),
        side,
        spellid: id,
      });

      spellManager.addToQueue(id, side, this.socket.id);
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
    section.appendChild(buttonSpell);
    document.body.appendChild(section);
    document.body.appendChild(castLine);

    this.players.forEach((player, index) => {
      if (index === 0) {
        player.position = {
          x: 140,
          y: Math.round(this.canvas.height / 1.3),
        };

        return;
      }
      player.image.src = "WizardSprite_Reversed.png";
      player.position = {
        x: this.canvas.width + 48,
        y: Math.round(this.canvas.height / 1.3),
      };
    });

    this.socket.on("castSpell", (data) => {
      const { spellid, clientid, side } = data;
      if (this.socket.id === clientid) return;
      spellManager.addToQueue(spellid, side, clientid);
    });
  }

  drawALobbyList() {
    const list = document.getElementById("gameListContainer");

    if (list) return;
    const gameListContainer = document.createElement("div");
    gameListContainer.id = "gameListContainer";
    document.body.appendChild(gameListContainer);
    const createGameButton = document.createElement("div");
    createGameButton.id = "createGameButton";
    createGameButton.innerHTML = "+";
    createGameButton.style.right = import.meta.env.VITE_CANVAS_WIDTH + "px";
    createGameButton!.onclick = () => {
      lobbyCreateMenu!.style.display === "flex"
        ? (lobbyCreateMenu!.style.display = "none")
        : (lobbyCreateMenu!.style.display = "flex");
    };

    document.body.appendChild(createGameButton);

    const lobbyCreateMenu = document.getElementById("lobbyCreateMenu");
    lobbyCreateMenu!.style.left =
      import.meta.env.VITE_CANVAS_WIDTH * 2.1 + "px";
    const lobbyNameInput: HTMLInputElement = document.getElementById(
      "lobbyNameInput"
    ) as HTMLInputElement;
    lobbyCreateMenu!.style.zIndex = "20";
    lobbyNameInput!.onchange = (e) => {
      lobbyNameInput.value = (e.target as HTMLInputElement).value;
    };
    const lobbyCreateMenuBtn = document.getElementById("lobbyCreateMenuBtn");

    lobbyCreateMenuBtn!.onclick = async () => {
      const response = await fetch("http://localhost:3000/api/lobby/create", {
        method: "POST",
        body: JSON.stringify({
          title: lobbyNameInput.value,
        }),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        lobbyNameInput.value = "";
        lobbyCreateMenu!.style.display = "none";
        gameListContainer.style.display = "none";
        game.transition.forwardAnimation({ stateTo: "lobby" });
        return;
      }
      lobbyNameInput.value = "";
      lobbyCreateMenu!.style.display = "none";

      return;
    };

    const getList = async () => {
      const response = await fetch(
        "http://localhost:3000/api/lobby/getLobbys",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      data.map((item: any, index: number) => {
        const lobby = document.createElement("div");
        lobby.id = "lobby";
        const lobbyName = document.createElement("span");
        const joinButton = document.createElement("div");
        lobbyName.id = "lobbyName";
        lobbyName.innerHTML = item.lobbytitle as string;
        joinButton.id = "joinButton";
        joinButton.innerHTML = "join";
        joinButton.addEventListener("click", () => {
          localStorage.setItem("lobbyid", (1 + index).toString());
          game.transition.forwardAnimation({ stateTo: "lobby" });
          setTimeout(() => {
            gameListContainer.style.display = "none";
            createGameButton.style.display = "none";
          }, 2005);
        });
        lobby.appendChild(lobbyName);
        lobby.appendChild(joinButton);
        gameListContainer.appendChild(lobby);
        return;
      });
    };
    getList();
  }

  drawALobby() {
    this.players.forEach((player) => player.draw());
    if (!this.connectedToSocket) {
      this.connectedToSocket = true;

      this.socket = io(`ws://localhost:8080/lobby`);

      this.socket.on("connect", () => {
        console.log(`user ${localStorage.getItem("id")} connected`);
      });

      this.socket.emit("connectLobby", {
        userid: localStorage.getItem("id"),
        lobbyid: localStorage.getItem("lobbyid"),
      });

      this.socket.on("connectLobby", (data) => {
        const { players, socketids } = data;
        this.players = players.map((player: any, index: number) => {
          return index === 0
            ? new Player({
                image: "/WizardSprite.png",
                position: { x: 0, y: 0 },
                ctx: this.ctx,
                frames: 3,
                sessionid: socketids[index],
              })
            : new Player({
                image: "/WizardSprite.png",
                position: {
                  x: 0,
                  y: 0,
                },
                ctx: this.ctx,
                frames: 3,
                sessionid: socketids[index],
              });
        });

        this.players.forEach((player, index) => {
          player.position.x = this.canvas.width / 1.5 + index * 50;
          player.position.y = Math.ceil(
            import.meta.env.VITE_CANVAS_HEIGHT / 2.1
          );

          if (
            !document.getElementById("readyStateDiv" + data.socketids[index])
          ) {
            const readyStateDiv = document.createElement("div");
            readyStateDiv.id = "readyStateDiv" + data.socketids[index];
            const readyContainer = document.getElementById("readyContainer");

            readyStateDiv.style.cssText = `
              width: ${180}px;
              position: absolute;
              justify-items: center;
              align-items: center;
              text-align: center;`;
            const readyStateText = document.createElement("span");
            readyStateText.style.cssText = `
              color: ${data.players[index].playerisReady ? "green" : "red"};
              font-weight: bolder;
              font-size: x-large;
              font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;`;
            readyStateText.id = "readyStateText" + data.socketids[index];
            readyStateDiv.appendChild(readyStateText);
            readyStateText.innerHTML = data.players[index].playerisReady
              ? "READY"
              : "NOT READY";
            readyStateDiv.style.left = 66.1 + index * 16.3 + "rem";
            readyStateDiv.style.top = this.canvas.height * 2.5 + "px";

            readyContainer?.appendChild(readyStateDiv);
          }
          if (data.removeElement !== null) {
            const dataToRemove = document.getElementById(data.removeElement);
            dataToRemove?.remove();
            const elementToChange = "readyStateDiv" + data.socketids[0];
            const readyStateDiv = document.getElementById(elementToChange);
            readyStateDiv!.style.left = 66.1 + 0 * 16.3 + "rem";
          }

          this.socket.on("readyState", (state) => {
            const readyStateText = document.getElementById(
              "readyStateText" + state.sockeid
            );

            if (state.state) {
              readyStateText!.innerHTML = "READY";
              readyStateText!.style.color = "green";
              this.socket.emit("everyoneIsReady", {
                lobbyid: localStorage.getItem("lobbyid"),
              });
              return;
            }
            readyStateText!.innerHTML = "NOT READY";
            readyStateText!.style.color = "red";
          });
        });
      });

      /*this.socket.on("NumberOfPlayers", (data) => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < data.numberOfConnections; i++) {
          const player = this.players[i];
          player.position.x = this.canvas.width / 1.5 + i * 50;
          player.position.y = Math.ceil(
            import.meta.env.VITE_CANVAS_HEIGHT / 2.1
          );
          console.log(player.image);
          player.draw();

          if (!document.getElementById("readyStateDiv" + data.socketids[i])) {
            const readyStateDiv = document.createElement("div");
            readyStateDiv.id = "readyStateDiv" + data.socketids[i];
            const readyContainer = document.getElementById("readyContainer");

            readyStateDiv.style.cssText = `
              width: ${180}px;
              position: absolute;
              justify-items: center;
              align-items: center;
              text-align: center;`;
            const readyStateText = document.createElement("span");
            readyStateText.style.cssText = `
              color: ${data.players[i].playerisReady ? "green" : "red"};
              font-weight: bolder;
              font-size: x-large;
              font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;`;
            readyStateText.id = "readyStateText" + data.socketids[i];
            readyStateDiv.appendChild(readyStateText);
            readyStateText.innerHTML = data.players[i].playerisReady
              ? "READY"
              : "NOT READY";
            readyStateDiv.style.left = 66.1 + i * 16.3 + "rem";
            readyStateDiv.style.top = this.canvas.height * 2.5 + "px";

            readyContainer?.appendChild(readyStateDiv);
          }
          if (data.removeElement !== null) {
            const dataToRemove = document.getElementById(data.removeElement);
            dataToRemove?.remove();
            const elementToChange = "readyStateDiv" + data.socketids[0];
            const readyStateDiv = document.getElementById(elementToChange);
            readyStateDiv!.style.left = 66.1 + 0 * 16.3 + "rem";
          }

          this.socket.on("readyState", (state) => {
            const readyStateText = document.getElementById(
              "readyStateText" + state.sockeid
            );

            if (state.state) {
              readyStateText!.innerHTML = "READY";
              readyStateText!.style.color = "green";
              this.socket.emit("everyoneIsReady", {
                lobbyid: localStorage.getItem("lobbyid"),
              });
              return;
            }
            readyStateText!.innerHTML = "NOT READY";
            readyStateText!.style.color = "red";
          });
        }
      });*/

      window.onbeforeunload = () => {
        this.socket.emit("dis", {
          userid: localStorage.getItem("id"),
          lobbyid: localStorage.getItem("lobbyid"),
          removeElement: "readyStateDiv" + this.socket.id,
        });
        localStorage.removeItem("lobbyid");
        sessionStorage.clear();
        return null;
      };
    }
    if (document.getElementById("playButton") !== null) return;
    const playButton = document.createElement("div");
    playButton.id = "playButton";
    playButton.innerHTML = "START";
    playButton.addEventListener("click", () => {
      this.socket.emit("ready", {
        lobbyid: localStorage.getItem("lobbyid"),
        userid: localStorage.getItem("id"),
      });

      this.socket.on("everyoneIsReady", (message) => {
        const { everyoneIsReady } = message;
        /*if (message.numberofPlayers ) {
          return;
        }*/
        if (everyoneIsReady) {
          game.transition.forwardAnimation({ stateTo: "game" });
          playButton.style.visibility = "hidden";
          const readyContainer = document.getElementById("readyContainer");
          readyContainer?.childNodes.forEach((child) => child.remove());
        }
      });
    });
    document.body.appendChild(playButton);

    return;
  }
}
