export const getEventTemplate = ({type, city, photos, description, from, to, cost, options}) =>
  `<li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">Taxi to airport</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="2019-03-18T10:30">
                          ${(new Date(from)).getHours()}:${(new Date(from)).getMinutes()}
                        </time>
                        &mdash;
                        <time class="event__end-time" datetime="2019-03-18T11:00">
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

const formatDateDiff = (from, to) => {
  const minuteDivider = 1000 * 60;
  const hourDivider = minuteDivider * 60;
  const dayDivider = hourDivider * 24;

  const diff = to - from;
  const days = Math.floor(diff / dayDivider);
  const hours = Math.floor(diff / hourDivider);
  const minute = diff / minuteDivider;
  let times = [];

  if (days) {
    times.push(setZeroBefore(days) + `D`);
  }

  if (hours < 24) {
    times.push(setZeroBefore(hours) + `H`);
  }

  if (minute < 60) {
    times.push(setZeroBefore(minute) + `M`);
  }

  return times.join(` `);
};

const setZeroBefore = (digit) => digit < 10 ? `0` + digit : digit;
