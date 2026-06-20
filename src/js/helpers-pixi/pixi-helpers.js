/**
 * Converts PIXI coordinates to screen coordinates.
 *
 * @param { HTMLCanvasElement } view
 *  The canvas element.
 * @param { number } pixiX
 * @param { number } pixiY
 * @returns {[number, number]}
 */
export function screenCoordinates(view, pixiX, pixiY) {
  const rect = view.getBoundingClientRect();
  const x = pixiX * (rect.width / view.width) + rect.left;
  const y = pixiY * (rect.height / view.height) + rect.top;
  return [x, y];
}

/**
 * Returns the on-screen scale factor of the canvas, i.e. the CSS transform scale applied
 * by ancestors (e.g. AppScaler's `scale()`). This is independent of PIXI's internal
 * resolution scale: `clientWidth` is the untransformed CSS layout width, while
 * `getBoundingClientRect().width` includes ancestor transforms.
 *
 * @param { HTMLCanvasElement } view
 *  The canvas element.
 * @returns { number }
 */
export function screenScale(view) {
  return view.getBoundingClientRect().width / view.clientWidth;
}
