import Sorter from "../components/sorter";

import {Position, render} from "../utils";
import {calculateEventCost} from "../data";

export default class SortController {
  constructor(container, events, onSortChanged) {
    this._container = container;
    this._events = events;
    this._onSortChanged = onSortChanged;
    this._currentSort = `sort-default`;

    this._sorter = new Sorter();

    this._init();
  }

  _init() {
    this._sorter.getElement()
      .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  renderSort() {
    render(this._container, this._sorter.getElement(), Position.BEFOREEND);
  }

  /**
   * @param {Event} evt
   *
   * @private
   */
  _onSortLinkClick(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }

    this._onSortChanged(this.sort(this._events, evt.target.dataset.sort));
  }

  /**
   * Сортировка точек в соответствии с типом сортировки
   *
   * @param {array} events
   * @param {string} sortType
   *
   * @return {array}
   *
   * @private
   */
  sort(events, sortType) {
    if (sortType) {
      this._currentSort = sortType;
    }

    this._events = events;
    const dayColumns = this._sorter.getElement().querySelector(`.trip-sort__item--day`);

    let showDaysColumn;
    let days = [];

    switch (this._currentSort) {
      case `sort-price`:
        days = this._sortByPrice(events);
        showDaysColumn = false;
        break;
      case `sort-time`:
        days = this._sortByTime(events);
        showDaysColumn = false;
        break;
      case `sort-default`:
        days = this._defaultSort(events);
        showDaysColumn = true;
        break;
    }

    if (dayColumns.firstChild) {
      dayColumns.firstChild.remove();
    }

    if (showDaysColumn) {
      dayColumns.append(`DAY`);
    }

    return days;
  }

  /**
   * Сортировка по умолчанию:
   *
   * Группировка по дням в хронологическом порядке,
   * день события, это день в котором оно начинается
   *
   * @param {array} events
   *
   * @return {{date: string, events:*}[]}
   *
   * @private
   */
  _defaultSort(events) {
    const groupedEvents = {};

    events.forEach((event) => {
      const dateString = event.from.toDateString();

      if (!Array.isArray(groupedEvents[dateString])) {
        groupedEvents[dateString] = [];
      }

      groupedEvents[dateString].push(event);
    });

    let groupedDays = Object.keys(groupedEvents).map((date) => {
      const dayEvents = groupedEvents[date];

      return {date, events: dayEvents};
    });

    groupedDays.sort((dayA, dayB) => ((new Date(dayA.date)).getTime() - (new Date(dayB.date)).getTime()));

    return groupedDays;
  }

  /**
   * Сортировка по цене
   *
   * @param {array} events
   *
   * @return {{date: null, events: *}[]}
   *
   * @private
   */
  _sortByPrice(events) {
    events.sort((eventA, eventB) => calculateEventCost(eventB) - calculateEventCost(eventA));

    return [{
      date: null,
      events
    }];
  }

  /**
   * Сортировка по длительности события
   *
   * @param {array} events
   *
   * @return {{date: null, events: *}[]}
   *
   * @private
   */
  _sortByTime(events) {
    events.sort((eventA, eventB) => (eventB.to - eventB.from) - (eventA.to - eventA.from));

    return [{
      date: null,
      events
    }];
  }
}
