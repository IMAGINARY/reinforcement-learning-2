/* globals IMAGINARY, PIXI */
require('../sass/default.scss');
require('../sass/exhibit.scss');
require('./jquery-plugins/jquery.pointerclick');
const yaml = require('js-yaml');
const CfgLoader = require('./cfg-loader/cfg-loader');
const CfgReaderFetch = require('./cfg-loader/cfg-reader-fetch');
const I18n = require('./exhibit/i18n');
const showFatalError = require('./aux/show-fatal-error');
const LangSwitcher = require('./lang-switcher');
const Maze = require('./maze');
const maze1 = require('../../data/mazes/maze1.json');
const Robot = require('./robot');
const QLearningAI = require('./qlearning-ai');
const setupKeyControls = require('./keyboard-controller');
const MazeEditor = require('./editor/maze-editor');
const MazeViewAIOverlay = require('./maze-view-ai-overlay');
const AITrainingView = require('./ai-training-view');
const MazeEditorPalette = require('./editor/maze-editor-palette');

const qs = new URLSearchParams(window.location.search);

const cfgLoader = new CfgLoader(CfgReaderFetch, yaml.load);
cfgLoader.load([
  'config/tiles.yml',
  'config/robots.yml',
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
    const container = $('[data-component=rl2-exhibit]');
    // eslint-disable-next-line no-unused-vars
    const langSwitcher = new LangSwitcher(
      container.find('#lang-switcher-container')[0],
      { languages: config.languages },
      code => I18n.setLanguage(code)
    );

    const app = new PIXI.Application({
      width: 1920,
      height: 1080,
      backgroundColor: 0xffffff,
    });

    // CHAOS
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

      $('#pixi-app-container').append(app.view);
      // const mazeView = new MazeView(maze, config, textures);
      const mazeEditorPalette = new MazeEditorPalette($('#panel-4'), config);
      const mazeView = new MazeEditor($('#panel-4'), maze, mazeEditorPalette, config, textures);
      app.stage.addChild(mazeView.displayObject);
      mazeView.displayObject.width = 720;
      mazeView.displayObject.height = 720;
      mazeView.displayObject.x = 1080;
      mazeView.displayObject.y = (1080 - 720) / 2;

      const aiOverlay = new MazeViewAIOverlay(mazeView.mazeView, ai);
      mazeView.mazeView.addOverlay(aiOverlay.displayObject);
      window.addEventListener('keydown', (ev) => {
        if (ev.code === 'KeyD') {
          aiOverlay.toggle();
        }
      });
      app.ticker.add(time => mazeView.mazeView.animate(time));

      const trainingView = new AITrainingView(ai);
      $('#training-ui').append(trainingView.$element);
      app.ticker.add(time => trainingView.animate(time));
    });
  });
