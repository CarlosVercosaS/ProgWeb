import { space } from "./space.js";
import { getEnemyShips, removeEnemyShip } from "./enemyShip.js";
import { addScore } from "./game.js";

class Bullet {
  constructor(x, y) {
    this.element = document.createElement("div");
    this.element.className = "bullet";
    this.element.style.left = `${x}px`;
    this.element.style.bottom = `${y}px`;

    space.element.appendChild(this.element);
  }

  move() {
    const currentBottom = parseInt(this.element.style.bottom);
    this.element.style.bottom = `${currentBottom + 5}px`;
  }

  isOffScreen() {
    return parseInt(this.element.style.bottom) > space.element.offsetHeight;
  }

  checkCollision() {
    const enemies = getEnemyShips();
    for (let enemy of enemies) {
      const bulletRect = this.element.getBoundingClientRect();
      const enemyRect = enemy.element.getBoundingClientRect();

      if (
        bulletRect.left < enemyRect.right &&
        bulletRect.right > enemyRect.left &&
        bulletRect.top < enemyRect.bottom &&
        bulletRect.bottom > enemyRect.top
      ) {
        removeEnemyShip(enemy);
        this.destroy();
        addScore(50);  // conforme especificação: 50 pontos por EnemyShip
        break;
      }
    }
  }

  destroy() {
    space.element.removeChild(this.element);
    bullets.splice(bullets.indexOf(this), 1);
  }
}

const bullets = [];

export const createBullet = (x, y) => {
  bullets.push(new Bullet(x, y));
};

export const moveBullets = () => {
  bullets.forEach(bullet => {
    bullet.move();
    bullet.checkCollision();

    if (bullet.isOffScreen()) {
      bullet.destroy();
    }
  });
};
