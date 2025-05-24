import { FPS } from "./config.js"
import { space } from "./space.js"
import { ship } from "./ship.js"
import { createRandomEnemyShip, moveEnemyShips } from "./enemyShip.js"
import { increaseSpeedFactor } from "./enemyShip.js";
import { createBullet, moveBullets } from "./bullet.js";


let score = 0;
let lives = 3;
let gameTime = 0;  // tempo total acumulado em segundos


let gameState = "stopped"; // 'stopped', 'running', 'paused', 'gameover'
let intervalId = null;

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");

const gameOverElement = document.getElementById("game-over");
const restartButton = document.getElementById("restart");

const pauseElement = document.getElementById("pause");

function showPause() {
  pauseElement.style.display = "block";
}

function hidePause() {
  pauseElement.style.display = "none";
}


function showGameOver() {
  gameOverElement.style.display = "block";
}

function hideGameOver() {
  gameOverElement.style.display = "none";
}

restartButton.addEventListener("click", startGame);

export const addScore = (points) => {
  score += points;
  updateHUD();
};


function updateHUD() {
  scoreElement.innerText = `Score: ${score}`;
  
  // Atualiza vidas
  livesElement.innerHTML = "";
  for (let i = 0; i < lives; i++) {
    const life = document.createElement("img");
    life.src = "assets/png/life.png";
    life.classList.add("life");
    livesElement.appendChild(life);
  }
}

function startGame() {
  if (gameState === "stopped" || gameState === "gameover") {
    gameState = "running";
    score = 0;
    lives = 3;
    updateHUD();
    clearInterval(intervalId);
    intervalId = setInterval(run, 1000 / FPS);
    hideGameOver();
  }
}

function pauseGame() {
  if (gameState === "running") {
    gameState = "paused";
    clearInterval(intervalId);
    showPause();
  } else if (gameState === "paused") {
    gameState = "running";
    intervalId = setInterval(run, 1000 / FPS);
    hidePause();
  }
}


function gameOver() {
  gameState = "gameover";
  clearInterval(intervalId);
  showGameOver();
}


function init() {
  setInterval(run, 1000 / FPS)
}

window.addEventListener("keydown", (e) => {
  if (e.repeat) return
  if (e.key === "ArrowLeft") ship.changeDirection(0);
  if (e.key === "ArrowRight") ship.changeDirection(2);
  if (e.code === "Space") {
  if (gameState === "stopped" || gameState === "gameover") {
    startGame();
  } else if (gameState === "running") {
    const shipRect = ship.element.getBoundingClientRect();
    const spaceRect = space.element.getBoundingClientRect();

    // Ajusta posição relativa ao espaço
    const x = shipRect.left - spaceRect.left + ship.element.offsetWidth / 2 - 2.5;
    const y = parseInt(ship.element.style.bottom) + ship.element.offsetHeight;

    createBullet(x, y);
  }
}

  if (e.key === "p" || e.key === "P") {
    pauseGame();
  }
});

window.addEventListener("keyup", (e) => {
  if (e.repeat) return
  if ((e.key === "ArrowLeft") && (ship.direction == 0)) ship.changeDirection(1);
  if ((e.key === "ArrowRight") && (ship.direction == 2)) ship.changeDirection(1);
});


function run() {
  if (gameState !== "running") return;

  space.move();
  ship.move();
  createRandomEnemyShip();
  moveEnemyShips();

  updateHUD();
  moveBullets();


  if (gameState === "running") {
  gameTime += 1 / FPS;

  if (gameTime >= 60) {  // A cada 60 segundos
    gameTime = 0;
    increaseSpeedFactor();
  }
  }

  checkShipCollision();

}

import { getEnemyShips, removeEnemyShip } from "./enemyShip.js";

function checkShipCollision() {
  const enemies = getEnemyShips();
  const shipRect = ship.element.getBoundingClientRect();

  for (let enemy of enemies) {
    const enemyRect = enemy.element.getBoundingClientRect();

    if (
      shipRect.left < enemyRect.right &&
      shipRect.right > enemyRect.left &&
      shipRect.top < enemyRect.bottom &&
      shipRect.bottom > enemyRect.top
    ) {
      removeEnemyShip(enemy);
      loseLife();
      break;
    }
  }
}

function loseLife() {
  lives--;
  updateHUD();

  ship.setDamaged(true);

  setTimeout(() => {
    ship.setDamaged(false);
  }, 5000);

  if (lives <= 0) {
    gameOver();
  }
}

init()