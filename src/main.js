import Menu from './components/menu.js';
import TripInfo from './components/trip-info.js';
import Filter from "./components/filter";
import TripController from './trip-controller.js';

import {createEvent, menuItems, filterItems} from './data.js';
import {render, Position} from "./utils";

const EVENTS_LIST_LENGTH = 8;

const events = new Array(EVENTS_LIST_LENGTH)
  .fill(``)
  .map(createEvent);

// MENU
const menu = new Menu(menuItems);
render(document.querySelector(`.trip-controls h2:first-child`), menu.getElement(), Position.AFTER);

// TRIP INFO
if (events.length) {
  const tripInfo = new TripInfo(events);
  render(document.querySelector(`.trip-info`), tripInfo.getElement(), Position.AFTERBEGIN);
}

// Total cost calculating
let totalCost = 0;

events.forEach((event) => {
  let eventCost = Number(event.cost);

  if (Array.isArray(event.options)) {
    event.options.forEach((option) => eventCost += Number(option.cost))
  }

  totalCost += eventCost;
});

totalCost = Math.round(totalCost);

const costContainer = document.querySelector('.trip-info__cost-value');
costContainer.firstChild.remove();
costContainer.append(totalCost);

// Filter
render(document.querySelector(`.trip-controls`), (new Filter(filterItems)).getElement(), Position.BEFOREEND);

const tripController = new TripController(document.querySelector(`.trip-events`), events);
tripController.init();
