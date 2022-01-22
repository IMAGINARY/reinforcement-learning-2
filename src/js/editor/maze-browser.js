const Maze = require('../maze.js');

class MazeBrowser {
  constructor($element, config, mazeStore, saveMode = false) {
    this.$element = $element;
    this.config = config;
    this.$selectedButton = null;
    this.selectedData = null;

    this.$element.addClass('maze-browser');

    const setSelection = (button) => {
      if (this.$selectedButton) {
        this.$selectedButton.removeClass('selected');
      }
      this.$selectedButton = $(button);
      this.$selectedButton.addClass('selected');
    };

    const buttons = Object.entries(
      saveMode ? mazeStore.getAllUserObjects() : mazeStore.getAllObjects()
    ).map(([id, mazeJSON]) => $('<div></div>')
      .addClass(['col-6', 'col-md-2', 'mb-3'])
      .append(
        $('<button></button>')
          .addClass('maze-browser-item')
          .append(this.createPreviewImage(mazeJSON))
          .pointerclick()
          .on('i.pointerclick', (ev) => {
            setSelection(ev.currentTarget);
            this.selectedData = id;
          })
      ));

    if (saveMode) {
      buttons.unshift($('<div></div>')
        .addClass(['col-6', 'col-md-2', 'mb-3'])
        .append($('<button></button>')
          .addClass('maze-browser-item-new')
          .on('click', (ev) => {
            setSelection(ev.currentTarget);
            this.selectedData = 'new';
          })));
    }

    this.$element.append($('<div class="row"></div>').append(buttons));
  }

  createPreviewImage(mazeJSON) {
    const maze = Maze.fromJSON(mazeJSON);
    const $canvas = $('<canvas class="maze-browser-item-preview"></canvas>')
      .attr({
        width: maze.map.width,
        height: maze.map.height,
      });
    const ctx = $canvas[0].getContext('2d');
    maze.map.allCells().forEach(([i, j, value]) => {
      ctx.fillStyle = (this.config.tileTypes && this.config.tileTypes[value].color) || '#000000';
      ctx.fillRect(i, j, 1, 1);
    });

    return $canvas;
  }
}

module.exports = MazeBrowser;
