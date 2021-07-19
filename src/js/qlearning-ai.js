class QLearningAI {
  constructor(robot) {
    this.robot = robot;
  }

  step() {
    const directions = this.robot.availableDirections();
    if (directions.length) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      this.robot.go(direction);
    }
  }
}

module.exports = QLearningAI;
