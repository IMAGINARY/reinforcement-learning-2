const Modal = require('../modal.js');
const MazeBrowser = require('./maze-browser.js');

class ModalSave extends Modal {
  constructor(config, mazeStore) {
    super({
      title: 'Save maze',
      size: 'lg',
    });

    this.$browserContainer = $('<div></div>')
      .appendTo(this.$body);
    this.browser = new MazeBrowser(this.$browserContainer, config, mazeStore, true);

    // noinspection JSUnusedGlobalSymbols
    this.$cancelButton = $('<button></button>')
      .addClass(['btn', 'btn-secondary'])
      .text('Cancel')
      .on('click', () => {
        this.hide(null);
      })
      .appendTo(this.$footer);

    // noinspection JSUnusedGlobalSymbols
    this.$saveButton = $('<button></button>')
      .addClass(['btn', 'btn-primary'])
      .text('Save')
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

module.exports = ModalSave;
