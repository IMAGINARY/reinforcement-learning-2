/* eslint-disable no-console */
/* globals PIXI */
require('../sass/default.scss');
require('../sass/desktop.scss');

const yaml = require('js-yaml');
const CfgLoader = require('./cfg-loader/cfg-loader');
const CfgReaderFetch = require('./cfg-loader/cfg-reader-fetch');
const showFatalError = require('./lib/show-fatal-error');
require('./jquery-plugins/jquery.pointerclick');
const Maze = require('./maze.js');
const Robot = require('./robot.js');
const QLearningAI = require('./qlearning-ai.js');
const AITrainingView = require('./ai-training-view.js');
const MazeViewQvalueOverlay = require('./maze-view-qvalue-overlay.js');
const MazeViewQarrowOverlay = require('./maze-view-qarrow-overlay.js');
const MazeViewPolicyOverlay = require('./maze-view-policy-overlay');
const MazeEditor = require('./editor/maze-editor.js');
const setupKeyControls = require('./keyboard-controller');
const maze1 = require('../../data/mazes/maze1.json');
const MazeEditorPalette = require('./editor/maze-editor-palette');
const ReactionController = require('./reaction-controller');
const I18n = require('./exhibit/i18n');
const { screenCoordinates } = require('./lib/pixi-helpers');

const qs = new URLSearchParams(window.location.search);

const cfgLoader = new CfgLoader(CfgReaderFetch, yaml.load);
cfgLoader.load([
  'config/tiles.yml',
  'config/robot.yml',
  'config/items.yml',
  'config/i18n.yml',
  'config/default-settings.yml',
  'settings.yml',
])
  .catch((err) => {
    showFatalError('Error loading configuration', err);
    console.error('Error loading configuration');
    console.error(err);
  })
  .then(config => I18n.init(config, qs.get('lang') || config.defaultLanguage || 'en')
    .then(() => config))
  .then(config => IMAGINARY.i18n.init({
      queryStringVariable: 'lang',
      translationsDirectory: 'tr',
      defaultLanguage: 'en',
    })
    .then(() => {
      const languages = Object.keys(config.languages);
      return Promise.all(languages.map(code => IMAGINARY.i18n.loadLang(code)));
    })
    .then(() => {
      const defaultLanguage = qs.get('lang') || config.defaultLanguage || 'en';
      return IMAGINARY.i18n.setLang(defaultLanguage);
    })
    .then(() => config)
    .catch((err) => {
      showFatalError('Error loading translations', err);
      console.error('Error loading translations');
      console.error(err);
    }))
  .then((config) => {
    const app = new PIXI.Application({
      width: 1920,
      height: 1920,
      backgroundColor: 0xf2f2f2,
    });
    const textures = {};
    textures.robot = null;
    app.loader.add('robot', config.robot.texture);
    textures.arrow = null;
    app.loader.add('arrow', 'static/icons/arrow.svg');
    Object.entries(config.items).forEach(([id, props]) => {
      if (props.texture) {
        const textureId = `item-${id}`;
        textures[textureId] = null;
        app.loader.add(textureId, props.texture);
      }
    });
    Object.entries(config.tileTypes).forEach(([id, props]) => {
      if (props.texture) {
        const textureId = `tile-${id}`;
        textures[textureId] = null;
        app.loader.add(textureId, props.texture);
      }
      if (props.textureVisited) {
        const textureId = `tile-${id}-visited`;
        textures[textureId] = null;
        app.loader.add(textureId, props.textureVisited);
      }
    });
    app.loader.load((loader, resources) => {
      Object.keys(textures).forEach((id) => {
        textures[id] = resources[id].texture;
      });

      const maze = Maze.fromJSON(maze1);
      maze.config = config;
      const robot = new Robot();
      maze.addRobot(robot);
      const ai = new QLearningAI(maze.robot);
      setupKeyControls(maze.robot);

      $('[data-component="app-container"]').append(app.view);
      // const mazeView = new MazeView(maze, config, textures);
      const mazeEditorPalette = new MazeEditorPalette($('body'), config);
      const mazeView = new MazeEditor($('body'), maze, mazeEditorPalette, config, textures);
      app.stage.addChild(mazeView.displayObject);
      mazeView.displayObject.width = 1920;
      mazeView.displayObject.height = 1920;
      mazeView.displayObject.x = 0;
      mazeView.displayObject.y = 0;

      // const qArrowOverlay = new MazeViewQarrowOverlay(mazeView.mazeView, ai);
      // mazeView.mazeView.addOverlay(qArrowOverlay.displayObject);
      // qArrowOverlay.show();

      const policyOverlay = new MazeViewPolicyOverlay(mazeView.mazeView, ai, textures.arrow);
      mazeView.mazeView.addOverlay(policyOverlay.displayObject);
      policyOverlay.hide();

      const qValueOverlay = new MazeViewQvalueOverlay(mazeView.mazeView, ai);
      mazeView.mazeView.addOverlay(qValueOverlay.displayObject);
      window.addEventListener('keydown', (ev) => {
        if (ev.code === 'KeyD') {
          qValueOverlay.toggle();
        }
      });
      app.ticker.add(time => mazeView.mazeView.animate(time));

      const reactionContainer = $('<div></div>')
        .addClass('reaction-container')
        .appendTo($('body'));
      const reactionController = new ReactionController(reactionContainer, config);
      mazeView.mazeView.robotView.events.on('reactEnd', (animation) => {
        const bounds = mazeView.mazeView.robotView.sprite.getBounds();
        const [x, y] = screenCoordinates(app.view, bounds.x - bounds.width / 4, bounds.y - bounds.height / 2);
        reactionController.launchReaction(animation.reaction, x, y);
      });
      window.pixiApp = app;

      const trainingView = new AITrainingView(ai, mazeView.mazeView.robotView);
      $('.sidebar').append(trainingView.$element);
      trainingView.events
        .on('policy-show', () => {
          policyOverlay.show();
        })
        .on('policy-hide', () => {
          policyOverlay.hide();
        });
      window.addEventListener('keydown', (ev) => {
        if (ev.code === 'KeyQ') {
          policyOverlay.toggle();
        }
      });

      // Refresh language
      I18n.setLanguage(I18n.getLanguage());
    });
  });
