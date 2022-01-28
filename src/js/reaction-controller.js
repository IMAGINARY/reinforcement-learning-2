class ReactionController {
  constructor(container, config) {
    this.container = container;
    this.config = config;

    this.reactions = Object.fromEntries(
      Object.entries(this.config.tileTypes)
        .filter(([, props]) => props.reaction)
        .map(([, props]) => [props.type, props.reaction])
    );
  }

  launchReaction(type, x, y) {
    if (this.reactions[type]) {
      const reaction = $('<div></div>')
        .addClass(['reaction', `reaction-${type}`])
        .css({
          left: x,
          top: y,
          backgroundImage: `url(${this.reactions[type]})`,
        })
        .appendTo(this.container);
      setTimeout(() => {
        reaction.addClass('fading');
      }, 0);
      setTimeout(() => {
        reaction.remove();
      }, 1000);
    }
  }
}

module.exports = ReactionController;
