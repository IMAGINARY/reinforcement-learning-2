const Maze = require('../maze');
const maze1 = require('../../../data/mazes/rewards.json');
const training = require('../../../data/training/rewards.json');
const Robot = require('../robot');
const QLearningAI = require('../qlearning-ai');
const MazeView = require('../maze-view');
const AITrainingView = require('../ai-training-view');
const RobotView = require('../robot-view');

class RewardsInteractive {
  constructor(config, textures) {
    const maze = Maze.fromJSON(maze1);
    maze.config = config;
    this.robot = new Robot();
    maze.addRobot(this.robot);
    this.ai = new QLearningAI(maze.robot);
    this.ai.learningRate = 0;
    this.ai.exploreRate = 0;
    this.ai.q = training.q;
    window.ri = this;

    this.view = new MazeView(maze, config, textures);
    this.ui = new AITrainingView(this.ai, this.view.robotView);
    this.view.robotView.speed = RobotView.Speed.SLOW;

    this.progress = 0;
    this.$bar = $('<div></div>')
      .addClass('progress-bar')
      .attr({
        role: 'progressbar',
      });
    this.$barContainer = $('<div></div>')
      .addClass('bar-container')
      .append($('<div></div>')
        .addClass('label')
        .attr({
          'data-i18n-text': 'rewards-bar-label',
        }))
      .append($('<div></div>')
        .addClass('progress')
        .append(this.$bar));

    this.view.robotView.events.on('resetEnd', () => {
      this.setProgress(0, true);
    });
    this.setProgress(0);

    this.robot.events.on('move', (direction, oldX, oldY, x, y, reward, tileType) => {
      if (tileType === 'candy') {
        this.setProgress(Math.min(this.getProgress() + 20, 100));
      } else if (tileType === 'lava') {
        this.setProgress(Math.max(this.getProgress() - 15, 0));
      } else if (tileType === 'exit') {
        this.setProgress(100);
      }
    });
  }

  animate(time) {
    this.view.animate(time);
  }

  getProgress() {
    return this.progress;
  }

  setProgress(percentage, isReset = false) {
    if (percentage > this.progress || isReset) {
      this.$barContainer.removeClass('decrease');
    }
    if (percentage < this.progress && !isReset) {
      this.$barContainer.addClass('decrease');
    }

    this.progress = percentage;
    this.$bar.css('width', `${percentage}%`);
  }
}

module.exports = RewardsInteractive;
