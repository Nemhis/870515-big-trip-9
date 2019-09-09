import {SHORT_MONTHS} from '../date.js';
import {createElement} from '../utils.js';

export default class TripInfo {
  constructor(events) {
    this._events = events;
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

  _getCitiesInfo(events) {
    let cities = events.map((event) => event.city);
    let format = ``;

    if (cities.length <= 3) {
      format = cities.join(` &mdash; `);
    } else {
      format = `${cities[0]} &mdash; ... &mdash; ${cities[cities.length - 1]}`;
    }

    return format;
  }

  _getDateInfo(events) {
    const from = new Date(events[0].from);
    let to = new Date(events[events.length - 1].to);

    if (from.getTime() === to.getTime()) {
      to = null;
    }

    let format = `${SHORT_MONTHS[from.getMonth()]} ${from.getDate()}`;

    if (to) {
      format += ` &mdash; ${SHORT_MONTHS[to.getMonth()]} ${to.getDate()}`;
    }

    return format;
  }

  getTemplate() {
    return `<div class="trip-info__main">
              <h1 class="trip-info__title">${this._getCitiesInfo(this._events)}</h1>

              <p class="trip-info__dates">${this._getDateInfo(this._events)}</p>
            </div>`;
  }
}
