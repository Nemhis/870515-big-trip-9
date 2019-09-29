import moment from "moment/moment";

import Point from "./point";
import DaysList from '../components/days-list';
import Sort from "./sort";
import Day from '../components/day';

import {Mode} from "../components/event-editor";
import {hideVisually, showVisually, Position, render} from '../utils';
import {eventTypes, EventCategories, getOptionsByEventType} from "../data";


export default class Trip {
  constructor(container, events) {
    this._container = container;
    this._events = events;
    this._sorter = new Sort(this._container, this._events, this._onSortChanged.bind(this));
    this._dayList = new DaysList();

    this._subscriptions = [];
    this._creatingEvent = null;
  }

  init() {
    if (this._events.length) {
      // Sorter
      this._sorter.renderSort();

      // Day list
      render(this._container, this._dayList.getElement(), Position.BEFOREEND);
    }

    const sortedEvents = this._sorter.sort(this._events);
    this._renderEvents(sortedEvents);
  }

  /**
   * @param {object} groupedDays
   *
   * @private
   */
  _renderEvents(groupedDays) {
    this._dayList.getElement().innerHTML = ``;
    const allDays = groupedDays.map(({date, events}, index) => new Day({day: date, number: (index + 1), events}));

    if (allDays.length) {
      allDays.forEach((day) => {
        const dayEl = day.getElement();
        const eventList = dayEl.querySelector(`.trip-events__list`);

        render(this._dayList.getElement(), dayEl, Position.BEFOREEND);
        day.getEvents().forEach((event) => {
          const pointController = new Point(eventList, event, Mode.EDIT, this._onDataChange.bind(this), this._onViewChange.bind(this));
          this._subscriptions.push(pointController.setDefaultView.bind(pointController));
        });
      });
    } else {
      const pointController = new Point(this._container, null, Mode.CREATING, this._onDataChange.bind(this), this._onViewChange.bind(this));
      this._subscriptions.push(pointController.setDefaultView.bind(pointController));
    }
  }

  _onDataChange(newData, id) {
    const index = this._events.findIndex((it) => it.id === id);

    if (newData === null && id === null) { // выход из режима создания
      this._creatingEvent = null;
    } else if (newData !== null && id === null) { // создание
      // TODO: пока нет сохранения на сервер, надо сделать фейковый id
      newData.id = this._events[this._events.length - 1].id + 1;

      this._events = [newData, ...this._events];
      this._creatingEvent.unrender();
      this._creatingEvent = null;
    } else if (newData === null) { // удаление
      this._events = [...this._events.slice(0, index), ...this._events.slice(index + 1)];
    } else { // обновление
      this._events[index] = newData;
    }

    const sortedEvents = this._sorter.sort(this._events);
    this._renderEvents(sortedEvents);
  }

  _onViewChange() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _onSortChanged(sortedEvents) {
    this._renderEvents(sortedEvents);
  }

  createEvent() {
    if (this._creatingEvent !== null) {
      return;
    }

    const [firstType] = eventTypes[EventCategories.TRANSFER];

    const defaultEvent = {
      id: null,
      type: firstType,
      destination: ``,
      photos: [],
      description: ``,
      from: moment().add(1, `days`).toDate(),
      to: moment().add(2, `days`).toDate(),
      cost: 0,
      options: getOptionsByEventType(firstType),
    };

    this._creatingEvent = new Point(
        this._dayList.getElement(),
        defaultEvent,
        Mode.CREATING,
        this._onDataChange.bind(this),
        this._onViewChange.bind(this)
    );
  }

  show() {
    showVisually(this._container);
  }

  hide() {
    hideVisually(this._container);
  }
}
