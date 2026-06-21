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
 * Returns the scale factor that maps *design* pixels (the CSS units the DOM/reaction assets
 * are authored in) to on-screen pixels. This combines two effects beyond any ancestor CSS
 * transform (e.g. AppScaler's `scale()`): PIXI's `resolution` enlarges the backing store, and
 * the app's `resolutionScale` enlarges the drawn geometry. The design width is therefore
 * `view.width / (resolution * resolutionScale)`, and `getBoundingClientRect().width` already
 * folds in every CSS transform on the canvas.
 *
 * @param { HTMLCanvasElement } view
 *  The canvas element.
 * @param { number } resolution
 *  PIXI renderer resolution (`pixiOptions.resolution`). Defaults to 1.
 * @param { number } resolutionScale
 *  App geometry scale (`config.render.resolutionScale`). Defaults to 1.
 * @returns { number }
 */
export function screenScale(view, resolution = 1, resolutionScale = 1) {
  const rect = view.getBoundingClientRect();
  const designWidth = view.width / (resolution * resolutionScale);
  return rect.width / designWidth;
}
