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

    $('<button></button>')
      .attr({
        type: 'button',
        title: 'Reset map',
        'data-i18n-text': 'editor-palette-button-action-reset-map',
      })
      .addClass([
        'editor-palette-button',
        'editor-palette-button-action',
        'editor-palette-button-action-reset-map',
      ])
      // .css({
      //   backgroundImage: 'url("static/fa/sync-solid.svg")',
      // })
      .html('Reset map')
      .pointerclick()
      .on('i.pointerclick', () => {
        this.events.emit('action', 'reset-map');
      })
      .appendTo(this.$element);
  }

  buildTileButtons(config) {
    return Object.entries(config.tileTypes)
      .filter(([, tileType]) => tileType.inPalette !== false)
      .map(([id, typeCfg]) => $('<div></div>')
        .addClass('item')
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
          .attr('data-i18n-text', `editor-palette-button-tile-${typeCfg.type}`)));
  }
}

module.exports = ExhibitMazeEditorPalette;
