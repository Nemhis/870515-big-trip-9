import {eventTypes, allCities} from "../data.js";
import {toSlashDate, toShortTime} from "../date.js";

import {createElement} from '../utils.js';

export default class DaysList {
  constructor({type, from, to, cost, city}) {
    this._type = type;
    this._from = from;
    this._to = to;
    this._cost = cost;
    this._city = city;
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
    return `<form class="trip-events__item  event  event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type}.png" alt="Event type icon">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                <div class="event__type-list">
                  ${Object.keys(eventTypes).map((eventGroupName) =>
    `<fieldset class="event__type-group">
                    <legend class="visually-hidden">${eventGroupName}</legend>
                    ${eventTypes[eventGroupName].map((eventName) =>
    `<div class="event__type-item">
                      <input id="event-type-${eventName}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventName}">
                      <label class="event__type-label  event__type-label--${eventName}" for="event-type-${eventName}-1">${eventName}</label>
                    </div>`
  ).join(``)}
                  </fieldset>`).join(``)}
                </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-1">
                  Sightseeing at
                </label>
                <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._city}" list="destination-list-1">
                <datalist id="destination-list-1">
                  ${Array.from(allCities).map((cityName) => `<option value="${cityName}"></option>`)}
                </datalist>
              </div>

              <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-1">
                  From
                </label>
                <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${toSlashDate(this._from)} ${toShortTime(this._from)}">
                &mdash;
                <label class="visually-hidden" for="event-end-time-1">
                  To
                </label>
                <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${toSlashDate(this._to)} ${toShortTime(this._to)}">
              </div>

              <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-1">
                  <span class="visually-hidden">Price</span>
                  &euro;
                </label>
                <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._cost}">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Cancel</button>
            </header>
          </form>`;
  }
}
