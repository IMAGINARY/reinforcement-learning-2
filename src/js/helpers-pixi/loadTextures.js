/* globals PIXI */

/**
 * Load textures from a map of id to path.
 *
 * Returns a promise that resolves to a map of id to texture.
 *
 * @param {{[p: string]: string}} idPaths
 *  Map of id to texture path.
 * @returns {Promise<{[p: string]: PIXI.Texture}>}
 */
function loadTextures(idPaths) {
  return new Promise((resolve, reject) => {
    const loader = new PIXI.Loader();
    Object.entries(idPaths).forEach(([id, path]) => {
      loader.add(id, path);
    });

    const textures = Object.fromEntries(
      Object.keys(idPaths).map((id) => [id, null])
    );

    loader.onError.add((err) => {
      reject(err);
    });
    loader.load((l, resources) => {
      Object.keys(textures).forEach((id) => {
        textures[id] = resources[id].texture;
      });

      resolve(textures);
    });
  });
}

module.exports = loadTextures;
