import { Enemy } from "../Enemy/Enemy";
import { game } from "../main";

import { Player } from "../Player/Player";
import { spellManager } from "../Spell/SpellManager";
import { Sprite } from "../Sprite/Sprite";
import { Transition } from "../Transition/Transition";

export class Game {
  state: "menu" | "game" | "lobbyList" | "lobby" = "menu";
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  background: Sprite;
  player: Player;
  enemy: Enemy;
  transition = new Transition();
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

    this.player = new Player({
      image: "/WizardSprite.png",
      position: { x: 140, y: Math.round(this.canvas.height / 1.3) },
      ctx: this.ctx,
      frames: 3,
    });

    this.enemy = new Enemy({
      image: "/Dummy.png",
      position: {
        x: this.canvas.width,
        y: Math.round(this.canvas.height / 1.3),
      },
      ctx: this.ctx,
      frames: 2,
    });

    this.render();
  }

  render() {
    switch (this.state) {
      case "game": {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.position = {
          x: 140,
          y: Math.round(this.canvas.height / 1.3),
        };
        this.background.draw();

        this.player.draw();
        this.player.createHitbox();
        this.player.drawHpBar();
        this.enemy.draw();
        this.drawAGameScene();

        spellManager.getQueue().map((spell: any) => {
          if (spell.isDynamic) {
            spell.update();
            return;
          }

          spell.update();
          return;
        });
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

  drawAGameScene() {
    if (
      document.getElementById("section") &&
      document.getElementById("castLine")
    )
      return;
    const section = document.createElement("div");
    section.id = "section";
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

  drawALobbyList() {
    const gamesList = [
      { lobbyName: "Name1", id: 1 },
      { lobbyName: "Name2", id: 2 },
    ];
    if (document.getElementById("gameListContainer") !== null) return;
    const gameListContainer = document.createElement("div");
    gameListContainer.id = "gameListContainer";

    gamesList.map((item) => {
      const lobby = document.createElement("div");
      lobby.id = "lobby";
      const lobbyName = document.createElement("span");
      const joinButton = document.createElement("div");
      lobbyName.id = "lobbyName";
      lobbyName.innerHTML = item.lobbyName;
      joinButton.id = "joinButton";
      joinButton.innerHTML = "join";
      joinButton.addEventListener("click", () => {
        game.transition.forwardAnimation({ stateTo: "lobby" });
        setTimeout(() => {
          gameListContainer.childNodes.forEach(
            (child: any) => (child.style.visibility = "hidden")
          );
        }, 2005);
      });
      lobby.appendChild(lobbyName);
      lobby.appendChild(joinButton);
      gameListContainer.appendChild(lobby);
    });

    document.body.appendChild(gameListContainer);
  }

  drawALobby() {
    this.player.position = {
      x: this.player.position.x,
      y: Math.floor(import.meta.env.VITE_CANVAS_HEIGHT / 2.5),
    };

    this.player.draw();
    if (document.getElementById("playButton") !== null) return;
    const playButton = document.createElement("div");
    playButton.id = "playButton";
    playButton.innerHTML = "START";
    playButton.addEventListener("click", () => {
      game.transition.forwardAnimation({ stateTo: "game" });
      playButton.style.visibility = "hidden";
    });
    document.body.appendChild(playButton);
  }
}
