// noinspection JSUnresolvedReference

const EventEmitter = require('events');
const createHoldButton = require('./hold-button');

class ExhibitMazeEditorPalette {
  constructor($container, config) {
    this.$container = $container;
    this.$element = $('<div></div>').appendTo(this.$container);
    this.config = config;
    this.activeButton = null;
    this.tileId = null;
    this.events = new EventEmitter();

    this.$element.addClass(['maze-editor-palette', 'exhibit-maze-editor-palette']);
    this.$bar1 = $('<div class="maze-editor-palette-bar"></div>')
      .appendTo(this.$element);

    const orderedTileButtons = this.buildTileButtons(config);
    this.tileButtons = Object.fromEntries(orderedTileButtons);
    this.$bar1.append(orderedTileButtons.map(([, button]) => button));

    this.resetMapButton = createHoldButton({
      holdTime: 2000,
    })
      .addClass([
        'editor-palette-button',
        'editor-palette-button-action',
        'editor-palette-button-action-reset-map',
      ])
      .on('hold', () => {
        this.events.emit('action', 'reset-map');
      })
      .appendTo(this.$element)
      .find('.text')
      .html('Reset map')
      .attr({
        title: 'Reset map',
        'data-i18n-text': 'editor-palette-button-action-reset-map',
      });
  }

  buildTileButtons(config) {
    return Object.entries(config.tileTypes)
      .filter(([, tileType]) => tileType.inPalette !== false)
      .sort(([idA, typeCfgA], [idB, typeCfgB]) => {
        const weightA = typeCfgA.paletteWeight || 0;
        const weightB = typeCfgB.paletteWeight || 0;
        if (weightA !== weightB) {
          return weightA - weightB;
        }
        return idA - idB;
      })
      .map(([id, typeCfg]) => [id, $('<div></div>')
        .addClass(['item'])
        .attr('data-tile-id', id)
        .append($('<button></button>')
          .attr({
            type: 'button',
            title: typeCfg.name,
          })
          .addClass([
            'editor-palette-button',
            'editor-palette-button-tile',
            `editor-palette-button-tile-${id}`,
          ])
          .css({
            backgroundColor: typeCfg.color,
            backgroundImage: typeCfg.editorIcon ? `url(${typeCfg.editorIcon})` : 'none',
          })
          .pointerclick()
          .on('i.pointerclick', (ev) => {
            if (this.activeButton) {
              this.activeButton.removeClass('active');
            }
            this.activeButton = $(ev.target);
            this.activeButton.addClass('active');
            this.tileId = Number(id);
            this.events.emit('change', 'tile', Number(id));
          }))
        .append($('<div></div>')
          .addClass('label')
          .attr('data-i18n-text', `editor-palette-button-tile-${typeCfg.type}`))]);
  }
}

module.exports = ExhibitMazeEditorPalette;
