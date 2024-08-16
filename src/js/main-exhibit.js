/* eslint-disable no-console */
/* globals PIXI */
// noinspection JSUnresolvedReference

const Maze = require('./model/maze');
const maze1 = require('../../data/mazes/maze1.json');
const Robot = require('./model/robot');
const QLearningAI = require('./model/qlearning-ai');
const setupKeyControls = require('./input/keyboard-controller');
const ExhibitMazeEditorPalette = require('./view-html/exhibit-maze-editor-palette');
const MazeEditor = require('./view-html/editor/maze-editor');
const MazeViewQvalueOverlay = require('./view-pixi/maze-view-qvalue-overlay');
const MazeViewPolicyOverlay = require('./view-pixi/maze-view-policy-overlay');
const AITrainingView = require('./view-html/ai-training-view');
const ExploreExploitInteractive = require('./exhibit/interactive-explore-exploit');
const RewardsInteractive = require('./exhibit/interactive-rewards');
const ReactionController = require('./view-html/reaction-controller');
const runExhibit = require('./run-exhibit');

runExhibit((config, textures) => {
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
    useToggleFFButton: config?.panels?.training?.useToggleFFButton || false,
    useToggleViewPolicyButton: config?.panels?.training?.useToggleViewPolicyButton || false,
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
});
