/* globals IMAGINARY */

function getLanguage() {
  return IMAGINARY.i18n.getLang();
}

function setLanguage(code) {
  return IMAGINARY.i18n.setLang(code).then(() => {
    $('[data-i18n-text]').each((i, element) => {
      $(element).html(
        IMAGINARY.i18n.t($(element).data('i18n-text'))
      );
    });
  });
}

function init(config, initialLanguage) {
  return IMAGINARY.i18n.init({
    queryStringVariable: 'lang',
    translationsDirectory: 'tr',
    defaultLanguage: 'en',
  })
    .then(() => {
      const languages = Object.keys(config.languages);
      return Promise.all(languages.map(code => IMAGINARY.i18n.loadLang(code)));
    })
    .then(() => {
      return setLanguage(initialLanguage);
    });
}

module.exports = {
  init,
  getLanguage,
  setLanguage,
};
