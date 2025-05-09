/* globals PIXI */
// noinspection JSUnresolvedReference

const EventEmitter = require('events');
const PencilCursor = require('../../../static/fa/pencil-alt-solid.svg');
const RobotView = require('./robot-view');
const Array2D = require('../helpers/array-2d');

class MazeView {
  constructor(maze, config, textures = { }, interactive = false) {
    this.displayObject = new PIXI.Container();
    this.borderLayer = new PIXI.Container();
    this.tileLayer = new PIXI.Container();
    this.textureLayer = new PIXI.Container();
    this.itemLayer = new PIXI.Container();
    this.overlayLayer = new PIXI.Container();
    this.robotLayer = new PIXI.Container();
    this.displayObject.addChild(this.borderLayer);
    this.displayObject.addChild(this.tileLayer);
    this.displayObject.addChild(this.textureLayer);
    this.displayObject.addChild(this.itemLayer);
    this.displayObject.addChild(this.overlayLayer);
    this.displayObject.addChild(this.robotLayer);

    this.maze = maze;
    this.config = config;
    this.textures = textures;
    this.events = new EventEmitter();

    this.resolutionScale = this.config?.render?.resolutionScale || 1;
    this.tileSize = (this.config?.render?.tileSize || MazeView.DEFAULT_TILE_SIZE)
      * this.resolutionScale;
    this.floorTiles = Array2D.create(maze.map.width, maze.map.height, null);
    this.floorTextures = Array2D.create(maze.map.width, maze.map.height, null);
    this.visited = Array2D.create(maze.map.width, maze.map.height, false);

    this.robotView = null;

    const pointers = {};

    if (this.config?.ui?.maze?.borderStrokeSize) {
      const borderStrokeSize = this.config.ui.maze.borderStrokeSize
        * (this.resolutionScale || 1);
      const borderStrokeColor = this.config?.ui?.maze?.borderStrokeColor
        ? Number(`0x${this.config.ui.maze.borderStrokeColor.substring(1)}`) : 0x000000;
      const border = new PIXI.Graphics();
      this.borderLayer.addChild(border);
      border.lineStyle(borderStrokeSize, borderStrokeColor, 1, 1)
        .drawRect(
          0,
          0,
          maze.map.width * this.tileSize * this.resolutionScale,
          maze.map.height * this.tileSize * this.resolutionScale
        );
    }

    this.maze.map.allCells().forEach(([x, y]) => {
      const floorTile = new PIXI.Graphics();
      floorTile.x = x * this.tileSize;
      floorTile.y = y * this.tileSize;

      if (interactive) {
        floorTile.interactive = true;
        floorTile.on('pointerdown', (ev) => {
          pointers[ev.data.pointerId] = { lastTile: { x, y } };
          this.events.emit('action', [x, y], {
            shiftKey: ev.data.originalEvent.shiftKey,
          });
        });
        floorTile.cursor = `url(${PencilCursor}) 0 20, auto`;
      }
      this.floorTiles[y][x] = floorTile;

      const floorTexture = new PIXI.Sprite();
      floorTexture.x = x * this.tileSize;
      floorTexture.y = y * this.tileSize;
      floorTexture.width = this.tileSize;
      floorTexture.height = this.tileSize;
      floorTexture.roundPixels = false;
      this.floorTextures[y][x] = floorTexture;

      this.renderCell(x, y);
    });

    if (interactive) {
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
    }

    this.tileLayer.addChild(...Array2D.flatten(this.floorTiles));
    this.textureLayer.addChild(...Array2D.flatten(this.floorTextures));

    this.maze.map.events.on('update', this.handleMazeUpdate.bind(this));
    this.handleMazeUpdate(this.maze.map.allCells());

    const { robot } = this.maze;
    this.robotView = new RobotView(robot, this.tileSize, this.textures.robot);

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
    const textureScale = 0.5;
    const sprite = new PIXI.Sprite();
    sprite.x = item.x * this.tileSize + this.tileSize * 0.25;
    sprite.y = item.y * this.tileSize + this.tileSize * 0.25;
    sprite.width = this.tileSize * textureScale;
    sprite.height = this.tileSize * textureScale;
    sprite.roundPixels = false;
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
      / this.displayObject.scale.x / this.tileSize);
    const y = Math.floor((globalPoint.y - this.origin.y)
      / this.displayObject.scale.y / this.tileSize);

    return (x >= 0 && x < this.maze.map.width && y >= 0 && y < this.maze.map.height)
      ? { x, y } : null;
  }

  isStartCell(i, j) {
    return this.maze.startPosition[0] === i && this.maze.startPosition[1] === j;
  }

  renderCell(i, j) {
    const renderStartViaTileConfig = this.config?.ui?.maze?.startCellStyleViaTileConfig ?? false;
    if (this.isStartCell(i, j) && !renderStartViaTileConfig) {
      this.renderStartCell(i, j);
    } else {
      this.renderFloor(i, j);
    }
  }

  renderStartCell(i, j) {
    const strokeSize = (this.config.ui.maze.startCellStrokeSize || 10)
      * (this.resolutionScale || 1);
    const strokeColor = this.config.ui.maze.startCellStrokeColor
      ? Number(`0x${this.config.ui.maze.startCellStrokeColor.substring(1)}`) : 0x99ff99;
    const fillColor = this.config.ui.maze.startCellFillColor
      ? Number(`0x${this.config.ui.maze.startCellFillColor.substring(1)}`) : 0x99ff99;
    this.getFloorTile(i, j)
      .clear()
      .lineStyle(strokeSize, strokeColor, 1)
      .beginFill(fillColor)
      .drawRect(
        strokeSize / 2,
        strokeSize / 2,
        this.tileSize - strokeSize,
        this.tileSize - strokeSize
      )
      .endFill();
  }

  renderFloor(i, j) {
    const tileTypeId = this.isStartCell(i, j) ? 0 : this.maze.map.get(i, j);
    const tileType = this.config.tileTypes[tileTypeId] || null;
    const strokeSize = this.config?.ui?.maze?.cellStrokeSize || 3;
    const strokeColor = this.config?.ui?.maze?.cellStrokeColor || '#000000';
    this.getFloorTile(i, j)
      .clear()
      .lineStyle(
        strokeSize * this.resolutionScale,
        Number(`0x${strokeColor.substring(1)}`),
        1
      )
      .beginFill(tileType ? Number(`0x${tileType.color.substring(1)}`) : 0, 1)
      .drawRect(0, 0, this.tileSize, this.tileSize)
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
    this.overlayLayer.addChild(displayObject);
    this.overlayLayer.sortChildren();
  }

  animate(time) {
    this.robotView.animate(time);
  }

  getRobotView() {
    return this.robotView;
  }
}

MazeView.DEFAULT_TILE_SIZE = 120;

module.exports = MazeView;
