import {toShortDate, SHORT_MONTHS} from '../date.js';
import {createElement} from '../utils.js';

export default class Day {
  constructor({day, number, events}) {
    this._date = new Date(day);
    this._number = number;
    this._events = events;
  }

  getDate() {
    return this._date;
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
    return `<li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">${this._number}</span>
                <time class="day__date" datetime="${toShortDate(this._date)}">${SHORT_MONTHS[this._date.getMonth() + 1]} ${this._date.getDate()}</time>
              </div>
              ${this._events.length ? `<ul class="trip-events__list">
  ${this._events}
  </ul>` : ``}
            </li>`;
  }
}
