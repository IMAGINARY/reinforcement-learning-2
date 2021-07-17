/* globals PIXI */
const EventEmitter = require('events');
const PencilCursor = require('../../static/fa/pencil-alt-solid.svg');

const TILE_SIZE = 120;

class MazeView {
  constructor(maze, config, textures = { }) {
    this.displayObject = new PIXI.Container();
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
      floorTile.x = i * TILE_SIZE;
      floorTile.y = j * TILE_SIZE;
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

    this.displayObject.addChild(...this.floorTiles);
    this.maze.map.events.on('update', this.handleCityUpdate.bind(this));
    this.handleCityUpdate(this.maze.map.allCells());

    this.robotSprites = this.maze.robots.map((robot) => {
      const robotSprite = new PIXI.Sprite();
      robotSprite.x = robot.x * TILE_SIZE;
      robotSprite.y = robot.y * TILE_SIZE;
      robotSprite.width = TILE_SIZE;
      robotSprite.height = TILE_SIZE;
      robotSprite.roundPixels = true;
      robotSprite.texture = this.textures[`robot-${robot.id}`];

      robot.events.on('move', (x1, y1, x2, y2) => {
        robotSprite.x = x2 * TILE_SIZE;
        robotSprite.y = y2 * TILE_SIZE;
      });

      return robotSprite;
    });

    this.displayObject.addChild(...this.robotSprites);
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
      .drawRect(0, 0, TILE_SIZE, TILE_SIZE)
      .endFill();
  }

  handleCityUpdate(updates) {
    updates.forEach(([i, j]) => { this.renderCell(i, j); });
  }
}

module.exports = MazeView;
