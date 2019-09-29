import Filter from "../components/filter";
import {Position, render} from "../utils";
import {filterItems} from "../data";

export default class FilterController {
  constructor(container, events, onFilterChange) {
    this._container = container;
    this._events = events;
    this._onFilterChange = onFilterChange;
    this._filter = new Filter(filterItems);

    this._init();
  }

  _init() {
    render(this._container, this._filter.getElement(), Position.BEFOREEND);
  }

  setEvents(events) {
    this._events = events;
  }
}
