import moment from "moment";

import {SHORT_MONTHS, SHORT_DATE_FORMAT} from '../utils';
import AbstractComponent from "./abstract-component";

export default class Day extends AbstractComponent {
  constructor({day, number, events}) {
    super();
    this._date = day ? new Date(day) : null;
    this._number = number;
    this._events = events;
  }

  getEvents() {
    return this._events;
  }

  getTemplate() {
    return `<li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">${this._date ? this._number : ``}</span>
                ${!this._date ? `` : `<time class="day__date" datetime="${moment(this._date).format(SHORT_DATE_FORMAT)}">${SHORT_MONTHS[this._date.getMonth()]} ${this._date.getDate()}</time>`}
              </div>
              <ul class="trip-events__list"></ul>
            </li>`;
  }
}
