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


export const eventTypes = {
  transfer: [
    `taxi`,
    `bus`,
    `train`,
    `ship`,
    `transport`,
    `drive`,
    `flight`,
  ],
  activity: [
    `check-in`,
    `sightseeing`,
    `restaurant`,
  ],
};

export const allCities = new Set([
  `Amsterdam`,
  `Geneva`,
  `Chamonix`,
  `Saint Petersburg`,
]);

export const options = [
  {
    title: `Add luggage`,
    cost: 10,
    isActive: true,
  },
  {
    title: `Switch to comfort class`,
    cost: 150,
    isActive: true,
  },
  {
    title: `Add meal`,
    cost: 2,
    isActive: true,
  },
  {
    title: `Choose seats`,
    cost: 9,
    isActive: true,
  },
];

export const createEvent = () => {
  const groupName = getRandomArrayValue(Object.keys(eventTypes));
  const from = Date.now() + getTimestamp(getRandomMinMax(1, 72), getRandomMinMax(10, 60));
  const to = from + getTimestamp(getRandomMinMax(1, 124), getRandomMinMax(10, 60));

  return {
    type: getRandomArrayValue(eventTypes[groupName]),
    city: getRandomArrayValue(Array.from(allCities)),
    photos: new Array(getRandomMinMax(5, 10))
      .fill(``)
      .map(() => `http://picsum.photos/300/150?r=${Math.random()}`),
    description: shuffleArray(descriptions).slice(-1 * getRandomMinMax(1, 3)).join(` `),
    from: new Date(from),
    to: new Date(to),
    cost: Math.round(Math.random() * getRandomMinMax(1000, 5000)) / 100,
    options: new Array(getRandomMinMax(0, 2)).fill(``).map(() => options[getRandomMinMax(0, (options.length - 1))]),
  }
};

export const menuItems = new Set([`Table`, `Stats`]);

export const filterItems = new Set([`everything`, `future`, `past`]);
