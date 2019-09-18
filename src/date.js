export const SHORT_MONTHS = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEPT`, `ACT`, `NOV`, `DEC`];
export const HOURS_PER_DAY = 24;
export const MINUTE_PER_HOUR = 60;
export const SECONDS_PER_MINUTE = 60;

/**
 * To format - YYYY-MM-DDTHH:MM
 *
 * @see https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
 *
 * @param {Date} date
 */
export const toShortISO = (date) =>
  `${toShortDate(date)}T${toShortTime(date)}`;

/**
 *
 * @param {Date} date
 *
 * @returns {string}
 */
export const toShortDate = (date) =>
  [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join(`-`);

/**
 *
 * @param {Date} date
 *
 * @returns {string}
 */
export const toSlashDate = (date) =>
  [pad(date.getDate()), pad(date.getMonth() + 1), String(date.getFullYear()).slice(2)].join(`/`);

/**
 * @param string
 *
 * @returns {Date}
 */
export const parseSlashDate = (string) => {
  const [date, time] = string.split(` `);
  let [day, month, year] = date.split(`/`);
  let [hours, minute] = time.split(`:`);
  year = Number(year);

  if (year < 1900) {
    year += 2000;
  }

  return new Date(year, (Number(month) - 1), day, hours, minute);
};

/**
 *
 * @param {Date} date
 *
 * @returns {string}
 */
export const toShortTime = (date) => {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
};

/**
 * Setting zero before number, if number less 10
 *
 * @param {number} number
 *
 * @returns {string}
 */
export const pad = (number) => (number < 10) ? '0' + number : number;
