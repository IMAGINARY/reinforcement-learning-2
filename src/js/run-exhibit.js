/* eslint-disable no-console */
// noinspection JSUnresolvedReference

require('../sass/default.scss');
require('../sass/exhibit.scss');
require('./jquery-plugins/jquery.pointerclick');
const yaml = require('js-yaml');
const CfgLoader = require('./cfg-loader/cfg-loader');
const CfgReaderFetch = require('./cfg-loader/cfg-reader-fetch');
const I18n = require('./helpers-html/i18n');
const initSentry = require('./helpers/sentry');
const showFatalError = require('./helpers-html/show-fatal-error');
const LangSwitcher = require('./view-html/lang-switcher');
const { disableContextMenuOnLongTouch } = require('./helpers-html/disable-context-menu-touch');
const loadTextures = require('./helpers-pixi/loadTextures');

async function runExhibit(initCallback) {
  try {
    const qs = new URLSearchParams(window.location.search);

    const sentryDSN = qs.get('sentry-dsn');
    let sentryInitialized = false;
    if (sentryDSN) {
      sentryInitialized = !!initSentry(sentryDSN);
    }

    const cfgLoader = new CfgLoader(CfgReaderFetch, yaml.load);
    const config = await cfgLoader.load([
      'config/tiles.yml',
      'config/robot.yml',
      'config/items.yml',
      'config/ui.yml',
      'config/i18n.yml',
      'config/exhibit.yml',
      'config/default-settings.yml',
      'settings-exhibit.yml',
    ]).catch((err) => {
      throw new Error(`Error loading configuration: ${err.message}`);
    });

    if (!sentryInitialized && config?.sentry?.dsn) {
      sentryInitialized = !!initSentry(config.sentry.dsn);
    }

    const language = qs.get('lang') || config.sideBySideTranslation || config.defaultLanguage || 'en';
    await I18n.init(config, language)
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

    initCallback(config, textures);

    // Refresh language
    I18n.refresh();

    const container = $('[data-component=rl2-exhibit]');
    const langSwitcherContainer = container?.find('#lang-switcher-container');
    if (langSwitcherContainer.length && config.showLanguageSwitcher !== false) {
      // eslint-disable-next-line no-unused-vars
      const langSwitcher = new LangSwitcher(
        container.find('#lang-switcher-container')[0],
        { languages: config.languages },
        (code) => {
          I18n.setLanguage(code);
          langSwitcher.setActiveLanguage(code);
        }
      );
      langSwitcher.setActiveLanguage(I18n.getLanguage());
    }

    disableContextMenuOnLongTouch();
  } catch (err) {
    showFatalError(err.message, err);
    console.error(err);
  }
}

module.exports = runExhibit;
