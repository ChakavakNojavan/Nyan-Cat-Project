class Engine {
  constructor(theRoot) {
    this.root = theRoot;
    this.player = new Player(this.root);
    this.enemies = [];
    addBackground(this.root);
    this.music = new Audio();
    this.music.src = "https://www.nyan.cat/music/vday.mp3";
    this.music.loop = true;
    this.lives = 3;
  }

  gameLoop() {
    if (this.lastFrame === undefined) {
      this.lastFrame = new Date().getTime();
    }

    let timeDiff = new Date().getTime() - this.lastFrame;

    this.lastFrame = new Date().getTime();
    this.enemies.forEach((enemy) => {
      enemy.update(timeDiff);
    });

    this.enemies = this.enemies.filter((enemy) => {
      return !enemy.destroyed;
    });

    while (this.enemies.length < MAX_ENEMIES) {
      const spot = nextEnemySpot(this.enemies);
      this.enemies.push(new Enemy(this.root, spot));
    }

    if (this.isPlayerDead()) {
      this.lives--;
      if (this.lives === 2) {
        window.alert("2 more lives left!");
      }
      if (this.lives === 1) {
        window.alert("Only 1 life left!");
      }
      if (this.lives === 0) {
        window.alert("GAME OVER");
        location.reload();
      }
    }
    this.music.play();
    setTimeout(() => this.gameLoop(), 20);
  }

  start() {
    document.getElementById("start-button").addEventListener("click", () => {
      const keydownHandler = (event) => {
        if (event.code === "ArrowLeft") {
          if (!this.player.moving) {
            this.player.moveLeft();
          }
        }

        if (event.code === "ArrowRight") {
          if (!this.player.moving) {
            this.player.moveRight();
          }
        }
      };

      document.addEventListener("keydown", keydownHandler);

      this.gameLoop();
    });
  }

  isPlayerDead = () => {
    const playerLeft = this.player.x;
    const playerRight = this.player.x + PLAYER_WIDTH;
    const playerTop = GAME_HEIGHT - PLAYER_HEIGHT - 10;

    let result = false;

    this.enemies.forEach((enemy) => {
      const enemyLeft = enemy.x;
      const enemyRight = enemy.x + ENEMY_WIDTH;
      const enemyBottom = enemy.y + ENEMY_HEIGHT;

      if (
        playerRight === enemyRight &&
        playerLeft === enemyLeft &&
        playerTop <= enemyBottom
      ) {
        result = true;
        return;
      }
    });

    return result;
  };
}
