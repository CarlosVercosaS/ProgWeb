import { TAMX } from "./config.js"
import { space } from "./space.js"

const directions = [
  "assets/png/playerLeft.png",
  "assets/png/player.png",
  "assets/png/playerRight.png",
]

const damagedImg = "assets/png/playerDamaged.png";


class Ship {
  constructor() {
    this.element = document.createElement("img")
    this.element.id = "ship"
    this.direction = 1
    this.element.src = directions[this.direction]
    this.element.style.bottom = "20px"
    this.element.style.left = `${TAMX / 2 - 50}px`
    space.element.appendChild(this.element)
  }
  changeDirection(giro) { // -1 +1
    this.direction = giro
    this.element.src = directions[this.direction]
  }
  move() {
    const currentLeft = parseInt(this.element.style.left);
    const shipWidth = this.element.width || 100;  // Caso ainda não carregue, assume 100

    if (this.direction === 0) {
      if (currentLeft > 0) {
        this.element.style.left = `${currentLeft - 1}px`;
      }
    }

    if (this.direction === 2) {
      if (currentLeft + shipWidth < TAMX) {
        this.element.style.left = `${currentLeft + 1}px`;
      }
    }
  }
  setDamaged(isDamaged) {
    if (isDamaged) {
      this.element.src = damagedImg;
    } else {
      this.element.src = directions[this.direction];
    }
  }


}

export const ship = new Ship()

