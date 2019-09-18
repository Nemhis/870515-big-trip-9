import {toShortISO, pad, HOURS_PER_DAY, MINUTE_PER_HOUR, SECONDS_PER_MINUTE} from '../date.js';
import AbstractComponent from "./abstract-component";
import {getEventPreposition} from "../data";

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
    const minuteDivider = 1000 * SECONDS_PER_MINUTE;
    const hourDivider = minuteDivider * MINUTE_PER_HOUR;
    const dayDivider = hourDivider * HOURS_PER_DAY;

    const diff = to - from;
    const days = Math.floor(diff / dayDivider);
    let hours = Math.floor(diff / hourDivider);
    let minutes = Math.floor(diff / minuteDivider);

    if (hours > HOURS_PER_DAY) {
      hours = hours - (days * HOURS_PER_DAY);
    }

    if (minutes > MINUTE_PER_HOUR) {
      minutes = minutes - ((days * HOURS_PER_DAY * MINUTE_PER_HOUR) + (hours * MINUTE_PER_HOUR));
    }

    return [days, hours, minutes];
  }

  /**
   * @returns {string}
   * @private
   */
  _getEventTitle()
  {
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
                        <time class="event__start-time" datetime="${toShortISO(this._from)}">
                          ${this._from.getHours()}:${this._from.getMinutes()}
                        </time>
                        &mdash;
                        <time class="event__end-time" datetime="${toShortISO(this._to)}">
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
                      ${this._options.map((option) => `<li class="event__offer">
                          <span class="event__offer-title">${option.title}</span>
                          &plus;
                          &euro;&nbsp;<span class="event__offer-price">${option.cost}</span>
                         </li>`).join(``)}
                      </ul>` : ``}
                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </div>
                </li>`;
  }
}
