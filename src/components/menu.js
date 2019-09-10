import AbstractComponent from "./abstract-component";

export default class Menu extends AbstractComponent {
  constructor(menuItems) {
    super();
    this._menuItems = menuItems;
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${Array.from(this._menuItems).map((menuItem) => `<a class="trip-tabs__btn" href="#">${menuItem}</a>`).join(``)}
            </nav>`;
  }
}
