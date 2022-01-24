/* globals IMAGINARY */
require('../sass/default.scss');
require('../sass/exhibit.scss');
const yaml = require('js-yaml');
const CfgLoader = require('./cfg-loader/cfg-loader');
const CfgReaderFetch = require('./cfg-loader/cfg-reader-fetch');
const I18n = require('./exhibit/i18n');
const showFatalError = require('./aux/show-fatal-error');
const LangSwitcher = require('./lang-switcher');

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
  });
