/* globals PIXI */

class RobotView {
  constructor(robot, tileSize, texture) {
    this.robot = robot;
    this.tileSize = tileSize;

    this.waypoints = [];
    this.speed = 15;

    this.sprite = RobotView.createSprite(tileSize, texture);
    this.setPosition(this.robot.x, this.robot.y);
  }

  static createSprite(tileSize, texture) {
    const sprite = new PIXI.Sprite();
    sprite.width = tileSize;
    sprite.height = tileSize;
    sprite.roundPixels = true;
    sprite.texture = texture;

    return sprite;
  }

  setPosition(x, y) {
    this.sprite.x = x * this.tileSize;
    this.sprite.y = y * this.tileSize;
  }

  moveTo(x, y) {
    this.waypoints.push([x, y]);
  }

  animate(time) {
    if (this.waypoints.length > 0) {
      const destX = this.waypoints[0][0] * this.tileSize;
      const destY = this.waypoints[0][1] * this.tileSize;
      const deltaX = destX - this.sprite.x;
      const deltaY = destY - this.sprite.y;

      this.sprite.x += Math.min(Math.abs(deltaX), time * this.speed) * Math.sign(deltaX);
      this.sprite.y += Math.min(Math.abs(deltaY), time * this.speed) * Math.sign(deltaY);

      if (this.sprite.x === destX && this.sprite.y === destY) {
        this.waypoints = this.waypoints.slice(1);
      }
    }
  }
}

module.exports = RobotView;
