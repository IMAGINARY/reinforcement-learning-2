class AITrainingView {
  constructor(ai) {
    this.ai = ai;
    this.running = false;
    this.timer = 0;
    this.speed = 10;

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

  handleButton(id) {
    if (id === 'run') { this.handleRun(); }
    if (id === 'step') { this.handleStep(); }
    if (id === 'train-1') { this.handleTrain1(); }
    if (id === 'clear') { this.handleClear(); }
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

  handleClear() {
    this.ai.clear();
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
  // {
  //   id: 'train-1',
  //   title: 'Train 1 step',
  // },
  {
    id: 'clear',
    title: 'Clear',
  },
];

module.exports = AITrainingView;
