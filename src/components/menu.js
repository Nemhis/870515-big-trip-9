import {createElement} from '../utils.js';

export default class Menu {
  constructor(menuItems) {
    this._menuItems = menuItems;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${Array.from(this._menuItems).map((menuItem) => `<a class="trip-tabs__btn" href="#">${menuItem}</a>`).join(``)}
            </nav>`;
  }
}
