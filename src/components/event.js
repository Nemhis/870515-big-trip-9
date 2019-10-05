import moment from 'moment';

import AbstractComponent from "./abstract-component";

import {SHORT_ISO_FORMAT, pad} from '../utils';
import {getEventPreposition} from "../data";

const OPTIONS_TO_SHOW_LENGTH = 3;

export default class Event extends AbstractComponent {
  constructor({type = `sightseeing`, destination = ``, from = new Date(), to = new Date(), cost = 0, options = []}) {
    super();
    this._type = type;
    this._destination = destination;
    this._from = from;
    this._to = to;
    this._cost = cost;
    this._options = options;
  }

  /**
   * @param {int} from
   * @param {int} to
   *
   * @return {string}
   */
  _formatDateDiff(from, to) {
    const [days, hours, minutes] = this._getTimeDiff(from, to);
    const times = [];

    if (days !== 0) {
      times.push(pad(days) + `D`);
    }

    if (hours !== 0) {
      times.push(pad(hours) + `H`);
    }

    if (minutes !== 0) {
      times.push(pad(minutes) + `M`);
    }

    return times.join(` `);
  }

  /**
   * @param {int} from
   * @param {int} to
   *
   * @return {int[]}
   */
  _getTimeDiff(from, to) {
    const fromMoment = moment(from);
    const toMoment = moment(to);

    const days = toMoment.diff(fromMoment, `days`);
    toMoment.subtract(days, `days`);
    let hours = toMoment.diff(fromMoment, `hours`);
    toMoment.subtract(hours, `hours`);
    let minutes = toMoment.diff(fromMoment, `minutes`);

    return [days, hours, minutes];
  }

  /**
   * @private
   * @return {string}
   */
  _getEventTitle() {
    return `${this._type} ${getEventPreposition(this._type)} ${this._destination}`;
  }

  getTemplate() {
    return `<li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type}.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">${this._getEventTitle()}</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="${moment(this._from).format(SHORT_ISO_FORMAT)}">
                          ${this._from.getHours()}:${this._from.getMinutes()}
                        </time>
                        &mdash;
                        <time class="event__end-time" datetime="${moment(this._to).format(SHORT_ISO_FORMAT)}">
                          ${this._to.getHours()}:${this._to.getMinutes()}
                        </time>
                      </p>
                      <p class="event__duration">${this._formatDateDiff(this._from.getTime(), this._to.getTime())}</p>
                    </div>

                    <p class="event__price">
                      &euro;&nbsp;<span class="event__price-value">${this._cost}</span>
                    </p>

                    <h4 class="visually-hidden">Offers:</h4>
                    
                    ${this._options.length ? `<ul class="event__selected-offers">
                      ${this._options.slice(0, OPTIONS_TO_SHOW_LENGTH).map((option) => `${option.isActive ?
    `<li class="event__offer">
                            <span class="event__offer-title">${option.title}</span>
                            &plus;
                            &euro;&nbsp;<span class="event__offer-price">${option.cost}</span>
                          </li>` : ``}`).join(``)}
                      </ul>` : ``}
                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </div>
                </li>`;
  }
}
