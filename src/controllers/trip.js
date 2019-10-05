import moment from "moment/moment";

import PointController from "./point";
import SortController from "./sort";

import DaysList from '../components/days-list';
import Day from '../components/day';

import {Mode} from "../components/event-editor";
import {hideVisually, showVisually, Position, render} from '../utils';
import {EventType, EventCategory} from "../data";
import EventModel from "../event-model";

export const EventAction = {
  DELETE: `delete`,
  CREATE: `create`,
  UPDATE: `update`,
};

export default class TripController {
  constructor(container, events, _onRequestAction, _onDataChange) {
    this._container = container;
    this._events = events;
    this._allEvents = [];
    this._onRequestAction = _onRequestAction;
    this._onMainDataChange = _onDataChange;
    this._sorter = new SortController(this._container, this._events, this._onSortChanged.bind(this));
    this._dayList = new DaysList();

    this._destinations = null;
    this._options = null;

    this._changeViewSubscriptions = [];
    this._destinationLoadedSubscripions = [];
    this._optionsLoadedSubscripions = [];
    this._creatingEvent = null;

    this._init();
  }

  setEvents(events) {
    this._events = events;
  }

  setAllEvents(events) {
    this._allEvents = events;
  }

  setOptions(options) {
    this._options = options;
    this._optionsLoadedSubscripions.forEach((subscriber) => subscriber(options));
  }

  setDestinations(destinations) {
    this._destinations = destinations;
    this._destinationLoadedSubscripions.forEach((subscriber) => subscriber(destinations));
  }

  _init() {
    // Sorter
    if (this._events.length !== 0) {
      this._sorter.renderSort();
    }

    // Day list
    render(this._container, this._dayList.getElement(), Position.BEFOREEND);
  }

  /**
   * @param {object} groupedDays
   *
   * @private
   */
  _renderEvents(groupedDays) {
    this._dayList.getElement().innerHTML = ``;
    const allDays = groupedDays.map(({date, events}, index) => new Day({day: date, number: (index + 1), events}));

    allDays.forEach((day) => {
      const dayEl = day.getElement();
      const eventList = dayEl.querySelector(`.trip-events__list`);

      render(this._dayList.getElement(), dayEl, Position.BEFOREEND);
      day.getEvents().forEach((event) => {
        const pointController = new PointController(eventList, event, Mode.EDIT, this._onDataChange.bind(this), this._onViewChange.bind(this));
        this._resolveAsyncEvents(pointController);
      });
    });
  }

  _resolveAsyncEvents(pointController) {
    if (this._destinations !== null) {
      pointController.setDestinations(this._destinations);
    } else {
      this._destinationLoadedSubscripions.push(pointController.setDestinations.bind(pointController));
    }

    if (this._options !== null) {
      pointController.setOptions(this._options);
    } else {
      this._optionsLoadedSubscripions.push(pointController.setOptions.bind(pointController));
    }

    this._changeViewSubscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  _onDataChange(newData, id, pointController) {
    if (newData === null && id === null) { // выход из режима создания
      pointController.unrender();
      return;
    }

    pointController.block();
    let action;

    if (newData !== null && id === null) {
      action = EventAction.CREATE;
      pointController.toLoadState();
    } else if (newData === null) {
      action = EventAction.DELETE;
      pointController.toDeleteState();
    } else {
      action = EventAction.UPDATE;
      pointController.toLoadState();
    }

    const actionPromise = this._onRequestAction(action, id, newData);

    actionPromise
      .then((event) => {
        this.resolveEventAction(action, event, id);
        pointController.unblock();
        this.render();
      })
      .catch(() => {
        pointController.setInvalidState();
        pointController.resetBtns();
        pointController.unblock();
      });
  }

  _onViewChange() {
    if (this._creatingEvent !== null) {
      this._creatingEvent.unrender();
    }

    this._changeViewSubscriptions.forEach((subscription) => subscription());
  }

  _onSortChanged(sortedEvents) {
    this._renderEvents(sortedEvents);
  }

  _createEvent() {
    if (this._creatingEvent !== null) {
      return;
    }

    this._onViewChange();

    const [firstType] = EventType[EventCategory.TRANSFER];
    const defaultEvent = new EventModel({});

    defaultEvent.type = firstType;
    defaultEvent.from = moment().add(1, `days`).toDate();
    defaultEvent.to = moment().add(2, `days`).toDate();
    defaultEvent.options = this._options.get(firstType);
    const onDestroy = () => {
      this._creatingEvent = null;
    };

    this._creatingEvent = new PointController(
        this._dayList.getElement(),
        defaultEvent,
        Mode.CREATING,
        this._onDataChange.bind(this),
        this._onViewChange.bind(this),
        onDestroy
    );

    this._resolveAsyncEvents(this._creatingEvent);
  }

  resolveEventAction(action, event = null, id = null) {
    let index = null;
    let indexInAll = null;

    if (id !== null) {
      index = this._events.findIndex((it) => it.id === id);
      indexInAll = this._allEvents.findIndex((it) => it.id === id);
    }

    if (action === EventAction.CREATE) {
      this._events = [event, ...this._events];
      this._allEvents = [event, ...this._allEvents];
      this._creatingEvent.unrender();
    } else if (action === EventAction.DELETE && index !== null && indexInAll !== null) {
      this._events = [...this._events.slice(0, index), ...this._events.slice(index + 1)];
      this._allEvents = [...this._allEvents.slice(0, indexInAll), ...this._allEvents.slice(indexInAll + 1)];
    } else if (action === EventAction.UPDATE && index !== null && indexInAll !== null) {
      this._events[index] = event;
      this._allEvents[indexInAll] = event;
    }

    this._onMainDataChange(this._allEvents);
  }

  toggleCreateEvent() {
    if (this._creatingEvent === null) {
      this._createEvent();
    } else {
      this._creatingEvent.unrender();
    }
  }

  render() {
    const sortedEvents = this._sorter.sort(this._events);
    this._renderEvents(sortedEvents);
    this._sorter.unrenderSort();

    if (this._events.length !== 0) {
      this._sorter.renderSort();
    }
  }

  show() {
    showVisually(this._container);
    this.render();
  }

  hide() {
    hideVisually(this._container);
  }
}
