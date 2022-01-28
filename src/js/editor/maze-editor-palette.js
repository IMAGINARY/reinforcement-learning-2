const EventEmitter = require('events');

class MazeEditorPalette {
  constructor($container, config) {
    this.$container = $container;
    this.$element = $('<div></div>').appendTo(this.$container);
    this.config = config;
    this.activeButton = null;
    this.tileId = null;
    this.events = new EventEmitter();

    this.$element.addClass('maze-editor-palette');
    this.$bar1 = $('<div class="maze-editor-palette-bar"></div>')
      .appendTo(this.$element);
    this.$bar2 = $('<div class="maze-editor-palette-bar"></div>')
      .appendTo(this.$element);

    this.$bar1.append(this.buildActionButtons());

    this.$bar2.append(this.buildTileButtons(config));
    this.$bar2.append($('<div class="separator"></div>'));
    this.$bar2.append(this.buildToolButtons(config));
    this.$bar2.append(this.buildItemButtons(config));
  }

  buildTileButtons(config) {
    return Object.entries(config.tileTypes)
      .filter(([, tileType]) => tileType.inPalette !== false)
      .map(([id, typeCfg]) => $('<div></div>')
        .addClass('item')
        .append(
          $('<button></button>')
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
            })
        )
        .append($('<div></div>')
          .addClass('label')
          .attr('data-i18n-text', `editor-palette-button-tile-${id}`)));
  }

  buildToolButtons() {
    return MazeEditorPalette.Tools.map(tool => $('<button></button>')
      .attr({
        type: 'button',
        title: tool.title,
      })
      .addClass([
        'editor-palette-button',
        'editor-palette-button-tool',
        `editor-palette-button-tool-${tool.id}`,
      ])
      .css({
        backgroundImage: `url(${tool.icon})`,
      })
      .pointerclick()
      .on('i.pointerclick', (ev) => {
        if (this.activeButton) {
          this.activeButton.removeClass('active');
        }
        this.activeButton = $(ev.target);
        this.activeButton.addClass('active');
        this.events.emit('change', tool.id);
      }));
  }

  buildItemButtons(config) {
    return Object.entries(config.items)
      .filter(([, props]) => props.inPalette !== false)
      .map(([id, props]) => $('<button></button>')
        .attr({
          type: 'button',
          title: props.name,
        })
        .addClass([
          'editor-palette-button',
          'editor-palette-button-item',
          `editor-palette-button-item-${id}`,
        ])
        .css({
          backgroundImage: props.editorIcon ? `url(${props.editorIcon})` : 'none',
        })
        .pointerclick()
        .on('i.pointerclick', (ev) => {
          if (this.activeButton) {
            this.activeButton.removeClass('active');
          }
          this.activeButton = $(ev.target);
          this.activeButton.addClass('active');
          this.events.emit('change', 'item', id);
        }));
  }

  buildActionButtons() {
    return MazeEditorPalette.Actions.map(action => $('<button></button>')
      .attr({
        type: 'button',
        title: action.title,
      })
      .addClass([
        'editor-palette-button',
        'editor-palette-button-action',
        `editor-palette-button-action-${action.id}`,
      ])
      .css({
        backgroundImage: `url(${action.icon})`,
      })
      .pointerclick()
      .on('i.pointerclick', () => {
        this.events.emit('action', action.id);
      }));
  }
}

MazeEditorPalette.Tools = [
  {
    id: 'start',
    title: 'Set the starting point',
    icon: 'static/fa/robot-solid-blue.svg',
  },
  {
    id: 'erase',
    title: 'Remove items',
    icon: 'static/fa/times-solid.svg',
  },
];

MazeEditorPalette.Actions = [
  {
    id: 'reset',
    title: 'Reset',
    icon: 'static/fa/sync-solid.svg',
  },
  {
    id: 'load',
    title: 'Load maze',
    icon: 'static/fa/folder-open-solid.svg',
  },
  {
    id: 'save',
    title: 'Save maze',
    icon: 'static/fa/save-solid.svg',
  },
  {
    id: 'import',
    title: 'Import maze',
    icon: 'static/fa/file-import-solid.svg',
  },
  {
    id: 'export',
    title: 'Export maze',
    icon: 'static/fa/file-export-solid.svg',
  },
];

module.exports = MazeEditorPalette;
