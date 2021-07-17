/* eslint-disable no-console */
/* globals PIXI */

const yaml = require('js-yaml');
const Maze = require('./maze.js');
const MazeView = require('./maze-view.js');
require('../sass/default.scss');
const maze1 = require('../../data/mazes/maze1.json');


fetch('./config.yml', { cache: 'no-store' })
  .then(response => response.text())
  .then(data => yaml.load(data))
  .catch((err) => {
    console.error('Error loading configuration');
    console.error(err);
  })
  .then((config) => {
    const maze = Maze.fromJSON(maze1);
    const app = new PIXI.Application({
      width: 3840,
      height: 1920,
      backgroundColor: 0xf2f2f2,
    });
    app.loader.load(() => {
      $('[data-component="app-container"]').append(app.view);

      const mazeView = new MazeView(maze, config);
      app.stage.addChild(mazeView.displayObject);
      mazeView.displayObject.width = 1920;
      mazeView.displayObject.height = 1920;
      mazeView.displayObject.x = 0;
      mazeView.displayObject.y = 0;
    });
  });
