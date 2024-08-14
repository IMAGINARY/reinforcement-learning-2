/* eslint-disable no-console */
/* globals PIXI */
// noinspection JSUnresolvedReference

require('../sass/default.scss');
require('../sass/exhibit.scss');
require('./jquery-plugins/jquery.pointerclick');
const yaml = require('js-yaml');
const CfgLoader = require('./cfg-loader/cfg-loader');
const CfgReaderFetch = require('./cfg-loader/cfg-reader-fetch');
const I18n = require('./exhibit/i18n');
const showFatalError = require('./lib/show-fatal-error');
const LangSwitcher = require('./lang-switcher');
const Maze = require('./maze');
const maze1 = require('../../data/mazes/maze1.json');
const Robot = require('./robot');
const QLearningAI = require('./qlearning-ai');
const setupKeyControls = require('./keyboard-controller');
const ExhibitMazeEditorPalette = require('./exhibit/exhibit-maze-editor-palette');
const MazeEditor = require('./editor/maze-editor');
const MazeViewQvalueOverlay = require('./maze-view-qvalue-overlay');
const MazeViewPolicyOverlay = require('./maze-view-policy-overlay');
const AITrainingView = require('./ai-training-view');
const ExploreExploitInteractive = require('./exhibit/interactive-explore-exploit');
const RewardsInteractive = require('./exhibit/interactive-rewards');
const ReactionController = require('./reaction-controller');
const { disableContextMenuOnLongTouch } = require('./helpers-html/disable-context-menu-touch');
const loadTextures = require('./helpers-pixi/loadTextures');

(async () => {
  try {
    const qs = new URLSearchParams(window.location.search);

    const cfgLoader = new CfgLoader(CfgReaderFetch, yaml.load);
    const config = await cfgLoader.load([
      'config/tiles.yml',
      'config/robot.yml',
      'config/items.yml',
      'config/i18n.yml',
      'config/exhibit.yml',
      'config/default-settings.yml',
      'settings-exhibit.yml',
    ]).catch((err) => {
      throw new Error(`Error loading configuration: ${err.message}`);
    });

    await I18n.init(config, qs.get('lang') || config.defaultLanguage || 'en')
      .catch((err) => {
        throw new Error(`Error initializing i18n: ${err.message}`);
      });

    const itemTextures = Object.fromEntries(Object.entries(config.items)
      .filter(([, props]) => props.texture)
      .map(([id, props]) => [`item-${id}`, props.texture]));

    const tileTextures = Object.fromEntries(Object.entries(config.tileTypes)
      .filter(([, props]) => props.texture)
      .map(([id, props]) => [`tile-${id}`, props.texture]));

    const visitedTileTextures = Object.fromEntries(Object.entries(config.tileTypes)
      .filter(([, props]) => props.textureVisited)
      .map(([id, props]) => [`tile-${id}-visited`, props.textureVisited]));

    const textures = await loadTextures({
      robot: config.robot.texture,
      arrow: 'static/icons/arrow.svg',
      ...itemTextures,
      ...tileTextures,
      ...visitedTileTextures,
    }).catch((err) => {
      throw new Error(`Error loading textures: ${err.message}`);
    });

    const app = new PIXI.Application({
      width: 1920,
      height: 1080,
      backgroundColor: 0xffffff,
    });

    const maze = Maze.fromJSON(maze1);
    maze.config = config;
    const robot = new Robot();
    maze.addRobot(robot);
    const ai = new QLearningAI(maze.robot);
    setupKeyControls(robot);

    $('#pixi-app-container').append(app.view);
    // const mazeView = new MazeView(maze, config, textures);
    const $panel4 = $('#panel-4');
    const mazeEditorPalette = new ExhibitMazeEditorPalette($panel4, config);
    mazeEditorPalette.events.on('action', (type) => {
      if (type === 'reset-map') {
        maze.copy(Maze.fromJSON(maze1));
        maze.reset();
        robot.reset();
        ai.clear();
      }
    });

    const mazeView = new MazeEditor($panel4, maze, mazeEditorPalette, config, textures);
    app.stage.addChild(mazeView.displayObject);
    mazeView.displayObject.width = 720;
    mazeView.displayObject.height = 720;
    mazeView.displayObject.x = 1080;
    mazeView.displayObject.y = (1080 - 800) / 2;

    const aiOverlay = new MazeViewQvalueOverlay(mazeView.mazeView, ai);
    mazeView.mazeView.addOverlay(aiOverlay.displayObject);
    window.addEventListener('keydown', (ev) => {
      if (ev.code === 'KeyD') {
        aiOverlay.toggle();
      }
    });

    const { policyOverlayAlwaysVisible } = config.panels.editor;
    const policyOverlay = new MazeViewPolicyOverlay(
      mazeView.mazeView,
      ai,
      textures.arrow,
      {
        showArrows: config?.panels?.editor?.policyOverlayShowArrows,
        showText: config?.panels?.editor?.policyOverlayShowText,
        showBackgrounds: config?.panels?.editor?.policyOverlayShowBackground,
      }
    );
    mazeView.mazeView.addOverlay(policyOverlay.displayObject);
    if (policyOverlayAlwaysVisible) {
      policyOverlay.show();
    } else {
      policyOverlay.hide();
    }

    app.ticker.add((time) => mazeView.mazeView.animate(time));

    const trainingView = new AITrainingView(ai, mazeView.mazeView.robotView, {
      showViewPolicyButton: !policyOverlayAlwaysVisible,
    });
    $('#training-ui').append(trainingView.$element);
    trainingView.events
      .on('policy-show', () => {
        policyOverlay.show();
      })
      .on('policy-hide', () => {
        policyOverlay.hide();
      });

    const reactionController = new ReactionController($('body'), config);
    mazeView.mazeView.robotView.events.on('reactEnd', (animation) => {
      const bounds = mazeView.mazeView.robotView.sprite.getBounds();
      reactionController.launchReaction(
        animation.reaction,
        bounds.x,
        bounds.y - bounds.height / 2
      );
    });

    const exploreExploitInteractive = new ExploreExploitInteractive(config, textures);
    app.stage.addChild(exploreExploitInteractive.view.displayObject);
    exploreExploitInteractive.view.displayObject.width = 480;
    exploreExploitInteractive.view.displayObject.height = (480 / 8) * 2;
    exploreExploitInteractive.view.displayObject.x = 20.25;
    exploreExploitInteractive.view.displayObject.y = 820.25;
    app.ticker.add((time) => exploreExploitInteractive.animate(time));
    $('#explore-exploit-ui').append(exploreExploitInteractive.ui.$element);

    const rewardsInteractive = new RewardsInteractive(config, textures);
    app.stage.addChild(rewardsInteractive.view.displayObject);
    rewardsInteractive.view.displayObject.width = 480;
    rewardsInteractive.view.displayObject.height = (480 / 8);
    rewardsInteractive.view.displayObject.x = 20.25;
    rewardsInteractive.view.displayObject.y = 500.25;
    app.ticker.add((time) => rewardsInteractive.animate(time));
    $('#rewards-bar').append(rewardsInteractive.$barContainer);
    $('#rewards-ui').append(rewardsInteractive.ui.$element);

    // Refresh language
    I18n.refresh();

    const container = $('[data-component=rl2-exhibit]');
    if (container && config.showLanguageSwitcher !== false) {
      // eslint-disable-next-line no-unused-vars
      const langSwitcher = new LangSwitcher(
        container.find('#lang-switcher-container')[0],
        { languages: config.languages },
        (code) => I18n.setLanguage(code)
      );
    }

    disableContextMenuOnLongTouch();
  } catch (err) {
    showFatalError(err.message, err);
    console.error(err);
  }
})();
