/**
 * Converts PIXI coordinates to screen coordinates.
 *
 * @param { HTMLCanvasElement } view
 *  The canvas element.
 * @param { number } pixiX
 * @param { number } pixiY
 * @returns {[number, number]}
 */
// eslint-disable-next-line import/prefer-default-export
export function screenCoordinates(view, pixiX, pixiY) {
  const rect = view.getBoundingClientRect();
  const x = pixiX * (rect.width / view.width) + rect.left;
  const y = pixiY * (rect.height / view.height) + rect.top;
  return [x, y];
}
