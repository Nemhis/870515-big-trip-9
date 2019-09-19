import AbstractComponent from "./abstract-component";

import {eventTypes, allCities, getEventPreposition} from "../data.js";
import {toSlashDate, toShortTime} from "../date.js";

export default class EventEditor extends AbstractComponent {
  constructor({
                type = `sightseeing`,
                from = new Date(),
                to = new Date(),
                cost = 0,
                destination = ``,
                options = [],
                photos = [],
                description = ``
              }) {
    super();
    this._type = type;
    this._from = from;
    this._to = to;
    this._cost = cost;
    this._destination = destination;
    this._options = options;
    this._photos = photos;
    this._description = description;

    this._addEventListeners();
  }

  _getDestinationPrefix() {
    return `${this._type} ${getEventPreposition(this._type)}`;
  }

  _addEventListeners() {
    const el = this.getElement();

    //el.querySelector();
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
                      <input id="event-type-${eventName}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventName}" ${this._type === eventName ? `checked` : ``}>
                      <label class="event__type-label  event__type-label--${eventName}" for="event-type-${eventName}-1">${eventName}</label>
                    </div>`
      ).join(``)}
                  </fieldset>`).join(``)}
                </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-1">
                  ${this._getDestinationPrefix()}
                </label>
                <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._destination}" list="destination-list-1">
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
                <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._cost === 0 ? `` : this._cost}">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Cancel</button>
            </header>
            
            ${(this._options.length || this._destination) ? `
              <section class="event__details">
                ${this._options.length ? `
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                      <div class="event__available-offers">
                        ${this._options.map((option) => `
                          <div class="event__offer-selector">
                            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${option.type}-1" type="checkbox" name="event-offer-${option.type}" ${option.isActive ? `checked` : ``}>
                            <label class="event__offer-label" for="event-offer-${option.type}-1">
                              <span class="event__offer-title">${option.title}</span>
                                &plus;
                                &euro;&nbsp;<span class="event__offer-price">${option.cost}</span>
                            </label>
                          </div>
                        `).join(``)}  
                      </div>
                  </section>
                ` : ``}
                
                ${this._description ? `
                  <section class="event__section  event__section--destination">
                          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                          <p class="event__destination-description">${this._description}</p>
                    ${this._photos.length ? `
                      <div class="event__photos-container">
                        <div class="event__photos-tape">
                          ${this._photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join(``)}
                        </div>
                      </div>
                    ` : ``}
                  </section>
                ` : ``}
              </section>
            ` : ``}
          </form>`;
  }


}
