const EventEmitter = require('events');

class Robot {
  constructor(id, props) {
    this.id = id;
    this.name = props.name || id;
    this.maze = null;
    this.x = 0;
    this.y = 0;
    this.score = 0;
    this.canMove = true;

    this.events = new EventEmitter();
  }

  setPosition(x, y) {
    this.onMoved(this.x, this.y, x, y);
    this.x = x;
    this.y = y;
  }

  canMoveTo(x, y) {
    return this.canMove
      && this.maze
      && this.maze.map.isValidCoords(x, y)
      && this.maze.isWalkable(x, y)
      && this.maze.map.stepDistance(this.x, this.y, x, y) === 1;
  }

  moveTo(x, y) {
    if (this.canMoveTo(x, y)) {
      this.onMoved(this.x, this.y, x, y);
      this.x = x;
      this.y = y;
    }
  }

  onMoved(oldX, oldY, x, y) {
    this.events.emit('move', this.x, this.y, x, y);
    this.addScore(this.maze.getPositionReward(x, y));
    const item = this.maze.pickItem(x, y);
    if (item) {
      this.addScore(this.maze.getItemReward(item));
    }
    if (this.maze.isExit(x, y)) {
      this.onExit(x, y);
    }
  }

  onExit(x, y) {
    this.events.emit('exited', x, y);
  }

  availableDirections() {
    return Object.keys(Robot.Directions)
      .filter(dir => this.canMoveTo(
        this.x + Robot.Directions[dir][0],
        this.y + Robot.Directions[dir][1])
      );
  }

  go(direction) {
    const [deltaX, deltaY] = Robot.Directions[direction];
    this.moveTo(this.x + deltaX, this.y + deltaY);
  }

  resetScore() {
    this.score = 0;
  }

  addScore(amount) {
    this.score += amount;
    this.events.emit('scoreChanged', amount, this.score);
  }
}

Robot.Directions = {
  n: [0, -1],
  s: [0, 1],
  e: [1, 0],
  w: [-1, 0],
};

module.exports = Robot;
