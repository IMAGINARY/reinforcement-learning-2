class LangSwitcher {
  constructor(container, config, langChangeCallback) {
    this.menuVisible = false;
    this.container = container;
    this.config = config;
    this.langChangeCallback = langChangeCallback;

    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.classList.add('lang-switcher');

    this.trigger = document.createElement('button');
    this.trigger.setAttribute('type', 'button');
    this.trigger.classList.add('lang-switcher-trigger');
    this.element.appendChild(this.trigger);

    const mask = document.createElement('div');
    mask.classList.add('lang-switcher-menu-mask');
    this.element.appendChild(mask);

    this.menu = document.createElement('ul');
    this.menu.classList.add('lang-switcher-menu');
    mask.appendChild(this.menu);

    Object.entries(this.config.languages).forEach(([code, name]) => {
      const item = document.createElement(('li'));
      const link = document.createElement('button');
      link.setAttribute('type', 'button');
      link.innerText = name;
      link.addEventListener('pointerdown', (ev) => {
        this.langChangeCallback(code);
        ev.preventDefault();
      });
      item.appendChild(link);
      this.menu.appendChild(item);
    });

    this.container.appendChild(this.element);

    this.menu.style.bottom = `${this.menu.clientHeight * -1 - 10}px`;

    window.document.addEventListener('pointerdown', (ev) => {
      if (this.menuVisible) {
        this.hideMenu();
      }
    });
    this.trigger.addEventListener('pointerdown', (ev) => {
      if (!this.menuVisible) {
        this.showMenu();
        ev.stopPropagation();
      }
    });
  }

  showMenu() {
    this.menuVisible = true;
    this.menu.classList.add('visible');
  }

  hideMenu() {
    this.menuVisible = false;
    this.menu.classList.remove('visible');
  }
}

module.exports = LangSwitcher;
