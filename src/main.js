import TripController from "./controllers/trip";
import StatisticController from "./controllers/statistic";

import Menu from './components/menu';
import TripInfo from './components/trip-info';
import Filter from "./components/filter";

import {createEvent, MENU_ITEMS, filterItems, calculateEventCost} from './data';
import {render, Position} from "./utils";

const EVENTS_LIST_LENGTH = 28;

let eventsData = new Array(EVENTS_LIST_LENGTH)
  .fill(``)
  .map(createEvent);

// MENU
const menuChangeSubscribers = [];
const menu = new Menu(new Set(Object.values(MENU_ITEMS)), MENU_ITEMS.TABLE, (menuItem) => {
  menuChangeSubscribers.forEach((subscriber) => subscriber(menuItem));
});

render(document.querySelector(`.trip-controls h2:first-child`), menu.getElement(), Position.AFTER);

// TRIP INFO
if (eventsData.length) {
  const tripInfo = new TripInfo(eventsData);
  render(document.querySelector(`.trip-info`), tripInfo.getElement(), Position.AFTERBEGIN);
}

const calculateTotalCost = (eventsS) => Math.round(eventsS.reduce((acc, event) => acc + calculateEventCost(event), 0));

const costContainer = document.querySelector('.trip-info__cost-value');
costContainer.firstChild.remove();
costContainer.append(calculateTotalCost(eventsData));

// Filter
render(document.querySelector(`.trip-controls`), (new Filter(filterItems)).getElement(), Position.BEFOREEND);

const onDataChange = (changedEvents) => {
  eventsData = changedEvents;
  costContainer.firstChild.remove();
  costContainer.append(calculateTotalCost(eventsData));
};

const tripEventsEl = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsEl, eventsData, onDataChange);
tripController.init();

const statisticController = new StatisticController(tripEventsEl);

menuChangeSubscribers.push((menuItem) => {
  switch (menuItem) {
    case MENU_ITEMS.TABLE:
      statisticController.hide();
      tripController.show();
      break;
    case MENU_ITEMS.STATS:
      statisticController.show(eventsData);
      tripController.hide();
      break;
  }
});

document
  .querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, () => {
    tripController.createEvent();
});
