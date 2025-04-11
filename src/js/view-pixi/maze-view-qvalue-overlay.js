/* globals PIXI */

class MazeViewQvalueOverlay {
  constructor(mazeView, ai) {
    this.view = mazeView;
    this.ai = ai;
    this.visible = false;
    this.displayObject = new PIXI.Container();
    this.displayObject.visible = this.visible;

    this.fontSize = 18 * this.view.resolutionScale;;
    this.padding = 2 * this.view.resolutionScale;;

    this.texts = [];
    this.createTexts();
    this.update();

    this.ai.events.on('update', () => {
      this.update();
    });

    this.ai.robot.maze.map.events.on('update', () => {
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
      const text = new PIXI.Text('', ({ ...options, align }));
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
        text.x = this.view.tileSize * (x + 0.5) - text.width / 2;
        text.y = this.view.tileSize * y + this.padding;
        break;
      case 's':
        text.x = this.view.tileSize * (x + 0.5) - text.width / 2;
        text.y = this.view.tileSize * (y + 1) - (this.fontSize + this.padding);
        break;
      case 'e':
        text.x = this.view.tileSize * (x + 1) - (text.width + this.padding);
        text.y = this.view.tileSize * (y + 0.5) - (this.fontSize * 0.5);
        break;
      case 'w':
        text.x = this.view.tileSize * x + this.padding;
        text.y = this.view.tileSize * (y + 0.5) - (this.fontSize * 0.5);
        break;
      default:
        break;
    }
  }

  update() {
    const { robot } = this.ai;
    const { maze } = robot;

    for (let y = 0; y < this.texts.length; y += 1) {
      for (let x = 0; x < this.texts[y].length; x += 1) {
        const texts = this.texts[y][x];
        if (maze.isWalkable(x, y)) {
          const validActions = robot.availableDirectionsAt(x, y);

          Object.keys(texts).forEach((direction) => {
            if (validActions.includes(direction)) {
              const textObject = texts[direction];
              textObject.visible = true;
              textObject.text = this.ai.q[y][x][direction].toFixed(2);
              this.positionText(textObject, x, y, direction);
            } else {
              texts[direction].visible = false;
            }
          });
        } else {
          Object.keys(texts).forEach((direction) => {
            texts[direction].visible = false;
          });
        }
      }
    }
  }
}

module.exports = MazeViewQvalueOverlay;
