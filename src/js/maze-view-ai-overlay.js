/* globals PIXI */
const MazeView = require('./maze-view.js');

class MazeViewAIOverlay {
  constructor(mazeView, ai) {
    this.view = mazeView;
    this.ai = ai;
    this.visible = false;
    this.displayObject = new PIXI.Container();
    this.displayObject.visible = this.visible;

    this.fontSize = 18;
    this.padding = 2;

    this.texts = [];
    this.createTexts();
    this.update();

    this.ai.events.on('update', (x, y, direction) => {
      this.update();
    });
  }

  toggle() {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    this.visible = true;
    this.displayObject.visible = true;
  }

  hide() {
    this.visible = false;
    this.displayObject.visible = false;
  }

  createTexts() {
    const { height, width } = this.view.maze.map;
    const options = { fontFamily: 'Arial', fontSize: this.fontSize };

    const createText = (align) => {
      const text = new PIXI.Text('', Object.assign({}, options, { align }));
      this.displayObject.addChild(text);
      return text;
    };

    for (let j = 0; j < height; j += 1) {
      this.texts[j] = new Array(width);
      for (let i = 0; i < width; i += 1) {
        this.texts[j][i] = {
          n: createText('center'),
          s: createText('center'),
          e: createText('right'),
          w: createText('left'),
        };
      }
    }
  }

  positionText(text, x, y, direction) {
    switch (direction) {
      case 'n':
        text.x = MazeView.TILE_SIZE * (x + 0.5) - text.width / 2;
        text.y = MazeView.TILE_SIZE * y + this.padding;
        break;
      case 's':
        text.x = MazeView.TILE_SIZE * (x + 0.5) - text.width / 2;
        text.y = MazeView.TILE_SIZE * (y + 1) - (this.fontSize + this.padding);
        break;
      case 'e':
        text.x = MazeView.TILE_SIZE * (x + 1) - (text.width + this.padding);
        text.y = MazeView.TILE_SIZE * (y + 0.5) - (this.fontSize * 0.5);
        break;
      case 'w':
        text.x = MazeView.TILE_SIZE * x + this.padding;
        text.y = MazeView.TILE_SIZE * (y + 0.5) - (this.fontSize * 0.5);
        break;
      default:
        break;
    }
  }

  update() {
    for (let j = 0; j < this.texts.length; j += 1) {
      for (let i = 0; i < this.texts[j].length; i += 1) {
        Object.keys(this.texts[j][i]).forEach((direction) => {
          const textObject = this.texts[j][i][direction];
          textObject.text = this.ai.q[j][i][direction].toFixed(3);
          this.positionText(textObject, i, j, direction);
        });
      }
    }
  }
}

module.exports = MazeViewAIOverlay;
