// noinspection JSUnresolvedReference

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

  launchReaction(type, x, y, scale = 1) {
    if (this.reactions[type]) {
      const css = {
        left: x,
        top: y,
        backgroundImage: `url(${this.reactions[type]})`,
      };
      // Only apply a transform when actually scaled, so unscaled callers stay identical to
      // the default (and don't override the embed-only `.fading` transform).
      if (scale !== 1) {
        css.transform = `scale(${scale})`;
        css.transformOrigin = 'top left';
      }
      const reaction = $('<div></div>')
        .addClass(['reaction', `reaction-${type}`])
        .css(css)
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
