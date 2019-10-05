/** IMPORTS **/
import TripController, {EventAction} from "./controllers/trip";
import StatisticController from "./controllers/statistic";

import Menu from './components/menu';
import TripInfo from './components/trip-info';
import API from "./api";

import {MenuItem, calculateEventCost} from './data';
import {render, Position, unrender} from "./utils";
import FilterController from "./controllers/filter";
import EventModel from "./event-model";
import Message from "./components/message";

/** CONSTANTS **/
const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip/`;

/** VARIABLES **/
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const innerContainer = document.querySelector(`.page-main .page-body__container`);

let eventsData = [];
let pageMessage = new Message(`Loading...`);

/** FUNCTIONS **/
const unrenderMessage = () => {
  unrender(pageMessage.getElement());
  pageMessage.removeElement();
};

const updateTripInfo = (events) => {
  if (tripInfo !== null) {
    unrender(tripInfo.getElement());
    tripInfo.removeElement();
  }

  tripInfo = new TripInfo(events);
  render(tripInfoContainer, tripInfo.getElement(), Position.AFTERBEGIN);
};

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

const eventsLoaded = (events) => {
  unrenderMessage();

  if (events.length === 0) {
    pageMessage = new Message(`Click New Event to create your first point`);
    render(innerContainer, pageMessage.getElement(), Position.AFTERBEGIN);
  } else {
    pageMessage = null;
  }

  tripController.setEvents(events);
  statisticController.setEvents(events);
  filterController.setEvents(events);

  updateTripInfo(events);
  updateTotalCost(events);

  tripController.show();
};

const updateTotalCost = (events) => {
  const totalCost = Math.round(events.reduce((acc, event) => acc + calculateEventCost(event), 0));

  costContainer.firstChild.remove();
  costContainer.append(String(totalCost));
};

/** ACTION **/

render(innerContainer, pageMessage.getElement(), Position.AFTERBEGIN);

// MENU
const menuChangeSubscribers = [];
const menu = new Menu(new Set(Object.values(MenuItem)), MenuItem.TABLE, (menuItem) => {
  menuChangeSubscribers.forEach((subscriber) => subscriber(menuItem));
});

render(document.querySelector(`.trip-controls h2:first-child`), menu.getElement(), Position.AFTER);

// TRIP INFO
const tripInfoContainer = document.querySelector(`.trip-info`);
let tripInfo = null;

const costContainer = document.querySelector(`.trip-info__cost-value`);

updateTotalCost(eventsData);

const filterChangeSubscribers = [];
const filterController = new FilterController(document.querySelector(`.trip-controls`), eventsData, (events) => {
  filterChangeSubscribers.forEach((subscriber) => subscriber(events));
});

const tripEventsEl = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsEl, eventsData, onDataChange, onChangeEvents);

const statisticController = new StatisticController(tripEventsEl, eventsData);

menuChangeSubscribers.push((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      statisticController.hide();
      tripController.show();
      break;
    case MenuItem.STATS:
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
    if (pageMessage !== null) {
      unrenderMessage();
    }

    statisticController.hide();
    tripController.show();
    tripController.toggleCreateEvent();
  });

api
  .getDestinations()
  .then(tripController.setDestinations.bind(tripController));

api
  .getOptions()
  .then(tripController.setOptions.bind(tripController));

api
  .getEvents()
  .then(eventsLoaded);
