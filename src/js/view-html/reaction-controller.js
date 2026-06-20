// noinspection JSUnresolvedReference

// Upward float distance of a reaction, in CSS px. Must match the `margin-top` in the
// `.fading` rule of `_mod_reaction.scss` (used for the unscaled path).
const FLOAT_DISTANCE = 200;

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
      const scaled = scale !== 1;
      const css = {
        left: x,
        top: y,
        backgroundImage: `url(${this.reactions[type]})`,
      };
      // Only apply a transform when actually scaled, so unscaled callers stay identical to
      // the default (and don't override the embed-only `.fading` transform).
      if (scaled) {
        css.transform = `scale(${scale})`;
        css.transformOrigin = 'top left';
      }
      const reaction = $('<div></div>')
        .addClass(['reaction', `reaction-${type}`])
        .css(css)
        .appendTo(this.container);
      setTimeout(() => {
        if (scaled) {
          // Float via transform (composed with the scale) so the distance scales by the
          // same factor as the icon. `margin-top` is layout and wouldn't be scaled by the
          // transform, so we drive opacity + translateY inline instead of the `.fading`
          // class.
          reaction.css({
            opacity: 0,
            transform: `scale(${scale}) translateY(${-FLOAT_DISTANCE}px)`,
          });
        } else {
          reaction.addClass('fading');
        }
      }, 0);
      setTimeout(() => {
        reaction.remove();
      }, 1000);
    }
  }
}

module.exports = ReactionController;
