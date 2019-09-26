import Menu from './components/menu.js';
import TripInfo from './components/trip-info.js';
import Filter from "./components/filter";
import Statistic from "./components/statistic";
import TripController from './trip-controller.js';

import {createEvent, MENU_ITEMS, filterItems, calculateEventCost} from './data.js';
import {render, Position, hideVisually, showVisually} from "./utils";

const EVENTS_LIST_LENGTH = 8;

const events = new Array(EVENTS_LIST_LENGTH)
  .fill(``)
  .map(createEvent);

// MENU
const menuChangeSubscribers = [];
const menu = new Menu(new Set(Object.values(MENU_ITEMS)), MENU_ITEMS.TABLE, (menuItem) => {
  menuChangeSubscribers.forEach((subscriber) => subscriber(menuItem));
});

render(document.querySelector(`.trip-controls h2:first-child`), menu.getElement(), Position.AFTER);

// TRIP INFO
if (events.length) {
  const tripInfo = new TripInfo(events);
  render(document.querySelector(`.trip-info`), tripInfo.getElement(), Position.AFTERBEGIN);
}

// Total cost calculating
const totalCost = events.reduce((acc, event) => acc + calculateEventCost(event), 0);

const costContainer = document.querySelector('.trip-info__cost-value');
costContainer.firstChild.remove();
costContainer.append(Math.round(totalCost));

// Filter
render(document.querySelector(`.trip-controls`), (new Filter(filterItems)).getElement(), Position.BEFOREEND);

const tripEventsEl = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsEl, events);
tripController.init();

const statistic = new Statistic();
render(tripEventsEl, statistic.getElement(), Position.AFTER);

menuChangeSubscribers.push((menuItem) => {
  switch (menuItem) {
    case MENU_ITEMS.TABLE:
      hideVisually(statistic.getElement());
      tripController.show();
      break;
    case MENU_ITEMS.STATS:
      showVisually(statistic.getElement());
      tripController.hide();
      break;
  }
});
