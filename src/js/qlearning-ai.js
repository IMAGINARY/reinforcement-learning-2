// noinspection JSCheckFunctionSignatures

const EventEmitter = require('events');
const Robot = require('./robot');
const { shuffleArray } = require('./lib/shuffle');

class QLearningAI {
  constructor(robot) {
    this.robot = robot;
    // Q-table: Q^*(x, y, a) -> Q-value
    this.q = this.initQ();
    // Estimation of the value function: V^*(x, y) -> v
    this.v = this.initV();
    // A table where we keep the last reward received: R^*(x, y) -> r
    this.r = this.initR();

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
          Object.keys(Robot.Directions).map((direction) => [direction, 0])
        );
      }
    }

    return table;
  }

  initV() {
    const { height, width } = this.robot.maze.map;
    const table = new Array(height);
    for (let j = 0; j < height; j += 1) {
      table[j] = new Array(width);
      for (let i = 0; i < width; i += 1) {
        table[j][i] = 0;
      }
    }

    return table;
  }

  initR() {
    return this.initV();
  }

  clear() {
    this.q = this.initQ();
    this.v = this.initV();
    this.r = this.initR();
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

  minQ(x, y) {
    const directions = this.robot.availableDirectionsAt(x, y);
    return directions.length > 0
      ? Math.min(...Object.entries(this.q[y][x])
        .filter(([direction]) => directions.includes(direction))
        .map(([, value]) => value))
      : 0;
  }

  qUpperBound() {
    let bound = 0;
    for (let y = 0; y !== this.q.length; y += 1) {
      for (let x = 0; x !== this.q[y].length; x += 1) {
        bound = Math.max(bound, this.maxQ(x, y));
      }
    }
    return bound;
  }

  qLowerBound() {
    let bound = 0;
    for (let y = 0; y !== this.q.length; y += 1) {
      for (let x = 0; x !== this.q[y].length; x += 1) {
        bound = Math.min(bound, this.minQ(x, y));
      }
    }
    return bound;
  }

  update(direction, x1, y1, x2, y2, reward) {
    this.q[y1][x1][direction] += this.learningRate
      * (reward + this.discountFactor * this.maxQ(x2, y2) - this.q[y1][x1][direction]);

    this.r[y2][x2] = reward;
    // According to Tom Mitchell's book "Machine Learning" (1997), ch.13
    // V^*(s) = max_a Q^*(s, a)
    // See: https://datascience.stackexchange.com/a/16724
    // this.v[y1][x1] = this.maxQ(x1, y1)
    // However, the value function approximates what the expected return is from being in a
    // state and following a policy. In the above formula, "being" in a state doesn't include
    // the reward (or penalty) we received when we moved to said state.
    // So, for a more "illustrative" value of how good or bad a state is, we could add the reward.
    this.v[y1][x1] = this.maxQ(x1, y1) + this.r[y1][x1];
    // The problem with this formula is that V no longer matches the policy we're following.
    // There are cases where Q values for two actions are the same, thus the policy can choose
    // either at random (which we display with a two-pointed arrow), but the V for the two
    // states is different. This is maybe not wrong, but can appear counter-intuitive.

    this.events.emit('update');
  }
}

module.exports = QLearningAI;
