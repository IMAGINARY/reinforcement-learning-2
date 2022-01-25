const EventEmitter = require('events');

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

    this.$bar1.append(this.buildTileButtons(config));
  }

  buildTileButtons(config) {
    return Object.entries(config.tileTypes).map(([id, typeCfg]) => $('<button></button>')
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
      }));
  }
}

module.exports = ExhibitMazeEditorPalette;
