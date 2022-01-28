/* globals PIXI */
const EventEmitter = require('events');
const PencilCursor = require('../../static/fa/pencil-alt-solid.svg');
const RobotView = require('./robot-view');
const Array2D = require('./aux/array-2d');

class MazeView {
  constructor(maze, config, textures = { }) {
    this.displayObject = new PIXI.Container();
    this.tileLayer = new PIXI.Container();
    this.textureLayer = new PIXI.Container();
    this.itemLayer = new PIXI.Container();
    this.robotLayer = new PIXI.Container();
    this.displayObject.addChild(this.tileLayer);
    this.displayObject.addChild(this.textureLayer);
    this.displayObject.addChild(this.itemLayer);
    this.displayObject.addChild(this.robotLayer);

    this.maze = maze;
    this.config = config;
    this.textures = textures;
    this.events = new EventEmitter();

    this.floorTiles = Array2D.create(maze.map.width, maze.map.height, null);
    this.floorTextures = Array2D.create(maze.map.width, maze.map.height, null);
    this.visited = Array2D.create(maze.map.width, maze.map.height, false);

    this.robotView = null;

    const pointers = {};

    this.maze.map.allCells().forEach(([x, y]) => {
      const floorTile = new PIXI.Graphics();
      floorTile.x = x * MazeView.TILE_SIZE;
      floorTile.y = y * MazeView.TILE_SIZE;
      floorTile.interactive = true;
      floorTile.on('pointerdown', (ev) => {
        pointers[ev.data.pointerId] = { lastTile: { x, y } };
        this.events.emit('action', [x, y], {
          shiftKey: ev.data.originalEvent.shiftKey,
        });
      });
      floorTile.cursor = `url(${PencilCursor}) 0 20, auto`;
      this.floorTiles[y][x] = floorTile;

      const floorTexture = new PIXI.Sprite();
      floorTexture.x = x * MazeView.TILE_SIZE;
      floorTexture.y = y * MazeView.TILE_SIZE;
      floorTexture.width = MazeView.TILE_SIZE;
      floorTexture.height = MazeView.TILE_SIZE;
      floorTexture.roundPixels = true;
      this.floorTextures[y][x] = floorTexture;

      this.renderCell(x, y);
    });

    this.tileLayer.interactive = true;
    this.tileLayer.on('pointermove', (ev) => {
      if (pointers[ev.data.pointerId] !== undefined) {
        const tileCoords = this.getCoordsAtPosition(ev.data.global);
        if (pointers[ev.data.pointerId].lastTile !== tileCoords) {
          if (tileCoords) {
            this.events.emit('action', [tileCoords.x, tileCoords.y], {
              shiftKey: ev.data.originalEvent.shiftKey,
            });
          }
          pointers[ev.data.pointerId].lastTile = tileCoords;
        }
      }
    });

    const onEndPointer = (ev) => {
      delete pointers[ev.data.pointerId];
    };

    this.tileLayer.on('pointerup', onEndPointer);
    this.tileLayer.on('pointerupoutside', onEndPointer);
    this.tileLayer.on('pointercancel', onEndPointer);

    this.tileLayer.addChild(...Array2D.flatten(this.floorTiles));
    this.textureLayer.addChild(...Array2D.flatten(this.floorTextures));

    this.maze.map.events.on('update', this.handleMazeUpdate.bind(this));
    this.handleMazeUpdate(this.maze.map.allCells());

    const { robot } = this.maze;
    this.robotView = new RobotView(robot, MazeView.TILE_SIZE, this.textures.robot);

    robot.events.on('move', (direction, x1, y1, x2, y2, reward, tileType) => {
      if (direction) {
        this.robotView.moveTo(x2, y2);
      } else {
        this.robotView.teleport(x2, y2);
      }
      const reaction = this.config.tileTypes[this.maze.map.get(x2, y2)].react;
      if (reaction === 'always' || (reaction === 'once' && this.visited[y2][x2] === false)) {
        this.robotView.react(tileType, x2, y2);
      }
      this.visited[y2][x2] = true;
      this.renderCell(x2, y2);
    });

    robot.events.on('moveFailed', () => {
      this.robotView.nop();
    });

    robot.events.on('exited', () => {
      this.robotView.exitMaze();
    });

    robot.events.on('reset', () => {
      this.robotView.reset();
    });

    this.robotView.events.on('resetEnd', () => {
      this.maze.reset();
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

    this.maze.events.on('reset', () => {
      Array2D.setAll(this.visited, false);
      this.handleMazeUpdate(this.maze.map.allCells());
    });

    this.robotLayer.addChild(this.robotView.sprite);
  }

  createItemSprite(item) {
    const textureScale = this.config.items[item.type].textureScale || 0.5;
    const sprite = new PIXI.Sprite();
    sprite.x = item.x * MazeView.TILE_SIZE + MazeView.TILE_SIZE * 0.25;
    sprite.y = item.y * MazeView.TILE_SIZE + MazeView.TILE_SIZE * 0.25;
    sprite.width = MazeView.TILE_SIZE * textureScale;
    sprite.height = MazeView.TILE_SIZE * textureScale;
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

  getFloorTile(x, y) {
    return this.floorTiles[y][x];
  }

  getFloorTexture(x, y) {
    return this.floorTextures[y][x];
  }

  getCoordsAtPosition(globalPoint) {
    if (this.origin === undefined) {
      this.origin = new PIXI.Point();
    }
    this.origin = this.displayObject.getGlobalPosition(this.origin, false);

    const x = Math.floor((globalPoint.x - this.origin.x)
      / this.displayObject.scale.x / MazeView.TILE_SIZE);
    const y = Math.floor((globalPoint.y - this.origin.y)
      / this.displayObject.scale.y / MazeView.TILE_SIZE);

    return (x >= 0 && x < this.maze.map.width && y >= 0 && y < this.maze.map.height)
      ? { x, y } : null;
  }

  renderCell(i, j) {
    if (this.maze.startPosition[0] === i && this.maze.startPosition[1] === j) {
      this.renderStartCell(i, j);
    } else {
      this.renderFloor(i, j);
    }
  }

  renderStartCell(i, j) {
    this.getFloorTile(i, j)
      .clear()
      .lineStyle(10, 0x99ff99, 1)
      .beginFill(0xffffff)
      .drawRect(5, 5, MazeView.TILE_SIZE - 10, MazeView.TILE_SIZE - 10)
      .endFill();
  }

  renderFloor(i, j) {
    const tileTypeId = this.maze.map.get(i, j);
    const tileType = this.config.tileTypes[tileTypeId] || null;
    this.getFloorTile(i, j)
      .clear()
      .lineStyle(2, 0x0, 1)
      .beginFill(tileType ? Number(`0x${tileType.color.substr(1)}`) : 0, 1)
      .drawRect(0, 0, MazeView.TILE_SIZE, MazeView.TILE_SIZE)
      .endFill();

    if (tileType.texture !== undefined) {
      this.getFloorTexture(i, j).texture = this.visited[j][i] && tileType.textureVisited
        ? this.textures[`tile-${tileTypeId}-visited`] : this.textures[`tile-${tileTypeId}`];
      this.getFloorTexture(i, j).visible = true;
    } else {
      this.getFloorTexture(i, j).visible = false;
    }
  }

  handleMazeUpdate(updates) {
    updates.forEach(([i, j]) => {
      this.visited[j][i] = false;
      this.renderCell(i, j);
    });
  }

  addOverlay(displayObject) {
    this.displayObject.addChild(displayObject);
  }

  animate(time) {
    this.robotView.animate(time);
  }
}

MazeView.TILE_SIZE = 120;

module.exports = MazeView;
