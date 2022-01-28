const RobotView = require('./robot-view');
const createHoldButton = require('./hold-button');

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

    this.$runButton = this.buildButton({
      id: 'run',
      icon: 'static/fa/play-solid.svg',
      title: 'Run / Pause',
    })
      .on('i.pointerclick', () => {
        if (this.running) {
          this.$runButton.css({ backgroundImage: 'url("static/fa/play-solid.svg")' });
          this.$runButton.removeClass('active');
          this.running = false;
        } else if (this.robotIdle) {
          this.$runButton.css({ backgroundImage: 'url("static/fa/pause-solid.svg")' });
          this.$runButton.addClass('active');
          this.running = true;
          this.robotIdle = false;
          this.ai.step();
        }
      })
      .appendTo(this.$element);

    this.$turboButton = this.buildButton({
      id: 'turbo',
      icon: 'static/fa/forward-solid.svg',
      title: 'Hold to speed up',
    })
      .on('i.pointerdown', () => {
        if (this.running) {
          this.$turboButton.addClass('active');
          this.robotView.speed = RobotView.Speed.TURBO;
        }
      })
      .on('i.pointerup', () => {
        this.$turboButton.removeClass('active');
        this.robotView.speed = RobotView.Speed.DEFAULT;
      })
      .appendTo(this.$element);

    this.$stepButton = this.buildButton({
      id: 'step',
      icon: 'static/fa/step-forward-solid.svg',
      title: 'Step',
    })
      .on('i.pointerclick', () => {
        if (this.robotIdle) {
          this.robotIdle = false;
          this.ai.step();
        }
      })
      .appendTo(this.$element);

    this.$explorationRateSlider = this.buildSlider({
      id: 'exploration-rate',
      title: 'Exploration rate',
      options: { min: 0, max: 1, step: 0.1 },
      limitLabels: ['Exploit', 'Explore'],
      initialValue: this.ai.exploreRate,
      changeCallback: (value) => {
        this.ai.exploreRate = value;
      },
    }).appendTo(this.$element);

    this.$learningRateSlider = this.buildSlider({
      id: 'learning-rate',
      title: 'Learning rate',
      options: { min: 0, max: 1, step: 0.1 },
      initialValue: this.ai.learningRate,
      changeCallback: (value) => {
        this.ai.learningRate = value;
      },
    }).appendTo(this.$element);

    this.$discountFactorSlider = this.buildSlider({
      id: 'discount-factor',
      title: 'Discount factor',
      options: { min: 0, max: 1, step: 0.1 },
      initialValue: this.ai.discountFactor,
      changeCallback: (value) => {
        this.ai.discountFactor = value;
      },
    }).appendTo(this.$element);

    this.$clearButton = createHoldButton({
      id: 'clear',
      title: 'Clear',
      holdTime: 2000,
    })
      .addClass([
        'ai-training-view-button',
        'ai-training-view-button-clear',
      ])
      .on('hold', () => {
        console.log("YES");
        this.ai.clear();
      })
      .appendTo(this.$element)
      .find('.text')
      .attr({
        'data-i18n-text': 'ai-training-view-button-clear',
      });
  }

  buildButton(props) {
    const button = $('<button></button>')
      .attr({
        type: 'button',
        title: props.title,
        'data-i18n-text': `ai-training-view-button-${props.id}`,
      })
      .addClass([
        'btn',
        'ai-training-view-button',
        `ai-training-view-button-${props.id}`,
      ])
      .html(props.icon ? '&nbsp;' : props.title || '')
      .pointerclick();

    if (props.icon) {
      button.css({
        backgroundImage: `url(${props.icon})`,
      });
      button.addClass('round');
    }

    return button;
  }

  buildSlider(props) {
    const {
      id, title, options, initialValue, changeCallback,
    } = props;

    const $element = $('<div></div>')
      .addClass([
        'slider',
        'ai-training-view-slider',
        `ai-training-view-slider-${id}`,
      ]);

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

    if (props.limitLabels) {
      const [minLabel, maxLabel] = props.limitLabels;
      $('<span></span>')
        .addClass(['slider-limit', 'slider-limit-min'])
        .text(minLabel)
        .attr('data-i18n-text', `ai-training-view-slider-${id}-limit-min`)
        .appendTo($text);
      $('<span></span>')
        .addClass(['slider-limit', 'slider-limit-max'])
        .text(maxLabel)
        .attr('data-i18n-text', `ai-training-view-slider-${id}-limit-max`)
        .appendTo($text);
    }

    const $exploreSlider = $('<input type="range"></input>')
      .addClass('form-control-range')
      .attr(options)
      .on('change', () => {
        changeCallback(Number($exploreSlider.val()));
        $exploreValue.text(Number($exploreSlider.val()));
      })
      .val(initialValue)
      .appendTo($input);

    return $element;
  }
}

module.exports = AITrainingView;
