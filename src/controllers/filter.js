import Filter from "../components/filter";
import {Position, render} from "../utils";
import {filterItems} from "../data";

export default class FilterController {
  constructor(container, events, onFilterChange) {
    this._container = container;
    this._events = events;
    this._onFilterChange = onFilterChange;
    const [defaultFilter] = Array.from(filterItems);
    this._filter = new Filter(filterItems, defaultFilter);

    this._init();
  }

  _init() {
    render(this._container, this._filter.getElement(), Position.BEFOREEND);

    this._filter.getElement().querySelectorAll(`.trip-filters__filter-input`).forEach((input) => {
      input.addEventListener(`change`, (event) => {
        const target = event.target;
        const filteredEvents = this._filterEvents(target.dataset.filterName, this._events);

        this._onFilterChange(filteredEvents);
      });
    });
  }

  setEvents(events) {
    this._events = events;
  }

  _filterEvents(filterType, events) {
    let filteredEvents = [];

    switch (filterType) {
      case `future`:
        filteredEvents = this._filterByFuture(events);
        break;
      case `past`:
        filteredEvents = this._filterByPast(events);
        break;
      case `everything`:
        filteredEvents = events;
        break;
    }

    return filteredEvents;
  }


  _filterByFuture(events) {
    const nowTimeStamp = Date.now();

    return events.filter((event) => {
      return event.from.getTime() > nowTimeStamp;
    });
  }

  _filterByPast(events) {
    const nowTimeStamp = Date.now();

    return events.filter((event) => {
      return event.to.getTime() < nowTimeStamp;
    });
  }
}
