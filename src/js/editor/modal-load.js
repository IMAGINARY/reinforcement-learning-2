const Modal = require('../modal.js');
const CityBrowser = require('./maze-browser.js');

class ModalLoad extends Modal {
  constructor(config, mazeStore) {
    super({
      title: 'Load maze',
      size: 'lg',
    });

    this.$browserContainer = $('<div></div>')
      .appendTo(this.$body);
    this.browser = new CityBrowser(this.$browserContainer, config, mazeStore);

    // noinspection JSUnusedGlobalSymbols
    this.$cancelButton = $('<button></button>')
      .addClass(['btn', 'btn-secondary'])
      .text('Cancel')
      .on('click', () => {
        this.hide(null);
      })
      .appendTo(this.$footer);

    // noinspection JSUnusedGlobalSymbols
    this.$loadButton = $('<button></button>')
      .addClass(['btn', 'btn-primary'])
      .text('Load')
      .on('click', () => {
        try {
          this.hide(this.browser.selectedData);
        } catch (err) {
          this.showError(err.message);
        }
      })
      .appendTo(this.$footer);
  }

  showError(errorText) {
    this.$errorText.html(errorText);
    this.$errorText.show();
  }
}

module.exports = ModalLoad;
