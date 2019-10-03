/**
 * Подсчёт полной стоимости события
 *
 * @param {Object} event
 * @return {*}
 */
export function calculateEventCost(event) {
  return event.options.reduce((accumulator, option) => {
    const optionCost = option.isActive ? Number(option.cost) : 0;

    return accumulator + optionCost;
  }, Number(event.cost));
}

export const EventCategories = {
  TRANSFER: `transfer`,
  ACTIVITY: `activity`,
};


export const eventTypes = {
  [EventCategories.TRANSFER]: [
    `taxi`,
    `bus`,
    `train`,
    `ship`,
    `transport`,
    `drive`,
    `flight`,
  ],
  [EventCategories.ACTIVITY]: [
    `check-in`,
    `sightseeing`,
    `restaurant`,
  ],
};

/**
 * Получение предлого подходящего под действие
 *
 * @param {String} eventType
 *
 * @return {string}
 */
export function getEventPreposition(eventType) {
  let preposition = ``;

  switch (getEventCategory(eventType)) {
    case EventCategories.TRANSFER:
      preposition = `to`;
      break;
    case EventCategories.ACTIVITY:
      preposition = `in`;
      break;
  }

  return preposition;
}

/**
 * Получение типа события
 *
 * @param {String} eventType
 *
 * @return {string}
 */
export function getEventCategory(eventType) {
  const categories = Object.keys(eventTypes);

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const typesByCategory = Array.isArray(eventTypes[category]) ? eventTypes[category] : [];

    if (typesByCategory.indexOf(eventType) !== -1) {
      return category;
    }
  }

  return ``;
}

const getRandomPhotos = () => {
  return new Array(getRandomMinMax(5, 10))
    .fill(``)
    .map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
};

const descriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const getRandomArrayValue = (array) => array[Math.round(Math.random() * (array.length - 1))];

const getTimestamp = (hours, minute) => (hours * 60 * 60 * 1000) + (minute * 60) * 1000;

const getRandomMinMax = (min, max) => Math.round(Math.random() * (max - min) + min);

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);


export const allCities = new Set([
  `Amsterdam`,
  `Geneva`,
  `Chamonix`,
  `Saint Petersburg`,
]);

const getRandomOptions = () => {
  const activeOptions = new Array(getRandomMinMax(0, 2)).fill(``).map(() => options[getRandomMinMax(0, (options.length - 1))]);

  return options.map((option) => {
    const clone = Object.assign({}, option);
    clone.isActive = !!activeOptions.find((activeOption) => activeOption.type === option.type);

    return clone;
  });
};

export const options = [
  {
    title: `Add luggage`,
    cost: 10,
    type: `luggage`,
    isActive: false,
  },
  {
    title: `Switch to comfort class`,
    cost: 150,
    type: `comfort`,
    isActive: false,
  },
  {
    title: `Add meal`,
    cost: 2,
    type: `meal`,
    isActive: false,
  },
  {
    title: `Choose seats`,
    cost: 9,
    type: `seats`,
    isActive: false,
  },
];

const getRandomDescription = () => shuffleArray(descriptions).slice(-1 * getRandomMinMax(1, 3)).join(` `);

export const createEvent = (value, index) => {
  const groupName = getRandomArrayValue(Object.keys(eventTypes));
  const from = Date.now() + getTimestamp(getRandomMinMax(1, 72), getRandomMinMax(10, 60));
  const to = from + getTimestamp(getRandomMinMax(1, 124), getRandomMinMax(10, 60));

  return {
    id: (index + 1),
    type: getRandomArrayValue(eventTypes[groupName]),
    from: new Date(from),
    to: new Date(to),
    cost: Math.round(Math.random() * getRandomMinMax(1000, 5000)) / 100,
    options: getRandomOptions(),
    photos: getRandomPhotos(),
    description: getRandomDescription(),
    destination: getRandomArrayValue(Array.from(allCities)),
  };
};

export const MENU_ITEMS = {
  TABLE: `Table`,
  STATS: `Stats`,
};

export const filterItems = new Set([`everything`, `future`, `past`]);
