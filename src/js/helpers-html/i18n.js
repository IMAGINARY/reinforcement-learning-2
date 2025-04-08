/* globals IMAGINARY */
// noinspection JSUnresolvedReference

let lang = null;

function getLanguage() {
  return lang;
}

function setLanguage(code) {
  lang = code;
  $('[data-i18n-text]').each((i, element) => {
    $(element).empty().append(
      [lang].flat(1).map((l, j) => (
        $('<span></span>')
          .addClass(['i18n-text', `i18n-text-${j === 0 ? 'primary' : 'secondary'}`, `i18n-text-${l}`])
          .html(
            IMAGINARY.i18n.t($(element).data('i18n-text'), l)
          )
      ))
    );
  });
}

function init(config, initialLanguage) {
  lang = initialLanguage || 'en';
  return IMAGINARY.i18n.init({
    queryStringVariable: 'lang',
    translationsDirectory: 'tr',
    defaultLanguage: 'en',
  })
    .then(() => {
      const languages = Object.keys(config.languages);
      return Promise.all(languages.map((code) => IMAGINARY.i18n.loadLang(code)));
    })
    .then(() => setLanguage(initialLanguage));
}

function refresh() {
  setLanguage(getLanguage());
}

module.exports = {
  init,
  getLanguage,
  setLanguage,
  refresh,
};
