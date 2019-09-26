export const Position = {
  AFTER: `after`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const SHORT_ISO_FORMAT = `YYYY-MM-DDTHH:mm`;

export const SHORT_DATE_FORMAT = `YYYY-MM-DD`;

export const SHORT_MONTHS = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEPT`, `ACT`, `NOV`, `DEC`];

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.insertAdjacentHTML(`afterbegin`, template);
  return newElement.firstChild;
};

// Рендер и анрендер для компонент
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
  }
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
 * @returns {string}
 */
export const pad = (number) => (number < 10) ? '0' + number : number;

export const hideVisually = (HTMLElement) => HTMLElement.classList.add(`visually-hidden`);

export const showVisually = (HTMLElement) => HTMLElement.classList.remove(`visually-hidden`);
