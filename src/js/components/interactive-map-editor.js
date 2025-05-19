const Maze = require('../model/maze');
const maze1 = require('../../../data/mazes/maze1.json');
const Robot = require('../model/robot');
const QLearningAI = require('../model/qlearning-ai');
const setupKeyControls = require('../input/keyboard-controller');
const ExhibitMazeEditorPalette = require('../view-html/exhibit-maze-editor-palette');
const MazeEditor = require('../view-html/editor/maze-editor');
const MazeViewQvalueOverlay = require('../view-pixi/maze-view-qvalue-overlay');
const MazeViewPolicyOverlay = require('../view-pixi/maze-view-policy-overlay');
const AITrainingView = require('../view-html/ai-training-view');
const ReactionController = require('../view-html/reaction-controller');

const INITIAL_EXPLORE_RATE = 0.2;

class MapEditorInteractive {
  constructor(config, textures) {
    this.maze = Maze.fromJSON(maze1);
    this.maze.config = config;
    this.robot = new Robot();
    this.maze.addRobot(this.robot);
    this.ai = new QLearningAI(this.maze.robot);
    this.ai.exploreRate = INITIAL_EXPLORE_RATE;

    this.$element = $('<div></div>');
    const mazeEditorPalette = new ExhibitMazeEditorPalette(this.$element, config);
    mazeEditorPalette.events.on('action', (type) => {
      if (type === 'reset-map') {
        this.reset();
      }
    });

    this.view = new MazeEditor(this.$element, this.maze, mazeEditorPalette, config, textures);

    this.aiOverlay = new MazeViewQvalueOverlay(this.view.mazeView, this.ai);
    this.view.mazeView.addOverlay(this.aiOverlay.displayObject);

    const { policyOverlayAlwaysVisible } = config.panels.editor;
    this.policyOverlay = new MazeViewPolicyOverlay(
      this.view.mazeView,
      this.ai,
      textures.arrow,
      {
        showArrows: config?.panels?.editor?.policyOverlayShowArrows,
        showText: config?.panels?.editor?.policyOverlayShowText,
        showBackgrounds: config?.panels?.editor?.policyOverlayShowBackground,
      }
    );
    this.view.mazeView.addOverlay(this.policyOverlay.displayObject);
    if (policyOverlayAlwaysVisible) {
      this.policyOverlay.show();
    } else {
      this.policyOverlay.hide();
    }

    this.trainingView = new AITrainingView(this.ai, this.view.mazeView.robotView, {
      showViewPolicyButton: !policyOverlayAlwaysVisible,
      useToggleFFButton: config?.panels?.training?.useToggleFFButton || false,
      useToggleViewPolicyButton: config?.panels?.training?.useToggleViewPolicyButton || false,
    });
    $('#training-ui').append(this.trainingView.$element);
    this.trainingView.events
      .on('policy-show', () => {
        this.policyOverlay.show();
      })
      .on('policy-hide', () => {
        this.policyOverlay.hide();
      });

    if (config?.panels?.editor?.aiResetButtonResetsMaze) {
      this.trainingView.events.on('training-clear', () => {
        this.reset();
      });
    }
    if (config?.panels?.training?.aiResetButtonResetsExplorationRate) {
      this.trainingView.events.on('training-clear', () => {
        this.trainingView.setExplorationRate(INITIAL_EXPLORE_RATE);
      });
    }

    if (config?.robot?.showReactions !== false) {
      this.reactionController = new ReactionController($('body'), config);
      this.view.mazeView.robotView.events.on('reactEnd', (animation) => {
        const bounds = this.view.mazeView.robotView.sprite.getBounds();
        this.reactionController.launchReaction(
          animation.reaction,
          bounds.x,
          bounds.y - bounds.height / 2
        );
      });
    }
  }

  getDisplayObject() {
    return this.view.mazeView.displayObject;
  }

  setupKeyControls() {
    setupKeyControls(this.robot);
    window.addEventListener('keydown', (ev) => {
      if (ev.code === 'KeyD') {
        this.aiOverlay.toggle();
      }
    });
  }

  animate(time) {
    this.view.mazeView.animate(time);
  }

  reset() {
    this.maze.copy(Maze.fromJSON(maze1));
    this.maze.reset();
    this.robot.reset();
    this.ai.clear();
  }
}

module.exports = MapEditorInteractive;
