const Maze = require('../maze.js');
const MazeView = require('../maze-view.js');
const ModalLoad = require('./modal-load.js');
const ModalSave = require('./modal-save.js');
const ModalExport = require('./modal-export.js');
const ModalImport = require('./modal-import.js');
const ObjectStore = require('./object-store.js');

class MazeEditor {
  constructor($element, maze, palette, config, textures) {
    this.$element = $element;
    this.maze = maze;
    this.palette = palette;
    this.config = config;

    this.mazeView = new MazeView(maze, config, textures);
    this.displayObject = this.mazeView.displayObject;

    const tools = {
      start: (x, y) => {
        if (this.maze.robots.length > 0) {
          this.maze.robots[0].setPosition(x, y);
        }
      },
      erase: (x, y) => {
        const item = this.maze.getItem(x, y);
        if (item && item.erasable) {
          this.maze.removeItem(x, y);
        }
      },
      tile: (tileType, x, y) => {
        if (this.maze.startPosition[0] === x && this.maze.startPosition[1] === y) {
          return;
        }
        this.maze.removeItem(x, y);
        this.maze.map.set(x, y, tileType);
        if (this.config.tileTypes[tileType].item !== undefined) {
          this.maze.placeItem(this.config.tileTypes[tileType].item, x, y, false);
        }
      },
      item: (itemType, x, y) => {
        if (this.maze.isWalkable(x, y)) {
          this.maze.placeItem(itemType, x, y);
        }
      },
    };

    this.toolHandler = null;
    this.palette.events.on('change', (tool, type = null) => {
      if (type !== null) {
        this.toolHandler = tools[tool].bind(this, type);
      } else {
        this.toolHandler = tools[tool].bind(this);
      }
    });

    this.palette.events.on('action', (id) => {
      if (this.actionHandlers[id]) {
        this.actionHandlers[id]();
      }
    });

    let lastEdit = null;
    this.mazeView.events.on('action', ([x, y], props) => {
      if (this.toolHandler !== null) {
        if (lastEdit && props.shiftKey) {
          const [lastX, lastY] = lastEdit;
          for (let i = Math.min(lastX, x); i <= Math.max(lastX, x); i += 1) {
            for (let j = Math.min(lastY, y); j <= Math.max(lastY, y); j += 1) {
              this.toolHandler(i, j);
            }
          }
        } else {
          this.toolHandler(x, y);
        }
        lastEdit = [x, y];
      }
    });

    this.objectStore = new ObjectStore();
    this.actionHandlers = {
      load: () => {
        const modal = new ModalLoad(this.config, this.objectStore);
        modal.show().then((id) => {
          const jsonMaze = id && this.objectStore.get(id);
          if (jsonMaze) {
            this.maze.copy(Maze.fromJSON(jsonMaze));
          }
        });
      },
      save: () => {
        const modal = new ModalSave(this.config, this.objectStore);
        modal.show().then((id) => {
          if (id) {
            this.objectStore.set(id === 'new' ? null : id, this.maze.toJSON());
          }
        });
      },
      import: () => {
        const modal = new ModalImport();
        modal.show().then((importedData) => {
          if (importedData) {
            this.maze.copy(Maze.fromJSON(importedData));
          }
        });
      },
      export: () => {
        const modal = new ModalExport(JSON.stringify(this.maze));
        modal.show();
      },
      reset: () => {
        this.maze.reset();
      },
    };
  }
}

module.exports = MazeEditor;
