/* globals IMAGINARY, PIXI */
/* eslint-disable no-console */
// noinspection JSUnresolvedReference

require('../sass/default.scss');
require('../sass/exhibit.scss');
require('../sass/embed.scss');
require('./jquery-plugins/jquery.pointerclick');
const yaml = require('js-yaml');
const CfgLoader = require('./cfg-loader/cfg-loader');
const CfgReaderFetch = require('./cfg-loader/cfg-reader-fetch');
const I18n = require('./helpers-html/i18n');
const showFatalError = require('./helpers-html/show-fatal-error');
const Maze = require('./model/maze');
const Robot = require('./model/robot');
const QLearningAI = require('./model/qlearning-ai');
const setupKeyControls = require('./input/keyboard-controller');
const ExhibitMazeEditorPalette = require('./view-html/exhibit-maze-editor-palette');
const MazeEditor = require('./view-html/editor/maze-editor');
const MazeViewQvalueOverlay = require('./view-pixi/maze-view-qvalue-overlay');
const MazeViewPolicyOverlay = require('./view-pixi/maze-view-policy-overlay');
const AITrainingView = require('./view-html/ai-training-view');
const ReactionController = require('./view-html/reaction-controller');
const MazeView = require('./view-pixi/maze-view');
const RobotView = require('./view-pixi/robot-view');
const RewardBar = require('./view-html/reward-bar');

const qs = new URLSearchParams(window.location.search);

const embedConfig = {
  map: qs.get('map') || 'maze1',
  training: qs.get('training') || '',
  tiles: qs.has('tiles') ? qs.get('tiles').split(',') : [],
  commands: qs.has('cmds') ? qs.get('cmds').split(',') : [],
  exploreRate: qs.has('xr') ? Number(qs.get('xr')) : 0.2,
  learningRate: qs.has('lr') ? Number(qs.get('lr')) : 1,
  speed: qs.has('speed') ? Number(qs.get('speed')) : RobotView.Speed.DEFAULT,
  mapEditable: qs.get('editmap') === 'true',
  showQValues: qs.get('showqv') === 'true',
  showPolicy: qs.get('showpolicy') === 'true',
  autoRun: qs.get('autorun') === 'true',
  rewardBar: qs.get('showrewardbar') === 'true',
};

const configFiles = [
  'config/tiles.yml',
  'config/robot.yml',
  'config/items.yml',
  'config/ui.yml',
  'config/i18n.yml',
  'config/default-settings.yml',
];

// Validate the map identifier, which can only contain letters, numbers, and underscores.
if (embedConfig.map.match(/^[a-zA-Z0-9_-]+$/)) {
  configFiles.push(`data/mazes/${embedConfig.map}.json`);
}

// Validate the training identifier, which can only contain letters, numbers, and underscores.
if (embedConfig.training.match(/^[a-zA-Z0-9_-]+$/)) {
  configFiles.push(`data/training/${embedConfig.training}.json`);
}

const cfgLoader = new CfgLoader(CfgReaderFetch, yaml.load);
cfgLoader.load(configFiles)
  .catch((err) => {
    showFatalError('Error loading configuration', err);
    console.error('Error loading configuration');
    console.error(err);
  })
  .then((config) => I18n.init(config, qs.get('lang') || config.defaultLanguage || 'en')
    .then(() => config))
  .then((config) => IMAGINARY.i18n.init({
    queryStringVariable: 'lang',
    translationsDirectory: 'tr',
    defaultLanguage: 'en',
  })
    .then(() => {
      const languages = Object.keys(config.languages);
      return Promise.all(languages.map((code) => IMAGINARY.i18n.loadLang(code)));
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
      width: 500,
      height: 500,
      backgroundColor: 0xffffff,
    });
    // CHAOS
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

      // The ugliest hack
      IMAGINARY.i18n.strings.de['ai-training-view-slider-exploration-rate-limit-min'] = 'Ausbeuten';

      const maze = Maze.fromJSON({ map: config.map, items: config.mapItems });
      maze.config = config;
      const robot = new Robot();
      maze.addRobot(robot);
      const ai = new QLearningAI(maze.robot);
      setupKeyControls(robot);

      ai.learningRate = embedConfig.learningRate;
      ai.exploreRate = embedConfig.exploreRate;
      if (config.q) {
        ai.q = config.q;
      }

      const $body = $('body');

      const mazeViewSize = 500;
      const mazeWidth = (mazeViewSize / 8) * maze.map.width;
      const mazeHeight = (mazeViewSize / 8) * maze.map.height;
      const appMargin = 10;
      app.renderer.resize(mazeWidth + appMargin * 2, mazeHeight + appMargin * 2);

      const $rewardBarContainer = $('<div></div>').addClass('embed-reward-bar');

      $body
        .append($rewardBarContainer)
        .append($('<div></div>').addClass('embed-app')
          .append(app.view));

      let topView;
      let mazeView;
      if (embedConfig.mapEditable) {
        const mazeEditorPalette = new ExhibitMazeEditorPalette(
          $('<div></div>').addClass('embed-palette').appendTo($body),
          config
        );
        mazeEditorPalette.events.on('action', (type) => {
          if (type === 'reset-map') {
            maze.copy(Maze.fromJSON({ map: config.map, items: config.mapItems }));
            maze.reset();
            robot.reset();
            ai.clear();
          }
        });

        Object.entries(mazeEditorPalette.tileButtons).forEach(([id, button]) => {
          if (!embedConfig.tiles.includes(id)) {
            button.css({ display: 'none' });
          }
        });

        if (!embedConfig.mapEditable) {
          mazeEditorPalette.resetMapButton.css({ display: 'none' });
        }

        topView = new MazeEditor(
          $('<div></div>').addClass('embed-maze').appendTo($body),
          maze,
          mazeEditorPalette,
          config,
          textures
        );
        mazeView = topView.mazeView;
      } else {
        topView = new MazeView(maze, config, textures);
        mazeView = topView;
        $body.addClass('no-palette');
      }

      app.stage.addChild(topView.displayObject);
      topView.displayObject.width = mazeWidth;
      topView.displayObject.height = mazeHeight;
      topView.displayObject.x = appMargin;
      topView.displayObject.y = appMargin;

      if (embedConfig.showQValues) {
        const aiOverlay = new MazeViewQvalueOverlay(mazeView, ai);
        mazeView.addOverlay(aiOverlay.displayObject);
        aiOverlay.toggle();
      }

      const policyOverlay = new MazeViewPolicyOverlay(mazeView, ai, textures.arrow);
      mazeView.addOverlay(policyOverlay.displayObject);
      policyOverlay.hide();

      if (embedConfig.showPolicy) {
        policyOverlay.show();
      }

      app.ticker.add((time) => topView.animate(time));

      const trainingView = new AITrainingView(ai, topView.getRobotView());
      $('<div></div>')
        .addClass('embed-training')
        .appendTo($body)
        .append(trainingView.$element);

      trainingView.events
        .on('policy-show', () => {
          policyOverlay.show();
        })
        .on('policy-hide', () => {
          policyOverlay.hide();
        });

      // run,turbo,clear,reset-map,xr,showqv
      const commandButtonMap = {
        run: trainingView.$runButton,
        turbo: trainingView.$turboButton,
        clear: trainingView.$clearButton,
        step: trainingView.$stepButton,
        xr: trainingView.$explorationRateSlider,
        policy: trainingView.$viewPolicyButton,
        'reset-map': null,
        showqv: null,
      };

      Object.entries(commandButtonMap).forEach(([command, $button]) => {
        if ($button && !embedConfig.commands.includes(command)) {
          $button.css({ display: 'none' });
        }
      });

      if (embedConfig.rewardBar) {
        const rewardBar = new RewardBar(topView.getRobotView());
        $rewardBarContainer.append(rewardBar.$element);
      }

      const reactionController = new ReactionController($body, config);
      topView.getRobotView().events.on('reactEnd', (animation) => {
        const bounds = topView.getRobotView().sprite.getBounds();
        reactionController.launchReaction(
          animation.reaction,
          bounds.x,
          bounds.y - bounds.height / 2
        );
      });

      // Refresh language
      I18n.setLanguage(I18n.getLanguage());

      if (embedConfig.autoRun) {
        trainingView.running = true;
        trainingView.robotIdle = false;
        ai.step();
      }

      topView.getRobotView().speed = RobotView.Speed.SLOW;
    });
  });

// Disable context menu on long touch
$(window).on('contextmenu', (event) => {
  if (event.button !== 2 && !(event.clientX === 1 && event.clientY === 1)) {
    event.preventDefault();
  }
});
