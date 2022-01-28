const EventEmitter = require('events');
const Grid = require('./grid.js');
const Array2D = require('./aux/array-2d.js');

class Maze {
  constructor(width, height, cells = null, config) {
    this.map = new Grid(width, height, cells);
    this.config = config;
    this.robot = null;
    this.items = [];
    this.lastItemId = 0;
    this.startPosition = [0, height - 1];

    this.events = new EventEmitter();
  }

  toJSON() {
    const { map } = this;
    return {
      map: map.toJSON(),
      items: this.items.map(({ type, x, y }) => ({ type, x, y })),
    };
  }

  static fromJSON(jsonObject) {
    const { map, items } = jsonObject;
    const { width, height } = map;
    const maze = new Maze(width, height, Array2D.clone(map.cells));
    (items || []).forEach(({ type, x, y }) => {
      maze.placeItem(type, x, y);
    });
    return maze;
  }

  copy(maze) {
    this.map.copy(maze.map);
    this.clearItems();
    (maze.items || []).forEach(({ type, x, y }) => {
      this.placeItem(type, x, y);
    });
    this.lastItemId = maze.lastItemId;
  }

  addRobot(robot) {
    if (this.robot) {
      throw new Error('Robot already exists');
    }
    this.robot = robot;
    robot.maze = this;
    // Put the robot in the lower left corner
    const [startX, startY] = this.startPosition;
    robot.x = startX;
    robot.y = startY;
  }

  placeItem(type, x, y, erasable=true) {
    this.removeItem(x, y);
    this.lastItemId += 1;
    const newItem = {
      id: this.lastItemId,
      type,
      x,
      y,
      picked: false,
      erasable,
    };
    this.items.push(newItem);
    this.events.emit('itemPlaced', newItem);
  }

  getTileType(x, y) {
    return this.config.tileTypes
      && this.config.tileTypes[this.map.get(x, y)]
      && this.config.tileTypes[this.map.get(x, y)].type;
  }

  getItem(x, y) {
    const found = this.items.find(item => item.x === x && item.y === y);
    return found;
  }

  removeItem(x, y) {
    const item = this.getItem(x, y);
    if (item) {
      this.events.emit('itemRemoved', item);
      this.items = this.items.filter(any => any.id !== item.id);
    }
  }

  pickItem(x, y) {
    const item = this.getItem(x, y);
    if (item && !item.picked) {
      this.events.emit('itemPicked', item);
      item.picked = true;
      return item;
    }
    return null;
  }

  clearItems() {
    this.items.forEach((item) => {
      this.events.emit('itemRemoved', item);
    });
    this.items = [];
  }

  isWalkable(x, y) {
    return this.config.tileTypes
      && this.config.tileTypes[this.map.get(x, y)]
      && this.config.tileTypes[this.map.get(x, y)].walkable;
  }

  isExit(x, y) {
    return this.config.tileTypes
      && this.config.tileTypes[this.map.get(x, y)]
      && this.config.tileTypes[this.map.get(x, y)].exit;
  }

  reset() {
    this.items.forEach((item) => {
      item.picked = false;
      this.events.emit('itemReset', item);
    });
    this.events.emit('reset');
  }

  getItemReward(item) {
    return (this.config.items[item.type] && this.config.items[item.type].reward) || 0;
  }

  getPositionReward(x, y) {
    return (
      this.config.tileTypes[this.map.get(x, y)]
      && this.config.tileTypes[this.map.get(x, y)].reward
    ) || 0;
  }
}

module.exports = Maze;
