export const getTripInfoTemplate = (events) =>
  `<div class="trip-info__main">
              <h1 class="trip-info__title">${getCitiesInfo(events)}</h1>

              <p class="trip-info__dates">${getDateInfo(events)}</p>
            </div>`;

const getCitiesInfo = (events) => {
  let cities = events.map((event) => event.city);
  let format = ``;

  if (cities.length <= 3) {
    format = cities.join(` &mdash; `);
  } else {
    format = `${cities[0]} &mdash; ... &mdash; ${cities[cities.length - 1]}`;
  }

  return format;
};

const getDateInfo = (events) => {
  const months = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEPT`, `ACT`, `NOV`, `DEC`];
  const from = new Date(events[0].from);
  let to = new Date(events[events.length - 1].to);

  if (from.getTime() === to.getTime()) {
    to = null;
  }

  let format = `${months[from.getMonth()]} ${from.getDate()}`;

  if (to) {
    format += ` &mdash; ${months[to.getMonth()]} ${to.getDate()}`;
  }

  return format;
};
