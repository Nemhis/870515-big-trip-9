/** IMPORTS **/
import API from './api';
import Storage from './storage';

import EventProvider from './providers/event-provider';
import OptionProvider from './providers/option-provider';
import DestinationProvider from './providers/destination-provider';

import TripController, {EventAction} from './controllers/trip';
import StatisticController from './controllers/statistic';
import FilterController from './controllers/filter';
import EventModel from './event-model';

import Menu from './components/menu';
import TripInfo from './components/trip-info';
import Message from './components/message';

import {MenuItem, calculateEventCost} from './data';
import {render, Position, unrender} from './utils';

/** CONSTANTS **/
const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip/`;
const EVENTS_STORE_KEY = `events-store-key`;
const DESTINATIONS_STORE_KEY = `destinations-store-key`;
const OPTIONS_STORE_KEY = `options-store-key`;

/** VARIABLES **/
const isOnline = () => window.navigator.onLine;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const eventStorage = new Storage({key: EVENTS_STORE_KEY, storage: localStorage});
const eventProvider = new EventProvider({api, storage: eventStorage, isOnline});

const destinationsStorage = new Storage({key: DESTINATIONS_STORE_KEY, storage: localStorage});
const destinationProvider = new DestinationProvider({api, storage: destinationsStorage, isOnline});

const optionsStorage = new Storage({key: OPTIONS_STORE_KEY, storage: localStorage});
const optionProvider = new OptionProvider({api, storage: optionsStorage, isOnline});

const innerContainer = document.querySelector(`.page-main .page-body__container`);

let eventsData = [];
let loadedEvents = [];
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
      promise = eventProvider.deleteEvent({id});
      break;
    case EventAction.UPDATE:
      promise = eventProvider.updateEvent({
        id,
        data: EventModel.toRaw(update)
      });
      break;
    case EventAction.CREATE:
      promise = eventProvider.createEvent({data: EventModel.toRaw(update)});
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
  loadedEvents = events || [];

  if (events.length === 0) {
    pageMessage = new Message(`Click New Event to create your first point`);
    render(innerContainer, pageMessage.getElement(), Position.AFTERBEGIN);
  } else {
    pageMessage = null;
  }

  tripController.setAllEvents(loadedEvents);
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

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`
});

window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  eventProvider.syncEvents();
});

destinationProvider
  .getDestinations()
  .then(tripController.setDestinations.bind(tripController));

optionProvider
  .getOptions()
  .then(tripController.setOptions.bind(tripController));

eventProvider
  .getEvents()
  .then(eventsLoaded);
