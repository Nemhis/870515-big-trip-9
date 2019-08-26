import {SHORT_MONTHS} from '../date.js';

export const getDayTemplate = (day, index, dayEventsList) =>
  `<li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">${index + 1}</span>
                <time class="day__date" datetime="2019-03-18">${SHORT_MONTHS[(new Date(day)).getMonth() + 1]} ${(new Date(day)).getDate()}</time>
              </div>
              ${dayEventsList}
            </li>`;

