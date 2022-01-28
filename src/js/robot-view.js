/* globals PIXI */
const EventEmitter = require('events');

class RobotView {
  constructor(robot, tileSize, texture) {
    this.robot = robot;
    this.tileSize = tileSize;
    this.events = new EventEmitter();

    this.speed = RobotView.Speed.DEFAULT;

    this.sprite = RobotView.createSprite(tileSize, texture);
    this.sprite.x = this.robot.x * this.tileSize;
    this.sprite.y = this.robot.y * this.tileSize;
    this.defaultScale = {
      x: this.sprite.scale.x,
      y: this.sprite.scale.y,
    };

    this.animationQueue = [];
  }

  static createSprite(tileSize, texture) {
    const sprite = new PIXI.Sprite();
    sprite.width = tileSize;
    sprite.height = tileSize;
    sprite.roundPixels = true;
    sprite.texture = texture;

    return sprite;
  }

  teleport(x, y) {
    this.animationQueue.push({ type: 'teleport', x, y });
  }

  moveTo(x, y) {
    this.animationQueue.push({ type: 'move', x, y });
  }

  exitMaze() {
    this.animationQueue.push({ type: 'delay', time: 60 });
  }

  react(reaction, x, y) {
    this.animationQueue.push({ type: 'react', reaction, x, y });
    if (reaction === 'pit') {
      this.animationQueue.push({ type: 'fall', x, y, time: 30 });
    }
  }

  reset() {
    this.animationQueue.push({ type: 'reset' });
  }

  nop() {
    this.animationQueue.push({ type: 'delay', time: 20 });
  }

  animateReact(time, animation) {
    animation.done = true;
  }

  animateTeleport(time, animation) {
    this.sprite.x = animation.x * this.tileSize;
    this.sprite.y = animation.y * this.tileSize;
    animation.done = true;
  }

  animateMove(time, animation) {
    const destX = animation.x * this.tileSize;
    const destY = animation.y * this.tileSize;
    const deltaX = destX - this.sprite.x;
    const deltaY = destY - this.sprite.y;

    this.sprite.x += Math.min(Math.abs(deltaX), time * this.speed) * Math.sign(deltaX);
    this.sprite.y += Math.min(Math.abs(deltaY), time * this.speed) * Math.sign(deltaY);

    if (this.sprite.x === destX && this.sprite.y === destY) {
      animation.done = true;
    }
  }

  animateFall(time, animation) {
    if (animation.elapsed === undefined) {
      animation.elapsed = 0;
    }
    animation.elapsed += (time) * (this.speed / RobotView.Speed.DEFAULT);
    const progress = Math.min(animation.elapsed, animation.time) / animation.time;
    this.sprite.scale.x = 0.8 * (1 - progress) + 0.2;
    this.sprite.scale.y = 0.8 * (1 - progress) + 0.2;
    this.sprite.x = animation.x * this.tileSize + (this.tileSize - this.sprite.width) / 2;
    this.sprite.y = animation.y * this.tileSize + (this.tileSize - this.sprite.height) / 2;
    this.sprite.alpha = 0.8 * (1 - progress) + 0.2;
    if (animation.elapsed >= animation.time) {
      animation.done = true;
    }
  }

  animateDelay(time, animation) {
    if (animation.elapsed === undefined) {
      animation.elapsed = 0;
    }
    animation.elapsed += (time) * (this.speed / RobotView.Speed.DEFAULT);
    if (animation.elapsed >= animation.time) {
      animation.done = true;
    }
  }

  animateReset(time, animation) {
    this.sprite.alpha = 1;
    this.sprite.scale.x = this.defaultScale.x;
    this.sprite.scale.y = this.defaultScale.y;
    animation.done = true;
  }

  animate(time) {
    if (this.animationQueue.length !== 0) {
      switch (this.animationQueue[0].type) {
        case 'move':
          this.animateMove(time, this.animationQueue[0]);
          break;
        case 'teleport':
          this.animateTeleport(time, this.animationQueue[0]);
          break;
        case 'delay':
          this.animateDelay(time, this.animationQueue[0]);
          break;
        case 'react':
          this.animateReact(time, this.animationQueue[0]);
          break;
        case 'fall':
          this.animateFall(time, this.animationQueue[0]);
          break;
        case 'reset':
          this.animateReset(time, this.animationQueue[0]);
          break;
        default:
          throw new Error(`Unknown animation type: ${this.animationQueue[0].type}`);
      }

      if (this.animationQueue[0].done) {
        this.events.emit(`${this.animationQueue[0].type}End`, this.animationQueue[0]);
        this.animationQueue.shift();
      }

      if (this.animationQueue.length === 0) {
        this.events.emit('idle');
      }
    }
  }
}

RobotView.Speed = {
  SLOW: 5,
  DEFAULT: 10,
  TURBO: 30,
};

module.exports = RobotView;
