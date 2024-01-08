const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

let gameRunning = true;
let bigfootActive = false;
let score = 0;
const scoreIncrement = 1;
const scoreUpdateInterval = 1000; // Increment score every 1000 milliseconds
let lastScoreUpdateTime = Date.now();
let playerSpeed = 5;

const player = {
  x: canvas.width / 2,
  y: 50,
  width: 50,
  height: 50,
  moveUp: false,
  moveDown: false,
  moveLeft: false,
  moveRight: false,
};

let obstacles = [];
const bigfoot = {
  x: -100,
  y: -100,
  width: 60,
  height: 60,
};

function updateGame() {
  if (!gameRunning) {
    drawGameOver();
    return;
  }

  const currentTime = Date.now();
  if (currentTime - lastScoreUpdateTime > scoreUpdateInterval) {
    score += scoreIncrement;
    lastScoreUpdateTime = currentTime;
    playerSpeed = 5 + Math.floor(score / 50);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updatePlayer();
  updateObstacles();
  updateBigfoot();
  checkCollisions();

  drawPlayer();
  drawObstacles();
  drawBigfoot();
  drawScore();

  requestAnimationFrame(updateGame);
}

function updatePlayer() {
  if (player.moveUp) player.y -= playerSpeed;
  if (player.moveDown) player.y += playerSpeed;
  if (player.moveLeft) player.x -= playerSpeed;
  if (player.moveRight) player.x += playerSpeed;

  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

function updateObstacles() {
  obstacles.forEach((obstacle) => (obstacle.y -= 5));
  obstacles = obstacles.filter((obstacle) => obstacle.y + obstacle.height > 0);

  if (Math.random() < 0.03) {
    let size;
    if (Math.random() < 0.5) {
      size = Math.random() * 25 + 10;
    } else {
      size = Math.random() * 50 + 25;
    }
    obstacles.push({
      x: Math.random() * (canvas.width - size),
      y: canvas.height,
      width: size,
      height: size,
    });
  }
}

function updateBigfoot() {
  if (bigfootActive) {
    bigfoot.x = player.x;
    bigfoot.y = player.y;
  } else {
    bigfoot.x = -100;
    bigfoot.y = -100;
  }
}

function preciseAABBCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function checkCollisions() {
  obstacles.forEach((obstacle) => {
    if (preciseAABBCollision(player, obstacle)) {
      bigfootActive = true;
      gameRunning = false;
    }
  });

  if (bigfootActive && preciseAABBCollision(player, bigfoot)) {
    gameRunning = false;
  }
}

function drawPlayer() {
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  ctx.fillStyle = "green";
  obstacles.forEach((obstacle) => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function drawBigfoot() {
  if (bigfootActive) {
    ctx.fillStyle = "blue";
    ctx.fillRect(bigfoot.x, bigfoot.y, bigfoot.width, bigfoot.height);
  }
}

function drawGameOver() {
  ctx.fillStyle = "black";
  ctx.font = "48px Arial";
  ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
  ctx.fillText(
    "Press R to Restart",
    canvas.width / 2 - 150,
    canvas.height / 2 + 50
  );
  drawScore();
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

window.addEventListener("keydown", function (e) {
  switch (e.key) {
    case "ArrowLeft":
      player.moveLeft = true;
      break;
    case "ArrowRight":
      player.moveRight = true;
      break;
    case "ArrowUp":
      player.moveUp = true;
      break;
    case "ArrowDown":
      player.moveDown = true;
      break;
    case "r":
    case "R":
      restartGame();
      break;
  }
});

window.addEventListener("keyup", function (e) {
  switch (e.key) {
    case "ArrowLeft":
      player.moveLeft = false;
      break;
    case "ArrowRight":
      player.moveRight = false;
      break;
    case "ArrowUp":
      player.moveUp = false;
      break;
    case "ArrowDown":
      player.moveDown = false;
      break;
  }
});

function restartGame() {
  gameRunning = true;
  score = 0;
  player.x = canvas.width / 2;
  player.y = 50;
  player.moveUp = player.moveDown = player.moveLeft = player.moveRight = false;
  playerSpeed = 5;
  obstacles = [];
  lastScoreUpdateTime = Date.now();
  bigfootActive = false;
  requestAnimationFrame(updateGame);
}

updateGame();
