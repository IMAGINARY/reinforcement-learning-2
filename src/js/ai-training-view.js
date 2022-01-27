const RobotView = require('./robot-view');

class AITrainingView {
  constructor(ai, robotView) {
    this.ai = ai;
    this.robotView = robotView;
    this.running = false;
    this.timer = 0;
    this.robotIdle = true;
    this.robotView.events.on('idle', () => {
      if (this.running) {
        this.ai.step();
      } else {
        this.robotIdle = true;
      }
    });

    this.$element = $('<div></div>')
      .addClass('ai-training-view');

    this.$explorationRateSlider = this.buildSlider(
      'Exploration rate',
      { min: 0, max: 1, step: 0.1 },
      this.ai.exploreRate,
      (value) => { this.ai.exploreRate = value;}
    ).appendTo(this.$element);

    this.$learningRateSlider = this.buildSlider(
      'Learning rate',
      { min: 0, max: 1, step: 0.1 },
      this.ai.learningRate,
      (value) => { this.ai.learningRate = value;}
    ).appendTo(this.$element);

    this.$discountFactorSlider = this.buildSlider(
      'Discount factor',
      { min: 0, max: 1, step: 0.1 },
      this.ai.discountFactor,
      (value) => { this.ai.discountFactor = value;}
    ).appendTo(this.$element);

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
        .pointerclick()
        .on('i.pointerclick', () => {
          this.handleButtonClick(props.id);
        })
        .on('pointerdown', () => {
          this.handleButtonDown(props.id);
        })
        .on('pointerup', () => {
          this.handleButtonUp(props.id);
        })
        .on('pointercancel', () => {
          this.handleButtonUp(props.id);
        });

      if (props.icon) {
        button.css({
          backgroundImage: `url(${props.icon})`,
        });
      }

      this.buttons[props.id] = button;
    });
  }

  buildSlider(title, options, initialValue, changeCallback) {
    const $element = $('<div class="slider"></div>');

    const $text = $('<div class="slider-text"></div>')
      .appendTo($element);
    const $input = $('<div class="slider-input"></div>')
      .appendTo($element);
    const $exploreValue = $('<span></span>')
      .text(initialValue);
    $('<label></label>')
      .html(`${title}: `)
      .append($exploreValue)
      .appendTo($text);
    const $exploreSlider = $('<input type="range"></input>')
      .attr(options)
      .on('change', () => {
        changeCallback(Number($exploreSlider.val()));
        $exploreValue.text(Number($exploreSlider.val()));
      })
      .val(initialValue)
      .appendTo($input);

    return $element;
  }

  handleButtonClick(id) {
    if (id === 'run') { this.handleRun(); }
    if (id === 'step') { this.handleStep(); }
    if (id === 'clear') { this.handleClear(); }
  }

  handleButtonDown(id) {
    if (id === 'turbo') { this.turboStart(); }
  }

  handleButtonUp(id) {
    if (id === 'turbo') { this.turboEnd(); }
  }

  handleRun() {
    if (this.running) {
      this.buttons.run.css({ backgroundImage: 'url("static/fa/play-solid.svg")' });
      this.running = false;
    } else {
      if (this.robotIdle) {
        this.buttons.run.css({ backgroundImage: 'url("static/fa/pause-solid.svg")' });
        this.running = true;
        this.robotIdle = false;
        this.ai.step();
      }
    }
  }

  handleStep() {
    if (this.robotIdle) {
      this.robotIdle = false;
      this.ai.step();
    }
  }

  handleClear() {
    this.ai.clear();
  }

  turboStart() {
    this.robotView.speed = RobotView.Speed.TURBO;
  }

  turboEnd() {
    this.robotView.speed = RobotView.Speed.DEFAULT;
  }
}

AITrainingView.Buttons = [
  {
    id: 'run',
    icon: 'static/fa/play-solid.svg',
    title: 'Run',
  },
  {
    id: 'turbo',
    icon: 'static/fa/forward-solid.svg',
    title: 'Hold to speed up',
  },
  {
    id: 'step',
    icon: 'static/fa/step-forward-solid.svg',
    title: 'Step',
  },
  {
    id: 'clear',
    title: 'Clear',
  },
];

module.exports = AITrainingView;
