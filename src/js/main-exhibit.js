/* eslint-disable no-console */

const PixiCompositeApp = require('./view-pixi/pixi-composite-app');
const ExploreExploitInteractive = require('./components/interactive-explore-exploit');
const RewardsInteractive = require('./components/interactive-rewards');
const MapEditorInteractive = require('./components/interactive-map-editor');
const runExhibit = require('./run-exhibit');
const AppScaler = require('./helpers-html/app-scaler').default;

runExhibit((config, textures) => {
  // eslint-disable-next-line no-unused-vars
  const scaler = new AppScaler($('.app-scaler')[0], 1920, 1080);

  const resScale = config?.render?.resolutionScale || 1;
  const app = new PixiCompositeApp(
    1920 * resScale,
    1080 * resScale,
    0xffffff,
    config.pixiOptions || {}
  );
  $('#pixi-app-container').append(app.getView());

  const exploreExploitInteractive = new ExploreExploitInteractive(config, textures);
  app.addComponent(exploreExploitInteractive, 20.25, 820.25, 480, (480 / 8) * 2);
  $('#explore-exploit-ui').append(exploreExploitInteractive.ui.$element);

  const rewardsInteractive = new RewardsInteractive(config, textures);
  app.addComponent(rewardsInteractive, 20.25, 500.25, 480, 480 / 8);
  $('#rewards-bar').append(rewardsInteractive.$barContainer);
  $('#rewards-ui').append(rewardsInteractive.ui.$element);

  const mapEditorInteractive = new MapEditorInteractive(config, textures);
  app.addComponent(
    mapEditorInteractive,
    1080 + 0.25,
    (1080 - 800) / 2 + 0.25,
    720 * resScale,
    720 * resScale
  );
  mapEditorInteractive.setupKeyControls();
  $('#panel-4').append(mapEditorInteractive.$element);
});
