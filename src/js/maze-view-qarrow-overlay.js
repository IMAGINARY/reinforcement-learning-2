/* globals PIXI */
const MazeView = require('./maze-view.js');

class MazeViewQarrowOverlay {
  constructor(mazeView, ai) {
    this.view = mazeView;
    this.ai = ai;
    this.visible = false;
    this.displayObject = new PIXI.Container();
    this.displayObject.visible = this.visible;
    this.green = 0x78df65;
    this.red = 0xfc6159;

    this.height = 20;
    this.padding = 5;
    this.width = 40;
    this.baseTriangle = new PIXI.Polygon([
      // x, y,
      0, 0,
      -1 * this.width / 2, this.height,
      this.width / 2, this.height,
    ]);

    this.qUpperBound = this.ai.qUpperBound();
    this.qLowerBound = this.ai.qLowerBound();

    this.arrows = [];
    this.createArrows();
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

  static directionColor(direction) {
    switch (direction) {
      case 'n':
        return 0xff0000;
      case 'e':
        return 0x00ff00;
      case 's':
        return 0x0000ff;
      case 'w':
        return 0xff00ff;
    }
  }

  static directionRotation(direction) {
    switch (direction) {
      case 'n':
        return 0;
      case 'e':
        return Math.PI * 0.5;
      case 's':
        return Math.PI;
      case 'w':
        return Math.PI * 1.5;
    }
  }

  coordinates(direction, x, y) {
    switch (direction) {
      case 'n':
        return [MazeView.TILE_SIZE * (x + 0.5),
                MazeView.TILE_SIZE * y + this.padding];
      case 's':
        return [MazeView.TILE_SIZE * (x + 0.5),
                MazeView.TILE_SIZE * (y + 1) - (this.padding)];
      case 'e':
        return [MazeView.TILE_SIZE * (x + 1) - (this.padding),
                MazeView.TILE_SIZE * (y + 0.5)];
      case 'w':
        return [MazeView.TILE_SIZE * x + this.padding,
                MazeView.TILE_SIZE * (y + 0.5)];
      default:
        break;
    }
  }

  createArrow(direction, x, y) {
    const [arrowX, arrowY] = this.coordinates(direction, x, y);
    const arrow = new PIXI.Graphics();
    this.drawArrow(arrow, this.arrowColor(x, y, direction), this.arrowOpacity(x, y, direction));
    arrow.x = arrowX;
    arrow.y = arrowY;
    arrow.rotation = MazeViewQarrowOverlay.directionRotation(direction);
    this.displayObject.addChild(arrow);
    return arrow;
  }

  drawArrow(arrow, color, opacity = 1.0) {
    arrow
      .clear()
      .beginFill(color, opacity)
      .drawPolygon(this.baseTriangle)
      .endFill();
  }

  createArrows() {
    const { height, width } = this.view.maze.map;
    const directions = ['n', 'e', 's', 'w'];

    for (let j = 0; j < height; j += 1) {
      this.arrows[j] = new Array(width);
      for (let i = 0; i < width; i += 1) {
        this.arrows[j][i] = Object.fromEntries(directions.map(d => [d, this.createArrow(d, i, j)]));
      }
    }
  }

  arrowColor(x, y, direction) {
    return this.ai.q[y][x][direction] > 0 ? this.green : this.red;
  }

   arrowOpacity(x, y, direction) {
    const bound = this.ai.q[y][x][direction] > 0 ? this.qUpperBound : this.qLowerBound;
    return bound === 0 ? 0 : 1 - Math.pow(1 - this.ai.q[y][x][direction] / bound, 0.3);
  }

  update() {
    const { robot } = this.ai;
    const { maze } = robot;

    this.qUpperBound = this.ai.qUpperBound();
    this.qLowerBound = this.ai.qLowerBound();

    for (let j = 0; j < this.arrows.length; j += 1) {
      for (let i = 0; i < this.arrows[j].length; i += 1) {
        Object.keys(this.arrows[j][i]).forEach((direction) => {
          const arrow = this.arrows[j][i][direction];
          if (maze.isWalkable(i, j) && robot.availableDirectionsAt(i, j).includes(direction)) {
            arrow.visible = true;
            this.drawArrow(arrow, this.arrowColor(i, j, direction), this.arrowOpacity(i, j, direction));
          } else {
            arrow.visible = false;
          }
        });
      }
    }
  }
}

module.exports = MazeViewQarrowOverlay;
