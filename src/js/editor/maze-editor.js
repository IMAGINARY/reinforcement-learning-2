const Maze = require('../maze.js');
const MazeView = require('../maze-view.js');
const MazeEditorPalette = require('./maze-editor-palette.js');
const ModalLoad = require('./modal-load.js');
const ModalSave = require('./modal-save.js');
const ModalExport = require('./modal-export.js');
const ModalImport = require('./modal-import.js');
const ObjectStore = require('./object-store.js');

class MazeEditor {
  constructor($element, maze, config, textures) {
    this.$element = $element;
    this.maze = maze;
    this.config = config;

    this.mazeView = new MazeView(maze, config, textures);
    this.displayObject = this.mazeView.displayObject;

    this.palette = new MazeEditorPalette($('<div></div>').appendTo(this.$element), config);

    this.tileType = this.palette.tileId;
    this.palette.events.on('change', (tileType) => {
      this.tileType = tileType;
    });

    this.palette.events.on('action', (id) => {
      if (this.actionHandlers[id]) {
        this.actionHandlers[id]();
      }
    });

    let lastEdit = null;
    this.mazeView.events.on('action', ([x, y], props) => {
      if (this.tileType !== null) {
        if (lastEdit && props.shiftKey) {
          const [lastX, lastY] = lastEdit;
          for (let i = Math.min(lastX, x); i <= Math.max(lastX, x); i += 1) {
            for (let j = Math.min(lastY, y); j <= Math.max(lastY, y); j += 1) {
              this.maze.map.set(i, j, this.tileType);
            }
          }
        } else {
          this.maze.map.set(x, y, this.tileType);
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
    };
  }
}

module.exports = MazeEditor;
