class AITrainingView {
  constructor(ai) {
    this.ai = ai;
    this.running = false;
    this.timer = 0;
    this.speed = 10;

    this.$element = $('<div></div>')
      .addClass('ai-training-view');

    this.buttons = {};
    this.buildUIButtons();

    this.$element.append(Object.values(this.buttons));
  }

  buildUIButtons() {
    AITrainingView.Buttons.forEach((props) => {
      const button = $('<button></button>')
        .attr({
          type: 'button',
          title: props.title,
        })
        .addClass([
          'btn',
          'ai-training-view-button',
          `ai-training-view-button-${props.id}`,
        ])
        .html(props.icon ? '&nbsp;' : props.title || '')
        .on('click', () => {
          this.handleButton(props.id);
        });

      if (props.icon) {
        button.css({
          backgroundImage: `url(${props.icon})`,
        });
      }

      this.buttons[props.id] = button;
    });
  }

  handleButton(id) {
    if (id === 'run') { this.handleRun(); }
    if (id === 'step') { this.handleStep(); }
    if (id === 'train-1') { this.handleTrain1(); }
  }

  handleRun() {
    if (this.running) {
      this.buttons.run.css({ backgroundImage: 'url("static/fa/play-solid.svg")' });
      this.running = false;
    } else {
      this.buttons.run.css({ backgroundImage: 'url("static/fa/pause-solid.svg")' });
      this.running = true;
    }
  }

  handleStep() {
    this.ai.step();
  }

  handleTrain1() {

  }

  animate(time) {
    if (this.running) {
      this.timer += time;
      if (this.timer > this.speed) {
        this.ai.step();
        this.timer %= this.speed;
      }
    }
  }
}

AITrainingView.Buttons = [
  {
    id: 'run',
    icon: 'static/fa/play-solid.svg',
    title: 'Run',
  },
  {
    id: 'step',
    icon: 'static/fa/step-forward-solid.svg',
    title: 'Step',
  },
  {
    id: 'train-1',
    title: 'Train 1 step',
  },
];

module.exports = AITrainingView;
