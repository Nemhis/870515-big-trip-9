export const SHORT_ISO_FORMAT = `YYYY-MM-DDTHH:mm`;

export const SHORT_DATE_FORMAT = `YYYY-MM-DD`;

export const SHORT_MONTHS = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEPT`, `ACT`, `NOV`, `DEC`];

export const Position = {
  AFTER: `after`,
  BEFORE: `before`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

export const StringPosition = {
  AFTER: `afterend`,
  BEFORE: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  renderString(newElement, template, StringPosition.AFTERBEGIN);
  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
    case Position.AFTER:
      container.after(element);
      break;
    case Position.BEFORE:
      container.before(element);
      break;
  }
};

export const renderString = (container, string, place) => {
  container.insertAdjacentHTML(place, string);
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

export const isEscBtn = (key) => key === `Escape` || key === `Esc`;

/**
 * Setting zero before number, if number less 10
 *
 * @param {number} number
 *
 * @return {string}
 */
export const pad = (number) => (number < 10) ? `0` + number : number;

export const hideVisually = (HTMLElement) => HTMLElement.classList.add(`visually-hidden`);

export const showVisually = (HTMLElement) => HTMLElement.classList.remove(`visually-hidden`);
