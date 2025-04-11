/* globals PIXI */
const MazeView = require('./maze-view');

const ARROW_TEXTURE_SCALE = 0.25;

class MazeViewPolicyOverlay {
  constructor(mazeView, ai, arrowTexture, options = {}) {
    this.view = mazeView;
    this.ai = ai;
    this.options = { ...MazeViewPolicyOverlay.defaultOptions, ...options };
    this.arrowTexture = arrowTexture;
    this.fontSize = 22 * this.view.resolutionScale;
    this.padding = 18 * this.view.resolutionScale;

    this.visible = false;
    this.displayObject = new PIXI.Container();
    this.displayObject.visible = this.visible;

    this.backgrounds = [];
    this.arrows = [];
    this.texts = [];

    if (this.options.showBackgrounds) {
      this.createBackgrounds();
    }

    if (this.options.showArrows) {
      this.createArrows();
    }
    if (this.options.showText) {
      this.createTexts();
    }

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
      .drawRect(0, 0, this.view.tileSize, this.view.tileSize)
      .endFill();

    background.x = this.view.tileSize * x;
    background.y = this.view.tileSize * y;

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
    sprite.width = this.view.tileSize * ARROW_TEXTURE_SCALE;
    sprite.height = this.view.tileSize * ARROW_TEXTURE_SCALE;
    sprite.anchor.set(0.5, 1);
    const yOffset = this.options.showText ? 0.35 : 0.5;

    sprite.x = Math.round(this.view.tileSize * (x + 0.5));
    sprite.y = Math.round(this.view.tileSize * (y + yOffset));
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
    const yOffset = this.options.showArrows
      ? this.view.tileSize - (this.fontSize + this.padding)
      : 0.5 * (this.view.tileSize - this.fontSize);

    for (let y = 0; y < height; y += 1) {
      this.texts[y] = new Array(width);
      for (let x = 0; x < width; x += 1) {
        const text = new PIXI.Text('', options);
        text.x = this.view.tileSize * (x + 0.5) - text.width / 2;
        text.y = this.view.tileSize * y + yOffset;
        this.texts[y][x] = text;
        this.displayObject.addChild(text);
      }
    }
  }

  showText(x, y, aString) {
    if (!this.texts.length) {
      return;
    }
    const text = this.texts[y][x];
    text.text = aString;
    text.x = this.view.tileSize * (x + 0.5) - text.width / 2;
    text.visible = true;
  }

  clearText(x, y) {
    if (!this.texts.length) {
      return;
    }
    const text = this.texts[y][x];
    text.visible = false;
  }

  showArrows(x, y, actions) {
    if (!this.arrows.length) {
      return;
    }
    const arrows = this.arrows[y][x];
    // Get all the actions with the highest Q value
    const maxQ = Math.max(...actions.map((([, q]) => q)));
    const bestActions = actions.filter(([, v]) => v === maxQ);
    const bestActionDirections = bestActions.map(([d]) => d);
    Object.keys(arrows).forEach((d) => {
      arrows[d].visible = bestActionDirections.includes(d);
    });
  }

  clearArrows(x, y) {
    if (!this.arrows.length) {
      return;
    }
    const arrows = this.arrows[y][x];
    Object.keys(arrows).forEach((d) => {
      arrows[d].visible = false;
    });
  }

  showBackground(x, y) {
    if (!this.backgrounds.length) {
      return;
    }
    const background = this.backgrounds[y][x];
    background.visible = true;
  }

  clearBackground(x, y) {
    if (!this.backgrounds.length) {
      return;
    }
    const background = this.backgrounds[y][x];
    background.visible = false;
  }

  update() {
    const { robot } = this.ai;
    const { maze } = robot;
    const { height, width } = this.view.maze.map;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (maze.isWalkable(x, y)) {
          const validActions = Object.entries(this.ai.q[y][x])
            .filter((([d]) => robot.availableDirectionsAt(x, y).includes(d)));
          if (validActions.length) {
            this.showBackground(x, y);
            this.showArrows(x, y, validActions);
            this.showText(x, y, this.ai.v[y][x].toFixed(2));
          } else {
            this.clearBackground(x, y);
            this.clearArrows(x, y);
            this.clearText(x, y);
          }
        } else {
          this.clearBackground(x, y);
          this.clearText(x, y);
          this.clearArrows(x, y);
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

MazeViewPolicyOverlay.defaultOptions = {
  showArrows: true,
  showText: true,
  showBackgrounds: true,
};

module.exports = MazeViewPolicyOverlay;
