import AbstractComponent from "./abstract-component";

const ACTIVE_ITEM_CLASS = `trip-tabs__btn--active`;

export default class Menu extends AbstractComponent {
  constructor(menuItems, activeMenuItem, onMenuChange) {
    super();
    this._menuItems = menuItems;
    this._activeMenuItem = activeMenuItem;
    this._onMenuChange = onMenuChange;
    this._activeMenuEl = this.getElement().querySelector(`.trip-tabs__btn--active`);

    this.getElement().addEventListener(`click`, (event) => {
      const element = event.target;

      if (element.tagName !== `A`) {
        return;
      }

      event.preventDefault();
      this._activeMenuEl.classList.remove(ACTIVE_ITEM_CLASS);
      this._activeMenuEl = element;
      this._activeMenuEl.classList.add(ACTIVE_ITEM_CLASS);
      this._onMenuChange(element.getAttribute(`href`));
    });
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${Array.from(this._menuItems).map((menuItem) => `<a class="trip-tabs__btn ${this._activeMenuItem === menuItem ? ACTIVE_ITEM_CLASS : ``}" href="${menuItem}">${menuItem}</a>`).join(``)}
            </nav>`;
  }
}
