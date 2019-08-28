import {eventTypes, allCities} from "../data.js";
import {toSlashDate, toShortTime} from "../date.js";

export const getEventEditorTemplate = ({type, from, to, cost, city}) =>
  `<form class="trip-events__item  event  event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
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
                <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
                <datalist id="destination-list-1">
                  ${Array.from(allCities).map((cityName) => `<option value="${cityName}"></option>`)}
                </datalist>
              </div>

              <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-1">
                  From
                </label>
                <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${toSlashDate(new Date(from))} ${toShortTime(new Date(from))}">
                &mdash;
                <label class="visually-hidden" for="event-end-time-1">
                  To
                </label>
                <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${toSlashDate(new Date(to))} ${toShortTime(new Date(to))}">
              </div>

              <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-1">
                  <span class="visually-hidden">Price</span>
                  &euro;
                </label>
                <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Cancel</button>
            </header>
          </form>`;
