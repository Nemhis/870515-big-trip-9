import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import moment from "moment";

import AbstractComponent from "./abstract-component";

import {SHORT_ISO_FORMAT} from '../utils';

import {
  eventTypes,
  allCities,
  getEventPreposition,
  getDestinationDescription,
  getOptionsByEventType,
  getDestionationPhotos
} from "../data";

export default class EventEditor extends AbstractComponent {
  constructor({type = `sightseeing`, from = new Date(), to = new Date(), cost = 0, destination = ``, options = [], photos = [], description = ``}) {
    super();
    this._type = type;
    this._from = from;
    this._to = to;
    this._cost = cost;
    this._destination = destination;
    this._options = options;
    this._photos = photos;
    this._description = description;

    this._fromFlatpickr = null;
    this._toFlatpickr = null;

    this._addEventListeners();
  }

  destroyDatePicker() {
    this._fromFlatpickr.destroy();
    this._toFlatpickr.destroy();

    // Flatpickr затирает value, поэтому обновляем его в ручную
    // @see https://github.com/flatpickr/flatpickr/issues/1641
    const fromEl = this.getElement().querySelector(`#event-start-time-1`);
    const toEl = this.getElement().querySelector(`#event-end-time-1`);

    fromEl.value = moment(this._from).format(SHORT_ISO_FORMAT);
    toEl.value = moment(this._to).format(SHORT_ISO_FORMAT);
  }

  initDatePicker() {
    const defaultOptions = {
      altInput: true,
      enableTime: true,
      altFormat: `d.m.Y H:i`,
      dateFormat: `Y-m-dTH:i`,
      time_24hr: true,
    };

    this._fromFlatpickr = flatpickr(
      this.getElement().querySelector(`#event-start-time-1`),
      Object.assign({}, defaultOptions, {
        defaultDate: this._from,
        minDate: new Date(),
        maxDate: this._to
      }));

    this._toFlatpickr = flatpickr(
      this.getElement().querySelector(`#event-end-time-1`),
      Object.assign({}, defaultOptions, {
        defaultDate: this._to,
        minDate: this._from
      }));

    this._fromFlatpickr.set(`onChange`, (selectedDates) => {
      [this._from] = selectedDates;
      this._toFlatpickr.set(`minDate`, this._from);
    });

    this._toFlatpickr.set(`onChange`, (selectedDates) => {
      [this._to] = selectedDates;
      this._fromFlatpickr.set(`maxDate`, this._to);
    });
  }

  _getDestinationPrefix() {
    return `${this._type} ${getEventPreposition(this._type)}`;
  }

  _addEventListeners() {
    const el = this.getElement();

    // Options
    Array.from(el.querySelectorAll(`.event__type-input`)).forEach((typeInput) => {
      typeInput.addEventListener(`change`, (event) => {
        const input = event.target;

        if (input.checked) {
          const label = document.querySelector(`.event__type-output`);

          if (label.firstChild) {
            label.firstChild.remove();
          }

          this._type = input.value;
          this._options = getOptionsByEventType(this._type);
          label.append(this._getDestinationPrefix());

          el.querySelector(`.event__available-offers`).remove();
          el.querySelector(`.event__section--offers`).insertAdjacentHTML(`beforeend`, this._getOptionsListTemplate());
        }
      });
    });

    // Description
    el.querySelector(`.event__input--destination`).addEventListener(`change`, (event) => {
      const input = event.target;
      this._description = getDestinationDescription(input.value);
      this._photos = getDestionationPhotos(input.value);
      const descriptionEl = el.querySelector(`.event__destination-description`);

      if (descriptionEl.firstChild) {
        descriptionEl.firstChild.remove();
      }

      descriptionEl.append(this._description);

      el.querySelector(`.event__photos-tape`).remove();
      el.querySelector(`.event__photos-container`).insertAdjacentHTML(`beforeend`, this._getPhotosListTemplate());
    });
  }

  _getOptionsListTemplate() {
    return `<div class="event__available-offers">
              ${this._options.map((option) =>
      `<div class="event__offer-selector">
                  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${option.type}-1" type="checkbox" name="event-offer-${option.type}" ${option.isActive ? `checked` : ``}>
                  <label class="event__offer-label" for="event-offer-${option.type}-1">
                    <span class="event__offer-title">${option.title}</span>
                      &plus;
                      &euro;&nbsp;<span class="event__offer-price">${option.cost}</span>
                  </label>
                </div>`).join(``)}
              </div>`;
  }

  _getPhotosListTemplate() {
    return `<div class="event__photos-tape">
              ${this._photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join(``)}
            </div>`;
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
                  ${Array.from(allCities).map((cityName) => `<option value="${cityName}"></option>`).join(``)}
                </datalist>
              </div>

              <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-1">
                  From
                </label>
                <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${moment(this._from).format(SHORT_ISO_FORMAT)}">
                &mdash;
                <label class="visually-hidden" for="event-end-time-1">
                  To
                </label>
                <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${moment(this._to).format(SHORT_ISO_FORMAT)}">
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
            
            ${(this._options.length || this._description) ? `
              <section class="event__details">
                ${this._options.length ? `
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                      ${this._getOptionsListTemplate()}
                  </section>
                ` : ``}
                
                ${this._description ? `
                  <section class="event__section  event__section--destination">
                          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                          <p class="event__destination-description">${this._description}</p>
                    ${this._photos.length ? `
                      <div class="event__photos-container">
                        ${this._getPhotosListTemplate()}
                      </div>
                    ` : ``}
                  </section>
                ` : ``}
              </section>
            ` : ``}
          </form>`;
  }


}
