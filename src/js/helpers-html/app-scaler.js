/**
 * AppScaler class
 *
 * This class is used to scale the app element to fit within the viewport.
 * It preserves the aspect ratio of the app element and ensures that it is centered.
 */
export default class AppScaler {
  constructor(appElement, appWidth = null, appHeight = null) {
    this.appElement = appElement;
    this.appWidth = appWidth;
    this.appHeight = appHeight;

    if (this.appElement.classList.contains('app-scaler')) {
      this.element = this.appElement;
    } else {
      this.element = document.createElement('div');
      this.element.classList.add('app-scaler');
      this.element.append(this.appElement);
    }

    window.addEventListener('resize', this.handleResize.bind(this));
    this.handleResize();
  }

  /**
   * Refresh the app scaler.
   */
  handleResize() {
    const appWidth = this.appWidth || this.appElement.offsetWidth;
    const appHeight = this.appHeight  || this.appElement.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate the scale factor
    const scaleFactor = Math.min(viewportWidth / appWidth, viewportHeight / appHeight);

    // Set the scale factor and center the app element
    this.element.style.transform = `scale(${scaleFactor})`;
    this.element.style.transformOrigin = 'top left';
    this.element.style.left = `${(viewportWidth - appWidth * scaleFactor) / 2}px`;
    this.element.style.top = `${(viewportHeight - appHeight * scaleFactor) / 2}px`;
    this.element.style.position = 'absolute';
  }

  refresh() {
    this.handleResize();
  }
}
