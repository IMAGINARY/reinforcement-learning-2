const EventEmitter = require('events');

class MazeEditorPalette {
  constructor($element, config) {
    this.$element = $element;
    this.config = config;
    this.activeButton = null;
    this.tileId = null;
    this.events = new EventEmitter();

    this.$element.addClass('maze-editor-palette');

    this.buttons = Object.entries(config.tileTypes).map(([id, typeCfg]) => $('<button></button>')
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
      .on('click', (ev) => {
        if (this.activeButton) {
          this.activeButton.removeClass('active');
        }
        this.activeButton = $(ev.target);
        this.activeButton.addClass('active');
        this.tileId = Number(id);
        this.events.emit('change', Number(id));
      }));

    this.buttons.push($('<div class="separator"></div>'));

    const actionButtons = MazeEditorPalette.Actions.map(action => $('<button></button>')
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
      .on('click', () => {
        this.events.emit('action', action.id);
      }));

    this.buttons.push(...actionButtons);

    this.$element.append(this.buttons);
    if (this.buttons.length) {
      this.buttons[0].click();
    }
  }
}

MazeEditorPalette.Actions = [
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
