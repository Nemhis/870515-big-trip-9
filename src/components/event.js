import {toShortISO, pad, HOURS_PER_DAY, MINUTE_PER_HOUR, SECONDS_PER_MINUTE} from '../date.js';

export const getEventTemplate = ({type, from, to, cost, options}) =>
  `<li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">Taxi to airport</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="${toShortISO(new Date(from))}">
                          ${(new Date(from)).getHours()}:${(new Date(from)).getMinutes()}
                        </time>
                        &mdash;
                        <time class="event__end-time" datetime="${toShortISO(new Date(to))}">
                          ${(new Date(to)).getHours()}:${(new Date(to)).getMinutes()}
                        </time>
                      </p>
                      <p class="event__duration">${formatDateDiff(from, to)}</p>
                    </div>

                    <p class="event__price">
                      &euro;&nbsp;<span class="event__price-value">${cost}</span>
                    </p>

                    <h4 class="visually-hidden">Offers:</h4>
                    
                    ${options.length ? `<ul class="event__selected-offers">
                      ${options.map((option) => `<li class="event__offer">
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

/**
 * @param {int} from
 * @param {int} to
 *
 * @returns {string}
 */
const formatDateDiff = (from, to) => {
  const [days, hours, minutes] = getTimeDiff(from, to);
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
};

/**
 * @param {int} from
 * @param {int} to
 *
 * @returns {int[]}
 */
const getTimeDiff = (from, to) => {
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
};
