/* globals PIXI */

class PixiCompositeApp {
  constructor(width, height, backgroundColor = 0xffffff, pixiOptions = {}) {
    this.app = new PIXI.Application({
      width,
      height,
      backgroundColor,
      ...pixiOptions,
    });
  }

  getView() {
    return this.app.view;
  }

  addComponent(component, x, y, width, height) {
    const componentDisplayObject = component.getDisplayObject();
    componentDisplayObject.x = 0;
    componentDisplayObject.y = 0;
    componentDisplayObject.width = width;
    componentDisplayObject.height = height;

    const container = new PIXI.Container();
    container.addChild(componentDisplayObject);
    container.width = width;
    container.height = height;
    container.x = x;
    container.y = y;
    this.app.stage.addChild(container);

    if (component.animate && typeof component.animate === 'function') {
      this.app.ticker.add((time) => component.animate(time));
    }
  }
}

module.exports = PixiCompositeApp;
