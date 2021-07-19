/* globals PIXI */
const EventEmitter = require('events');
const PencilCursor = require('../../static/fa/pencil-alt-solid.svg');

class MazeView {
  constructor(maze, config, textures = { }) {
    this.displayObject = new PIXI.Container();
    this.tileLayer = new PIXI.Container();
    this.itemLayer = new PIXI.Container();
    this.robotLayer = new PIXI.Container();
    this.displayObject.addChild(this.tileLayer);
    this.displayObject.addChild(this.itemLayer);
    this.displayObject.addChild(this.robotLayer);

    this.maze = maze;
    this.config = config;
    this.textures = textures;
    this.events = new EventEmitter();

    this.floorTiles = Array(this.maze.map.width * this.maze.map.height);
    this.robotSprites = [];

    let pointerActive = false;
    $(window).on('mouseup', () => { pointerActive = false; });

    this.maze.map.allCells().forEach(([i, j]) => {
      const floorTile = new PIXI.Graphics();
      floorTile.x = i * MazeView.TILE_SIZE;
      floorTile.y = j * MazeView.TILE_SIZE;
      floorTile.interactive = true;
      floorTile.on('mousedown', (ev) => {
        pointerActive = true;
        this.events.emit('action', [i, j], {
          shiftKey: ev.data.originalEvent.shiftKey,
        });
      });
      floorTile.on('mouseover', (ev) => {
        if (pointerActive) {
          this.events.emit('action', [i, j], {
            shiftKey: ev.data.originalEvent.shiftKey,
          });
        }
      });
      floorTile.cursor = `url(${PencilCursor}) 0 20, auto`;
      this.floorTiles[this.maze.map.offset(i, j)] = floorTile;

      this.renderCell(i, j);
    });

    this.tileLayer.addChild(...this.floorTiles);
    this.maze.map.events.on('update', this.handleCityUpdate.bind(this));
    this.handleCityUpdate(this.maze.map.allCells());

    this.robotSprites = this.maze.robots.map((robot) => {
      const robotSprite = new PIXI.Sprite();
      robotSprite.x = robot.x * MazeView.TILE_SIZE;
      robotSprite.y = robot.y * MazeView.TILE_SIZE;
      robotSprite.width = MazeView.TILE_SIZE;
      robotSprite.height = MazeView.TILE_SIZE;
      robotSprite.roundPixels = true;
      robotSprite.texture = this.textures[`robot-${robot.id}`];

      robot.events.on('move', (direction, x1, y1, x2, y2) => {
        robotSprite.x = x2 * MazeView.TILE_SIZE;
        robotSprite.y = y2 * MazeView.TILE_SIZE;
      });

      robot.events.on('exited', () => {
        robot.canMove = false;
        setTimeout(() => {
          this.maze.reset();
          robot.canMove = true;
        }, 1000);
      });

      return robotSprite;
    });

    this.itemSprites = {};
    this.maze.items.forEach((item) => { this.createItemSprite(item); });
    this.maze.events.on('itemPlaced', (item) => {
      this.createItemSprite(item);
    });

    this.maze.events.on('itemRemoved', (item) => {
      this.removeItemSprite(item);
    });

    this.maze.events.on('itemPicked', (item) => {
      this.handleItemPicked(item);
    });

    this.maze.events.on('itemReset', (item) => {
      this.handleItemReset(item);
    });

    this.robotLayer.addChild(...this.robotSprites);
  }

  createItemSprite(item) {
    const sprite = new PIXI.Sprite();
    sprite.x = item.x * MazeView.TILE_SIZE + MazeView.TILE_SIZE * 0.25;
    sprite.y = item.y * MazeView.TILE_SIZE + MazeView.TILE_SIZE * 0.25;
    sprite.width = MazeView.TILE_SIZE * 0.5;
    sprite.height = MazeView.TILE_SIZE * 0.5;
    sprite.roundPixels = true;
    sprite.texture = this.textures[`item-${item.type}`];

    this.itemSprites[item.id] = sprite;

    this.itemLayer.addChild(sprite);
  }

  removeItemSprite(item) {
    if (this.itemSprites[item.id]) {
      const sprite = this.itemSprites[item.id];
      this.itemLayer.removeChild(sprite);
      sprite.destroy();
      delete this.itemSprites[item.id];
    }
  }

  handleItemPicked(item) {
    if (this.itemSprites[item.id]) {
      this.itemSprites[item.id].visible = false;
    }
  }

  handleItemReset(item) {
    if (this.itemSprites[item.id]) {
      this.itemSprites[item.id].visible = true;
    }
  }

  getFloorTile(i, j) {
    return this.floorTiles[this.maze.map.offset(i, j)];
  }

  renderCell(i, j) {
    this.renderFloor(i, j);
  }

  renderFloor(i, j) {
    const tileType = this.config.tileTypes[this.maze.map.get(i, j)] || null;
    this.getFloorTile(i, j)
      .clear()
      .lineStyle(2, 0x0, 0.3)
      .beginFill(tileType ? Number(`0x${tileType.color.substr(1)}`) : 0, 1)
      .drawRect(0, 0, MazeView.TILE_SIZE, MazeView.TILE_SIZE)
      .endFill();
  }

  handleCityUpdate(updates) {
    updates.forEach(([i, j]) => { this.renderCell(i, j); });
  }

  addOverlay(displayObject) {
    this.displayObject.addChild(displayObject);
  }
}

MazeView.TILE_SIZE = 120;

module.exports = MazeView;
