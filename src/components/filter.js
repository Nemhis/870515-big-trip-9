export const getFilterTemplate = (filterItems) =>
  `<form class="trip-filters" action="#" method="get">
    ${Array.from(filterItems).map((filterItem) => `
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterItem}">
      <label class="trip-filters__filter-label" for="filter-everything">${filterItem}</label>
    </div>
    `).join(``)}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;
