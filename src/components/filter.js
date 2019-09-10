import AbstractComponent from "./abstract-component";

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
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
