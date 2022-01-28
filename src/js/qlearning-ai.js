const EventEmitter = require('events');
const Robot = require('./robot.js');
const { shuffleArray } = require('./aux/shuffle');

class QLearningAI {
  constructor(robot) {
    this.robot = robot;
    this.q = this.initQ();
    this.learningRate = 1;
    this.discountFactor = 1;
    this.exploreRate = 0.2;
    this.learning = true;
    this.events = new EventEmitter();

    this.robot.events.on('move', (direction, x1, y1, x2, y2, reward) => {
      if (this.learning && direction !== null) {
        this.update(direction, x1, y1, x2, y2, reward);
      }
    });
  }

  initQ() {
    const { height, width } = this.robot.maze.map;
    const table = new Array(height);

    for (let j = 0; j < height; j += 1) {
      table[j] = new Array(width);
      for (let i = 0; i < width; i += 1) {
        table[j][i] = Object.fromEntries(
          Object.keys(Robot.Directions).map(direction => [direction, 0])
        );
      }
    }

    return table;
  }

  clear() {
    this.q = this.initQ();
    this.events.emit('update');
  }

  greedyPolicy() {
    const { x, y } = this.robot;
    const directions = this.robot.availableDirections();
    const dirValuePairs = Object.entries(this.q[y][x])
      .filter(([direction]) => directions.includes(direction));
    if (dirValuePairs.length > 0) {
      return shuffleArray(dirValuePairs).sort(([, valA], [, valB]) => valA - valB)
        .pop()[0];
    }
    return null;
  }

  randomPolicy() {
    const directions = this.robot.availableDirections();
    if (directions.length) {
      return directions[Math.floor(Math.random() * directions.length)];
    }
    return null;
  }

  epsilonGreedyPolicy() {
    if (Math.random() >= this.exploreRate) {
      return this.greedyPolicy();
    }
    return this.randomPolicy();
  }

  step() {
    const direction = this.epsilonGreedyPolicy();
    if (direction) {
      this.robot.go(direction);
    } else {
      this.robot.failMove();
    }
  }

  maxQ(x, y) {
    const directions = this.robot.availableDirectionsAt(x, y);
    return directions.length > 0
      ? Math.max(...Object.entries(this.q[y][x])
        .filter(([direction]) => directions.includes(direction))
        .map(([, value]) => value))
      : 0;
  }

  update(direction, x1, y1, x2, y2, reward) {
    this.q[y1][x1][direction] += this.learningRate
      * (reward + this.discountFactor * this.maxQ(x2, y2) - this.q[y1][x1][direction]);

    this.events.emit('update');
  }
}

module.exports = QLearningAI;
