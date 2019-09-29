import TripController from "./controllers/trip";
import StatisticController from "./controllers/statistic";

import Menu from './components/menu';
import TripInfo from './components/trip-info';
import API from "./api";

import {MENU_ITEMS, calculateEventCost} from './data';
import {render, Position} from "./utils";
import FilterController from "./controllers/filter";


let eventsData = [];

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip/`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const run = () => {
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

  const costContainer = document.querySelector('.trip-info__cost-value');

  const updateTotalCost = (events) => {
    const totalCost = Math.round(events.reduce((acc, event) => acc + calculateEventCost(event), 0));

    costContainer.firstChild.remove();
    costContainer.append(String(totalCost));
  };

  updateTotalCost(eventsData);

  const filterChangeSubscribers = [];
  const filterController = new FilterController(document.querySelector(`.trip-controls`), eventsData, (events) => {
    filterChangeSubscribers.forEach((subscriber) => subscriber(events));
  });

  const tripEventsEl = document.querySelector(`.trip-events`);
  const dataChangeSubscribers = [];
  const tripController = new TripController(tripEventsEl, eventsData, (events) => {
    dataChangeSubscribers.forEach((subscriber) => subscriber(events));
  });

  const statisticController = new StatisticController(tripEventsEl, eventsData);

  menuChangeSubscribers.push((menuItem) => {
    switch (menuItem) {
      case MENU_ITEMS.TABLE:
        statisticController.hide();
        tripController.show();
        break;
      case MENU_ITEMS.STATS:
        statisticController.show();
        tripController.hide();
        break;
    }
  });

  filterChangeSubscribers.push((events) => {
    tripController.setEvents(events);
    statisticController.hide();
    tripController.show();
  });

  dataChangeSubscribers.push((events) => {
    eventsData = events;
    statisticController.setEvents(eventsData);
    filterController.setEvents(eventsData);
    updateTotalCost(eventsData);
  });

  document
    .querySelector(`.trip-main__event-add-btn`)
    .addEventListener(`click`, () => {
      statisticController.hide();
      tripController.show();
      tripController.createEvent();
    });
};

api
  .getEvents()
  .then((events) => {
    eventsData = events;
    run();
  });
