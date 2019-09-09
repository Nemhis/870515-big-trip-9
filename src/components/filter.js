import {createElement} from '../utils.js';

export default class Filter {
  constructor(filters) {
    this._filters = filters;
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
    return `<form class="trip-filters" action="#" method="get">
    ${Array.from(this._filters).map((filterItem) => `
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterItem}">
      <label class="trip-filters__filter-label" for="filter-everything">${filterItem}</label>
    </div>
    `).join(``)}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;
  }
}
