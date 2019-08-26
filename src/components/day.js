import {toShortDate, SHORT_MONTHS} from '../date.js';

export const getDayTemplate = (day, index, dayEventsList) =>
  `<li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">${index + 1}</span>
                <time class="day__date" datetime="${toShortDate(new Date(day))}">${SHORT_MONTHS[(new Date(day)).getMonth() + 1]} ${(new Date(day)).getDate()}</time>
              </div>
              ${dayEventsList}
            </li>`;

