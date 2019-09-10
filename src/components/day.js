import {toShortDate, SHORT_MONTHS} from '../date.js';
import AbstractComponent from "./abstract-component";

export default class Day extends AbstractComponent {
  constructor({day, number, events}) {
    super();
    this._date = new Date(day);
    this._number = number;
    this._events = events;
  }

  getEvents() {
    return this._events;
  }

  getTemplate() {
    return `<li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">${this._number}</span>
                <time class="day__date" datetime="${toShortDate(this._date)}">${SHORT_MONTHS[this._date.getMonth()]} ${this._date.getDate()}</time>
              </div>
              <ul class="trip-events__list"></ul>
            </li>`;
  }
}
