import Filter from "../components/filter";
import {hideVisually, Position, render, showVisually} from "../utils";
import {FilterItem} from "../data";

export default class FilterController {
  constructor(container, events, onFilterChange) {
    this._container = container;
    this._events = events;
    this._onFilterChange = onFilterChange;
    const [defaultFilter] = Array.from(FilterItem);
    this._filter = new Filter(FilterItem, defaultFilter);

    this._init();
  }

  setEvents(events) {
    this._events = events;
    const futureEl = this._filter.getElement().querySelector(`.wrapper-future`);
    const pastEl = this._filter.getElement().querySelector(`.wrapper-past`);

    if (this._events.some(FilterController._eventInFuture)) {
      showVisually(futureEl);
    } else {
      hideVisually(futureEl);
    }

    if (this._events.some(FilterController._eventInPast)) {
      showVisually(pastEl);
    } else {
      hideVisually(pastEl);
    }
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
    return events.filter(FilterController._eventInFuture);
  }

  _filterByPast(events) {
    return events.filter(FilterController._eventInPast);
  }

  static _eventInFuture(event) {
    return event.from.getTime() > Date.now();
  }

  static _eventInPast(event) {
    return event.to.getTime() < Date.now();
  }
}
