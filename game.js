const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

let gameRunning = true;
let bigfootDistance = 0;
let score = 0;
const scoreIncrement = 1;
const scoreUpdateInterval = 1000; // Increment score every 1000 milliseconds
let lastScoreUpdateTime = Date.now();

const player = {
  x: canvas.width / 2,
  y: 50,
  width: 50,
  height: 50,
  speed: 5,
  moveUp: false,
  moveDown: false,
};

let obstacles = [];
const bigfoot = {
  x: player.x,
  y: 600,
  width: 60,
  height: 60,
  speed: 2,
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
  if (player.moveUp) player.y -= player.speed;
  if (player.moveDown) player.y += player.speed;
  if (player.moveLeft) player.x -= player.speed;
  if (player.moveRight) player.x += player.speed;

  // Ensure the player stays within canvas bounds
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}
function updateObstacles() {
  obstacles.forEach((obstacle) => (obstacle.y -= 5));
  obstacles = obstacles.filter((obstacle) => obstacle.y + obstacle.height > 0);

  if (Math.random() < 0.02) {
    const size = Math.random() * 50 + 25;
    obstacles.push({
      x: Math.random() * (canvas.width - size),
      y: canvas.height,
      width: size,
      height: size,
    });
  }
}

function updateBigfoot() {
  bigfoot.y -= bigfoot.speed;
  bigfoot.x = player.x;

  if (bigfoot.y < -bigfoot.height) {
    bigfoot.y = canvas.height + bigfootDistance;
    bigfootDistance = Math.max(0, bigfootDistance - 10);
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
  if (preciseAABBCollision(player, bigfoot)) {
    gameRunning = false;
  }
  obstacles.forEach((obstacle) => {
    if (preciseAABBCollision(player, obstacle)) {
      gameRunning = false;
    }
  });
  if (preciseAABBCollision(player, bigfoot)) {
    gameRunning = false;
    resetBigfootPosition(); // Reset Bigfoot's position on collision
  }
}

function resetBigfootPosition() {
  bigfoot.x = player.x;
  bigfoot.y = 600; // Starting y position off-canvas
  bigfootDistance = 0; // Reset the distance
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
  ctx.fillStyle = "blue";
  ctx.fillRect(bigfoot.x, bigfoot.y, bigfoot.width, bigfoot.height);
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
  bigfootDistance = 0;
  player.x = canvas.width / 2;
  player.y = 50;
  player.isJumping = false;
  player.velocityY = 0;
  obstacles = [];
  lastScoreUpdateTime = Date.now();
  resetBigfootPosition(); // Reset Bigfoot's position on restart
  requestAnimationFrame(updateGame);
}
updateGame();
