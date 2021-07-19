class KeyboardController {
  constructor(robot) {
    this.robot = robot;

    this.keyMap = {
      ArrowLeft: () => { this.robot.go('w'); },
      ArrowRight: () => { this.robot.go('e'); },
      ArrowUp: () => { this.robot.go('n'); },
      ArrowDown: () => { this.robot.go('s'); },
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
