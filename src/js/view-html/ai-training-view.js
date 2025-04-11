const EventEmitter = require('events');
const RobotView = require('../view-pixi/robot-view');
const createHoldButton = require('./hold-button');

class AITrainingView {
  constructor(ai, robotView, options = {}) {
    this.ai = ai;
    this.robotView = robotView;
    this.options = { ...AITrainingView.defaultOptions, ...options };
    this.running = false;
    this.turboDown = false;
    this.timer = 0;
    this.robotIdle = true;
    this.robotView.events.on('idle', () => {
      if (this.running || (!this.options.useToggleFFButton && this.turboDown)) {
        this.ai.step();
      } else {
        this.robotIdle = true;
      }
    });
    this.events = new EventEmitter();

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
          this.$runButton.removeClass('with-pause-icon');
          this.$runButton.removeClass('active');
          this.running = false;
        } else if (this.robotIdle) {
          this.$runButton.css({ backgroundImage: 'url("static/fa/pause-solid.svg")' });
          this.$runButton.addClass('with-pause-icon');
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
      type: this.options.useToggleFFButton ? 'toggle' : 'hold',
    })
      .on('active', () => {
        this.$turboButton.addClass('active');
        this.robotView.setSpeed(RobotView.Speed.TURBO);
        this.turboDown = true;
        if (!this.options.useToggleFFButton && this.robotIdle) {
          this.ai.step();
        }
      })
      .on('inactive', () => {
        this.$turboButton.removeClass('active');
        this.robotView.setSpeed(RobotView.Speed.DEFAULT);
        this.turboDown = false;
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

    if (this.options.showViewPolicyButton) {
      this.$viewPolicyButton = this.buildButton({
        id: 'view-policy',
        icon: 'static/icons/eye-regular.svg',
        title: 'View Policy',
        type: this.options.useToggleViewPolicyButton ? 'toggle' : 'hold',
      })
        .on('active', () => {
          this.$viewPolicyButton.addClass('active');
          this.events.emit('policy-show');
        })
        .on('inactive', () => {
          this.$viewPolicyButton.removeClass('active');
          this.events.emit('policy-hide');
        })
        .appendTo(this.$element);
    }

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
        this.ai.clear();
        this.events.emit('training-clear');
      })
      .appendTo(this.$element);

    this.$clearButton
      .find('.text')
      .attr({
        'data-i18n-text': 'ai-training-view-button-clear',
      });
  }

  /**
   * Build a button element.
   *
   * Props:
   * - id: button id
   * - title: Text to show if the button doesn't have an icon, or title attribute otherwise.
   * - icon: URL of the icon to show in the button.
   * - type: Either 'hold' or 'toggle'. Default is 'hold'. A hold button is active while held down,
   *    and a toggle button toggles between active and inactive states on press.
   *
   * Events:
   *  - 'active': emitted when the button becomes active (depends on the button type).
   *  - 'inactive' emitted when the button becomes inactive (depends on the button type).
   *
   * @param {object} props
   * @return {*|jQuery}
   */
  // eslint-disable-next-line class-methods-use-this
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

    if (props.type === 'toggle') {
      button.on('i.pointerdown', () => {
        button.toggleClass('active');
        if (button.hasClass('active')) {
          button.trigger('active');
        } else {
          button.trigger('inactive');
        }
      });
    } else {
      // Default type is 'hold'
      button.on('i.pointerdown', () => {
        button.addClass('active');
        button.trigger('active');
      });
      button.on('i.pointerup', () => {
        button.removeClass('active');
        button.trigger('inactive');
      });
    }

    return button;
  }

  // eslint-disable-next-line class-methods-use-this
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

    const $exploreSlider = $('<input type="range">')
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

  setExplorationRate(rate) {
    this.$explorationRateSlider.find('input').val(rate).trigger('change');
  }
}

AITrainingView.defaultOptions = {
  showViewPolicyButton: true,
  useToggleViewPolicyButton: false,
  useToggleFFButton: false,
};

module.exports = AITrainingView;
