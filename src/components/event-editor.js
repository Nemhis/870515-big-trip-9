import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import moment from "moment";
import {debounce} from 'lodash';

import AbstractComponent from "./abstract-component";

import {renderString, SHORT_ISO_FORMAT, StringPosition, unrender} from '../utils';
import {EventType, getEventPreposition} from "../data";

const CHECKED_VALUE = `on`;

export const Mode = {
  EDIT: 1,
  CREATING: 2,
};

export default class EventEditor extends AbstractComponent {
  constructor({type = `sightseeing`, from = new Date(), to = new Date(), cost = 0, destination = ``, options = [], photos = [], description = ``, isFavorite = false}, mode) {
    super();
    this._type = type;
    this._from = from;
    this._to = to;
    this._cost = cost;
    this._destination = destination;
    this._options = options;
    this._photos = photos;
    this._description = description;
    this._isFavorite = isFavorite;

    this._mode = mode;
    this._allDestinations = null;
    this._allOptions = null;

    this._fromFlatpickr = null;
    this._toFlatpickr = null;

    this._addEventListeners();
  }

  setAllOptions(options) {
    this._allOptions = options;
    this.getElement().querySelector(`.event__type-toggle`).removeAttribute(`disabled`);
  }

  getDescription() {
    return this._description;
  }

  getOptions() {
    return this._options;
  }

  getPhotos() {
    return this._photos;
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
          const optionsByType = this._allOptions.get(this._type);
          this._options = optionsByType.map((option) => Object.assign({}, option));
          label.append(this._getDestinationPrefix());
          this
            .getElement()
            .querySelector(`.event__type-icon`)
            .setAttribute(`src`, this._getTypeImgSrc(this._type));
          this._reRenderDetails();
        }
      });
    });

    // Description
    el.querySelector(`.event__input--destination`).addEventListener(`change`, (event) => {
      const input = event.target;
      const destination = this._allDestinations.get(input.value);

      if (destination) {
        this._description = destination.description || ``;
        this._photos = destination.photos || [];
      } else {
        this._description = ``;
        this._photos = [];
      }

      this._reRenderDetails();
    });

    const favoriteCheckbox = el.querySelector(`.event__favorite-checkbox`);

    if (favoriteCheckbox) {
      const debounced = debounce((checkbox) => {
        checkbox.checked = !checkbox.checked;
        checkbox.value = checkbox.checked ? CHECKED_VALUE : null;
      }, 250);

      favoriteCheckbox.addEventListener(`click`, (event) => {
        event.preventDefault();
        debounced(event.target);
      });
    }
  }

  _reRenderDetails() {
    const detailsEl = this.getElement().querySelector(`.event__details`);
    unrender(detailsEl);

    renderString(this.getElement(), this._getDetailsTemplate(), StringPosition.BEFOREEND);
  }

  _getTypeImgSrc(type) {
    return `img/icons/${type}.png`;
  }

  _getDetailsTemplate() {
    return `<section class="event__details">
      ${this._options.length ? `<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${this._options.map((option, index) => `<div class="event__offer-selector">
                  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${option.type}-${index}" type="checkbox" 
                    name="event-offer-${option.type}-${index}" ${option.isActive ? `checked` : ``}>
                    <label class="event__offer-label" for="event-offer-${option.type}-${index}">
                      <span class="event__offer-title">${option.title}</span>
                        &plus;
                        &euro;&nbsp;<span class="event__offer-price">${option.cost}
                      </span>
                    </label>
                  </div>`).join(``)}
                </div>
          </section>` : ``}
                
      ${this._description ? `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${this._description}</p>
              
          ${this._photos.length ? `
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${this._photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join(``)}
              </div>
            </div>` : ``}
        </section>` : ``}
      </section>`;
  }

  renderDestinationList(destinations) {
    this._allDestinations = destinations;

    const destinationInput = this.getElement().querySelector(`.event__input--destination`);
    const template = `<datalist id="destination-list-1">
        ${Array.from(destinations).map(([cityName]) => `<option value="${cityName}"></option>`).join(``)}
      </datalist>`;

    renderString(destinationInput, template, StringPosition.AFTER);
    destinationInput.removeAttribute(`disabled`);
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
      'altInput': true,
      'enableTime': true,
      'altFormat': `d.m.Y H:i`,
      'dateFormat': `Y-m-dTH:i`,
      'time_24hr': true,
    };

    this._fromFlatpickr = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        Object.assign({}, defaultOptions, {
          defaultDate: this._from,
          maxDate: this._to,
        }));

    this._toFlatpickr = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        Object.assign({}, defaultOptions, {
          defaultDate: this._to,
          minDate: this._from,
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

  getTemplate() {
    return `<form class="trip-events__item  event  event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="${this._getTypeImgSrc(this._type)}" alt="Event type icon">
                </label>
                <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox" disabled>

                <div class="event__type-list">
                  ${Object.keys(EventType).map((eventGroupName) =>
    `<fieldset class="event__type-group">
                    <legend class="visually-hidden">${eventGroupName}</legend>
                    ${EventType[eventGroupName].map((eventName) =>
    `<div class="event__type-item">
                      <input id="event-type-${eventName}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventName}" ${this._type === eventName ? `checked` : ``}>
                      <label class="event__type-label  event__type-label--${eventName}" for="event-type-${eventName}-1">${eventName}</label>
                    </div>`).join(``)}
                  </fieldset>`).join(``)}
                </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-1">
                  ${this._getDestinationPrefix()}
                </label>
                <input class="event__input  event__input--destination" 
                    id="event-destination-1" 
                    type="text" 
                    name="event-destination" 
                    value="${this._destination}" 
                    list="destination-list-1"
                    disabled
                  >
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
              <button class="event__reset-btn" type="reset">${this._mode === Mode.CREATING ? `Cancel` : `Delete`}</button>
              
              ${this._mode === Mode.EDIT ? `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._isFavorite ? `checked` : ``}>
                <label class="event__favorite-btn" for="event-favorite-1">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/> </svg>
                </label>` : ``}
              
              ${this._mode === Mode.EDIT ? `<button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Close event</span>
                </button>` : ``}
            </header>
            
            ${(this._options.length || this._description) ? this._getDetailsTemplate() : ``}
          </form>`;
  }
}
