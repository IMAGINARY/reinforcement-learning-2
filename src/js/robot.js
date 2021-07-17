class Robot {
  constructor(id, props) {
    this.id = id;
    this.name = props.name || id;
    this.maze = null;
    this.x = 0;
    this.y = 0;
  }
}

module.exports = Robot;
