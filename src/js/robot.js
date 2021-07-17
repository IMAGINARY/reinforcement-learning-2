const EventEmitter = require('events');

class Robot {
  constructor(id, props) {
    this.id = id;
    this.name = props.name || id;
    this.maze = null;
    this.x = 0;
    this.y = 0;

    this.events = new EventEmitter();
  }

  canMoveTo(x, y) {
    return this.maze
      && this.maze.map.isValidCoords(x, y)
      && this.maze.isWalkable(x, y)
      && this.maze.map.stepDistance(this.x, this.y, x, y) === 1;
  }

  moveTo(x, y) {
    if (this.canMoveTo(x, y)) {
      this.events.emit('move', this.x, this.y, x, y);
      this.x = x;
      this.y = y;
    }
  }

  north() { this.moveTo(this.x, this.y - 1); }

  south() { this.moveTo(this.x, this.y + 1); }

  east() { this.moveTo(this.x + 1, this.y); }

  west() { this.moveTo(this.x - 1, this.y); }
}

module.exports = Robot;
