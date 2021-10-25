/* eslint-disable no-console */
/* globals PIXI */

const yaml = require('js-yaml');
const Maze = require('./maze.js');
const Robot = require('./robot.js');
const QLearningAI = require('./qlearning-ai.js');
const AITrainingView = require('./ai-training-view.js');
const MazeViewAIOverlay = require('./maze-view-ai-overlay.js');
const MazeEditor = require('./editor/maze-editor.js');
const setupKeyControls = require('./keyboard-controller');
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
    const app = new PIXI.Application({
      width: 1920,
      height: 1920,
      backgroundColor: 0xf2f2f2,
    });
    const textures = {};
    Object.entries(config.robots).forEach(([id, props]) => {
      if (props.texture) {
        const textureId = `robot-${id}`;
        textures[textureId] = null;
        app.loader.add(textureId, props.texture);
      }
    });
    Object.entries(config.items).forEach(([id, props]) => {
      if (props.texture) {
        const textureId = `item-${id}`;
        textures[textureId] = null;
        app.loader.add(textureId, props.texture);
      }
    });
    app.loader.load((loader, resources) => {
      Object.keys(textures).forEach((id) => {
        textures[id] = resources[id].texture;
      });

      const maze = Maze.fromJSON(maze1);
      maze.config = config;
      Object.entries(config.robots).forEach(([id, props]) => {
        const robot = new Robot(id, props);
        maze.addRobot(robot);
      });
      const ai = new QLearningAI(maze.robots[0]);
      setupKeyControls(maze.robots[0]);

      $('[data-component="app-container"]').append(app.view);
      // const mazeView = new MazeView(maze, config, textures);
      const mazeView = new MazeEditor($('body'), maze, config, textures);
      app.stage.addChild(mazeView.displayObject);
      mazeView.displayObject.width = 1920;
      mazeView.displayObject.height = 1920;
      mazeView.displayObject.x = 0;
      mazeView.displayObject.y = 0;

      const aiOverlay = new MazeViewAIOverlay(mazeView.mazeView, ai);
      mazeView.mazeView.addOverlay(aiOverlay.displayObject);
      window.addEventListener('keydown', (ev) => {
        if (ev.code === 'KeyD') {
          aiOverlay.toggle();
        }
      });
      app.ticker.add(time => mazeView.mazeView.animate(time));

      const trainingView = new AITrainingView(ai);
      $('.sidebar').append(trainingView.$element);
      app.ticker.add(time => trainingView.animate(time));
    });
  });
