import { TAMX, PROB_ENEMY_SHIP } from "./config.js"
import { space } from "./space.js"

let speedFactor = 1;  // Começa normal

class EnemyShip {
  constructor() {
    this.element = document.createElement("img")
    this.element.className = "enemy-ship"
    this.element.src = "assets/png/enemyShip.png"
    this.element.style.top = "-20px"
    this.element.style.left = `${parseInt(Math.random() * TAMX)}px`
    space.element.appendChild(this.element)
  }
  move() {
    const currentTop = parseInt(this.element.style.top);
    this.element.style.top = `${currentTop + speedFactor}px`;
  }

}

const enemyShips = []

export const createRandomEnemyShip = () => {
  if (Math.random() < PROB_ENEMY_SHIP) enemyShips.push(new EnemyShip())
}

export const moveEnemyShips = () => {
  for (let i = enemyShips.length - 1; i >= 0; i--) {
    const enemy = enemyShips[i];
    enemy.move();

    if (parseInt(enemy.element.style.top) > space.element.offsetHeight) {
      space.element.removeChild(enemy.element);
      enemyShips.splice(i, 1);
    }
  }
};

export const increaseSpeedFactor = () => {
  speedFactor += 0.2;  // Aumenta 20% a cada minuto (ou ajuste conforme preferir)
  console.log("Velocidade dos inimigos aumentada!");  // Apenas para testes
};

export const getEnemyShips = () => enemyShips;

export const removeEnemyShip = (enemy) => {
  if (enemy.element.parentNode) {
    space.element.removeChild(enemy.element);
  }
  enemyShips.splice(enemyShips.indexOf(enemy), 1);
};
