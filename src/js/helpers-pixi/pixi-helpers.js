/**
 * Converts PIXI coordinates to screen coordinates.
 *
 * `pixiX`/`pixiY` come from `getBounds()`, which is in PIXI's *logical* coordinate space.
 * That space spans `app.screen.width`, i.e. `view.width / resolution` — NOT the backing-store
 * `view.width` (the `canvas.width` attribute), which PIXI's `resolution` option multiplies by
 * `resolution`. So we divide by the logical dimensions to get a fraction of the canvas, then
 * scale by the canvas's on-screen rect (which already includes every CSS transform).
 *
 * @param { HTMLCanvasElement } view
 *  The canvas element.
 * @param { number } pixiX
 * @param { number } pixiY
 * @param { number } resolution
 *  PIXI renderer resolution (`pixiOptions.resolution`). Defaults to 1.
 * @returns {[number, number]}
 */
export function screenCoordinates(view, pixiX, pixiY, resolution = 1) {
  const rect = view.getBoundingClientRect();
  const logicalWidth = view.width / resolution;
  const logicalHeight = view.height / resolution;
  const x = pixiX * (rect.width / logicalWidth) + rect.left;
  const y = pixiY * (rect.height / logicalHeight) + rect.top;
  return [x, y];
}

/**
 * Returns the scale factor that maps the canvas's *logical* (design) coordinate space to
 * on-screen pixels — i.e. how much the whole app is scaled on screen. The reaction icons are
 * DOM elements authored in those logical units, so this is the scale to apply to them.
 *
 * The logical width is `view.width / resolution`: PIXI's `resolution` option enlarges the
 * backing store (`view.width`) by `resolution`, and hosts undo that with a CSS down-scale on
 * the canvas so it still occupies its logical size on screen. `getBoundingClientRect().width`
 * already folds in every CSS transform (that down-scale plus any ancestor `scale()`), so
 * dividing it by the logical width yields the net app scale.
 *
 * @param { HTMLCanvasElement } view
 *  The canvas element.
 * @param { number } resolution
 *  PIXI renderer resolution (`pixiOptions.resolution`). Defaults to 1.
 * @returns { number }
 */
export function screenScale(view, resolution = 1) {
  const rect = view.getBoundingClientRect();
  const logicalWidth = view.width / resolution;
  return rect.width / logicalWidth;
}
