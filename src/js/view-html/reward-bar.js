class RewardBar {
  constructor(robotView) {
    this.robotView = robotView;

    this.$element = $('<div></div>')
      .attr('id', 'rewards-bar')
      .addClass('reward-bar');

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
        .append(this.$bar))
      .appendTo(this.$element);

    this.robotView.events.on('resetEnd', () => {
      this.setProgress(0, true);
    });
    this.setProgress(0);

    this.robotView.robot.events.on('move', (direction, oldX, oldY, x, y, reward, tileType) => {
      if (tileType === 'candy') {
        this.setProgress(Math.min(this.getProgress() + 20, 100));
      } else if (tileType === 'lava') {
        this.setProgress(Math.max(this.getProgress() - 15, 0));
      } else if (tileType === 'exit') {
        this.setProgress(100);
      }
    });
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

module.exports = RewardBar;
