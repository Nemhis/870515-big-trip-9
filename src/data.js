/** VARIABLES **/

const options = [
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

/** FUNCTIONS **/

const getRandomPhotos = () => {
  return new Array(getRandomMinMax(5, 10))
    .fill(``)
    .map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
};

const getRandomArrayValue = (array) => array[Math.round(Math.random() * (array.length - 1))];

const getTimestamp = (hours, minute) => (hours * 60 * 60 * 1000) + (minute * 60) * 1000;

const getRandomMinMax = (min, max) => Math.round(Math.random() * (max - min) + min);

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const getRandomOptions = () => {
  const activeOptions = new Array(getRandomMinMax(0, 2)).fill(``).map(() => options[getRandomMinMax(0, (options.length - 1))]);

  return options.map((option) => {
    const clone = Object.assign({}, option);
    clone.isActive = !!activeOptions.find((activeOption) => activeOption.type === option.type);

    return clone;
  });
};

const getRandomDescription = () => shuffleArray(descriptions).slice(-1 * getRandomMinMax(1, 3)).join(` `);

/** EXPORTS **/

export const EventCategory = {
  TRANSFER: `transfer`,
  ACTIVITY: `activity`,
};


export const EventType = {
  [EventCategory.TRANSFER]: [
    `taxi`,
    `bus`,
    `train`,
    `ship`,
    `transport`,
    `drive`,
    `flight`,
  ],
  [EventCategory.ACTIVITY]: [
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
    case EventCategory.TRANSFER:
      preposition = `to`;
      break;
    case EventCategory.ACTIVITY:
      preposition = `in`;
      break;
  }

  return preposition;
}

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

/**
 * Получение типа события
 *
 * @param {String} eventType
 *
 * @return {string}
 */
export function getEventCategory(eventType) {
  const categories = Object.keys(EventType);

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const typesByCategory = Array.isArray(EventType[category]) ? EventType[category] : [];

    if (typesByCategory.indexOf(eventType) !== -1) {
      return category;
    }
  }

  return ``;
}

export const City = new Set([
  `Amsterdam`,
  `Geneva`,
  `Chamonix`,
  `Saint Petersburg`,
]);

export const createEvent = (value, index) => {
  const groupName = getRandomArrayValue(Object.keys(EventType));
  const from = Date.now() + getTimestamp(getRandomMinMax(1, 72), getRandomMinMax(10, 60));
  const to = from + getTimestamp(getRandomMinMax(1, 124), getRandomMinMax(10, 60));

  return {
    id: (index + 1),
    type: getRandomArrayValue(EventType[groupName]),
    from: new Date(from),
    to: new Date(to),
    cost: Math.round(Math.random() * getRandomMinMax(1000, 5000)) / 100,
    options: getRandomOptions(),
    photos: getRandomPhotos(eventTypes),
    description: getRandomDescription(),
    destination: getRandomArrayValue(Array.from(City)),
  };
};

export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`,
};

export const FilterItem = new Set([`everything`, `future`, `past`]);
