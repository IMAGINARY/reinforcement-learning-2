class KeyboardController {
  constructor(robot) {
    this.robot = robot;

    this.keyMap = {
      ArrowLeft: () => { this.robot.west(); },
      ArrowRight: () => { this.robot.east(); },
      ArrowUp: () => { this.robot.north(); },
      ArrowDown: () => { this.robot.south(); },
    };

    window.addEventListener('keydown', (ev) => {
      if (this.keyMap[ev.code]) {
        this.keyMap[ev.code]();
        ev.preventDefault();
      }
    });
  }
}

module.exports = KeyboardController;
