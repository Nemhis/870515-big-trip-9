import AbstractComponent from "./abstract-component";

export default class Filter extends AbstractComponent {
  constructor(filters, defaultFilter) {
    super();
    this._filters = filters;
    this._defaultFilter = defaultFilter;
  }

  getTemplate() {
    return `<form class="trip-filters" action="#" method="get">
    ${Array.from(this._filters).map((filterItem) => `
    <div class="trip-filters__filter wrapper-${filterItem}">
      <input id="filter-${filterItem}" 
        class="trip-filters__filter-input visually-hidden" 
        data-filter-name="${filterItem}" 
        type="radio" 
        name="trip-filter" 
        value="${filterItem}"
        ${filterItem === this._defaultFilter ? `checked` : ``}
        >
        
      <label class="trip-filters__filter-label" for="filter-${filterItem}">${filterItem}</label>
    </div>
    `).join(``)}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;
  }
}
