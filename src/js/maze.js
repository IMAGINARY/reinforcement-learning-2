const Grid = require('./grid.js');
const Array2D = require('./aux/array-2d.js');

class Maze {
  constructor(width, height, cells = null, config) {
    this.map = new Grid(width, height, cells);
    this.config = config;
    this.robots = [];
  }

  toJSON() {
    const { map } = this;
    return {
      map: map.toJSON(),
    };
  }

  static fromJSON(jsonObject) {
    const { map } = jsonObject;
    const { width, height } = map;
    return new Maze(width, height, Array2D.clone(map.cells));
  }

  copy(maze) {
    this.map.copy(maze.map);
  }

  addRobot(robot) {
    this.robots.push(robot);
    robot.maze = this;
    // Put the robot in the lower left corner
    robot.x = 0;
    robot.y = this.map.height - 1;
  }

  isWalkable(x, y) {
    return this.config.tileTypes
      && this.config.tileTypes[this.map.get(x, y)]
      && this.config.tileTypes[this.map.get(x, y)].walkable;
  }
}

module.exports = Maze;
