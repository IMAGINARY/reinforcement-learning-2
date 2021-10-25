function setupKeyControls(robot) {
  const keyMap = {
    ArrowLeft: () => { robot.go('w'); },
    ArrowRight: () => { robot.go('e'); },
    ArrowUp: () => { robot.go('n'); },
    ArrowDown: () => { robot.go('s'); },
  };

  window.addEventListener('keydown', (ev) => {
    if (keyMap[ev.code]) {
      keyMap[ev.code]();
      ev.preventDefault();
    }
  });
}

module.exports = setupKeyControls;
