const Grid = require('./grid.js');
const Array2D = require('./aux/array-2d.js');

class Maze {
  constructor(width, height, cells = null) {
    this.map = new Grid(width, height, cells);
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
}

Maze.Tiles = {
  WALL: 1,
  FLOOR: 2,
};

module.exports = Maze;
