import AbstractComponent from "./abstract-component";

import {SHORT_MONTHS} from '../date.js';

export default class TripInfo extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  _getDestinationsInfo(events) {
    let destinations = events.map((event) => event.destination);
    let format = ``;

    if (destinations.length <= 3) {
      format = destinations.join(` &mdash; `);
    } else {
      format = `${destinations[0]} &mdash; ... &mdash; ${destinations[destinations.length - 1]}`;
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
              <h1 class="trip-info__title">${this._getDestinationsInfo(this._events)}</h1>

              <p class="trip-info__dates">${this._getDateInfo(this._events)}</p>
            </div>`;
  }
}
