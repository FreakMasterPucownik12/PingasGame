class GameArea {
  constructor(elementId) {
    this.element = document.getElementById(elementId);
    this.rect = this.element.getBoundingClientRect();
  }

  updateBounds() {
    this.rect = this.element.getBoundingClientRect();
  }

  isInside(x, y, width, height) {
    return (
      x >= 0 &&
      y >= 0 &&
      x + width <= this.rect.width &&
      y + height <= this.rect.height
    );
  }
}

class Sprite {
  constructor(elementId, gameArea, speed = 20) {
    this.element = document.getElementById(elementId);
    this.gameArea = gameArea;
    this.x = 100;
    this.y = 100;
    this.width = 50;
    this.height = 50;
    this.speed = speed;
    this.render();

  }

  move(dx, dy) {
    const newX = this.x + dx;
    const newY = this.y + dy;

    if (this.gameArea.isInside(newX, newY, this.width, this.height)) {
      this.x = newX;
      this.y = newY;
      this.render();
    }
  }

  render() {
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }
}

const gameArea = new GameArea('game-area');
const sprite = new Sprite('sprite', gameArea);

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'w') sprite.move(0, -sprite.speed);
  if (key === 'a') sprite.move(-sprite.speed, 0);
  if (key === 's') sprite.move(0, sprite.speed);
  if (key === 'd') sprite.move(sprite.speed, 0);
});
class Obstacle {
  constructor(gameArea, imageSrc) {
    this.gameArea = gameArea;
    this.element = document.createElement('img');
    this.element.src = imageSrc;
    this.element.className = 'obstacle';
    this.gameArea.element.appendChild(this.element);
    this.element.style.width = '85px';
    this.element.style.height = '85px';
    this.width = 85;
    this.height = 85;
    this.reset();
  }

  reset() {
    this.x = this.gameArea.rect.width;
    this.y = Math.random() * (this.gameArea.rect.height - this.height);
    this.speed = 10 + Math.random() * 3;
    this.render();
  }

  update() {
    this.x -= this.speed;
    if (this.x + this.width < 0) {
      this.reset();
    }
    this.render();
  }

  render() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  checkCollision(sprite) {
    return !(
      sprite.x + sprite.width < this.x ||
      sprite.x > this.x + this.width ||
      sprite.y + sprite.height < this.y ||
      sprite.y > this.y + this.height
    );
  }
}


const obstacleCount = 9;
const obstacles = [];

for (let i = 0; i < obstacleCount; i++) {
  obstacles.push(new Obstacle(gameArea, 'R.png'));
}


function animateObstacles() {
  obstacles.forEach(obstacle => obstacle.update());
  requestAnimationFrame(animateObstacles);
}
animateObstacles();


setInterval(() => {
  for (const obstacle of obstacles) {
    if (obstacle.checkCollision(sprite)) {
      alert('Game Over! Dostałes pingasem.');
      break;
    }
  }
}, 100);
let timeElapsed = 0;
const timerElement = document.getElementById('timer');

function updateTimer() {
  timeElapsed++;
  timerElement.textContent = `Time: ${timeElapsed}s`;
}

setInterval(updateTimer, 1000);



