import TripController, {EventAction} from "./controllers/trip";
import StatisticController from "./controllers/statistic";

import Menu from './components/menu';
import TripInfo from './components/trip-info';
import API from "./api";

import {MENU_ITEMS, calculateEventCost} from './data';
import {render, Position, unrender} from "./utils";
import FilterController from "./controllers/filter";
import EventModel from "./event-model";

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip/`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

let eventsData = [];

// MENU
const menuChangeSubscribers = [];
const menu = new Menu(new Set(Object.values(MENU_ITEMS)), MENU_ITEMS.TABLE, (menuItem) => {
  menuChangeSubscribers.forEach((subscriber) => subscriber(menuItem));
});

render(document.querySelector(`.trip-controls h2:first-child`), menu.getElement(), Position.AFTER);

// TRIP INFO
const tripInfoContainer = document.querySelector(`.trip-info`);
let tripInfo = null;

const updateTripInfo = (events) => {
  if (tripInfo !== null) {
    unrender(tripInfo.getElement());
    tripInfo.removeElement();
  }

  tripInfo = new TripInfo(events);
  render(tripInfoContainer, tripInfo.getElement(), Position.AFTERBEGIN);
};

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

const onDataChange = (actionType, id, update) => {
  let promise;

  switch (actionType) {
    case EventAction.DELETE:
      promise = api.deleteEvent({id});
      break;
    case EventAction.UPDATE:
      promise = api.updateEvent({
        id,
        data: EventModel.toRaw(update)
      });
      break;
    case EventAction.CREATE:
      promise = api.createEvent({data: EventModel.toRaw(update)});
      break;
  }

  return promise;
};

const onChangeEvents = (events) => {
  statisticController.setEvents(events);
  filterController.setEvents(events);

  updateTripInfo(events);
  updateTotalCost(events);
};

const tripEventsEl = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsEl, eventsData, onDataChange, onChangeEvents);

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

document
  .querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, () => {
    statisticController.hide();
    tripController.show();
    tripController.createEvent();
  });

const eventsLoaded = (events) => {
  tripController.setEvents(events);
  statisticController.setEvents(events);
  filterController.setEvents(events);

  updateTripInfo(events);
  updateTotalCost(events);

  tripController.show();
};

api
  .getDestinations()
  .then(tripController.setDestinations.bind(tripController));

api
  .getOptions()
  .then(tripController.setOptions.bind(tripController));

api
  .getEvents()
  .then(eventsLoaded);
