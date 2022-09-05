/* globals PIXI */
const MazeView = require('./maze-view.js');

const ARROW_TEXTURE_SCALE = 0.2;

class MazeViewPolicyOverlay {
  constructor(mazeView, ai, arrowTexture) {
    this.view = mazeView;
    this.ai = ai;
    this.arrowTexture = arrowTexture;
    this.fontSize = 22;
    this.padding = 18;

    this.visible = false;
    this.displayObject = new PIXI.Container();
    this.displayObject.visible = this.visible;

    this.backgrounds = [];
    this.arrows = [];
    this.texts = [];

    this.createBackgrounds();
    this.createArrows();
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

  createBackground(x, y) {
    const background = new PIXI.Graphics();

    background
      .clear()
      .beginFill(0xffffff, 0.75)
      .drawRect(0, 0, MazeView.TILE_SIZE, MazeView.TILE_SIZE)
      .endFill();

    background.x = MazeView.TILE_SIZE * x;
    background.y = MazeView.TILE_SIZE * y;

    this.displayObject.addChild(background);
    return background;
  }

  createBackgrounds() {
    const { height, width } = this.view.maze.map;

    for (let y = 0; y < height; y += 1) {
      this.backgrounds[y] = new Array(width);
      for (let x = 0; x < width; x += 1) {
        this.backgrounds[y][x] = this.createBackground(x, y);
      }
    }
  }

  createArrow(x, y, rotation) {
    const sprite = new PIXI.Sprite();
    sprite.texture = this.arrowTexture;
    sprite.roundPixels = true;
    sprite.width = this.arrowTexture.width * ARROW_TEXTURE_SCALE;
    sprite.height = this.arrowTexture.height * ARROW_TEXTURE_SCALE;
    sprite.anchor.set(0.5, 0.975);

    sprite.x = MazeView.TILE_SIZE * (x + 0.5);
    sprite.y = MazeView.TILE_SIZE * (y + 0.35);
    sprite.rotation = rotation;

    this.displayObject.addChild(sprite);

    return sprite;
  }

  createArrows() {
    const { height, width } = this.view.maze.map;

    for (let y = 0; y < height; y += 1) {
      this.arrows[y] = new Array(width);
      for (let x = 0; x < width; x += 1) {
        this.arrows[y][x] = {
          n: this.createArrow(x, y, MazeViewPolicyOverlay.Angles.n),
          e: this.createArrow(x, y, MazeViewPolicyOverlay.Angles.e),
          s: this.createArrow(x, y, MazeViewPolicyOverlay.Angles.s),
          w: this.createArrow(x, y, MazeViewPolicyOverlay.Angles.w),
        };
      }
    }
  }

  createTexts() {
    const { height, width } = this.view.maze.map;
    const options = { fontFamily: 'Arial', fontSize: this.fontSize, align: 'center' };

    for (let y = 0; y < height; y += 1) {
      this.texts[y] = new Array(width);
      for (let x = 0; x < width; x += 1) {
        const text = new PIXI.Text('', options);
        text.x = MazeView.TILE_SIZE * (x + 0.5) - text.width / 2;
        text.y = MazeView.TILE_SIZE * (y + 1) - (this.fontSize + this.padding);
        this.texts[y][x] = text;
        this.displayObject.addChild(text);
      }
    }
  }

  update() {
    const { robot } = this.ai;
    const { maze } = robot;

    for (let y = 0; y < this.arrows.length; y += 1) {
      for (let x = 0; x < this.arrows[y].length; x += 1) {
        const background = this.backgrounds[y][x];
        const arrows = this.arrows[y][x];
        const text = this.texts[y][x];
        if (maze.isWalkable(x, y)) {
          const validActions = Object.entries(this.ai.q[y][x])
            .filter((([d]) => robot.availableDirectionsAt(x, y).includes(d)));
          if (validActions.length) {
            // Get all the actions with the highest Q value
            const maxQ = Math.max(...validActions.map((([d, q]) => q)));
            const bestActions = validActions.filter(([, v]) => v === maxQ);
            const bestActionDirections = bestActions.map(([d]) => d);
            Object.keys(arrows).forEach((d) => {
              arrows[d].visible = bestActionDirections.includes(d);
            });
            text.text = this.ai.v[y][x].toFixed(2);
            text.x = MazeView.TILE_SIZE * (x + 0.5) - text.width / 2;
            background.visible = true;
            text.visible = true;
          } else {
            background.visible = false;
            text.visible = false;
            Object.keys(arrows).forEach((d) => {
              arrows[d].visible = false;
            });
          }
        } else {
          background.visible = false;
          text.visible = false;
          Object.keys(arrows).forEach((d) => {
            arrows[d].visible = false;
          });
        }
      }
    }
  }
}

MazeViewPolicyOverlay.Angles = {
  n: 0,
  e: Math.PI * 0.5,
  s: Math.PI,
  w: Math.PI * 1.5,
};

module.exports = MazeViewPolicyOverlay;
