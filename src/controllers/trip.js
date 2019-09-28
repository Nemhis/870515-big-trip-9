import moment from "moment/moment";

import Point from "./point";
import Sorter from '../components/sorter';
import DaysList from '../components/days-list';

import Day from '../components/day';
import {hideVisually, Position, render, showVisually} from '../utils';
import {calculateEventCost, eventTypes, EventCategories} from "../data";
import {Mode} from "../components/event-editor";

export default class Trip {
  constructor(container, events) {
    this._container = container;
    this._events = events;

    this._sorter = new Sorter();
    this._dayList = new DaysList();

    this._subscriptions = [];
    this._creatingEvent = null;
  }

  show() {
    showVisually(this._container);
  }

  hide() {
    hideVisually(this._container);
  }

  init() {
    if (this._events.length) {
      // Sorter
      render(this._container, this._sorter.getElement(), Position.BEFOREEND);

      // DAY LIST
      render(this._container, this._dayList.getElement(), Position.BEFOREEND);
    }

    this._renderEvents();

    this._sorter.getElement()
      .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  /**
   * @private
   */
  _renderEvents() {
    const groupedDays = this._sort();
    const allDays = groupedDays.map(({date, events}, index) => new Day({day: date, number: (index + 1), events}));

    if (allDays.length) {
      allDays.forEach((day) => {
        const dayEl = day.getElement();
        const eventList = dayEl.querySelector('.trip-events__list');

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

  /**
   *
   * @param evt
   * @private
   */
  _onSortLinkClick(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }

    this._sort(evt.target.dataset.sort);
  }

  /**
   * Сортировка точек в соответствии с типом сортировки
   *
   * @param sortType
   * @private
   */
  _sort(sortType = `sort-default`) {
    this._dayList.getElement().innerHTML = ``;
    let days = [];

    switch (sortType) {
      case `sort-price`:
        days = this._sortByPrice(this._events);
        break;
      case `sort-time`:
        days = this._sortByTime(this._events);
        break;
      case `sort-default`:
        days = this._defaultSort(this._events);
        break;
    }

    return days;
  }

  /**
   * Сортировка по умолчанию:
   *
   * Группировка по дням в хронологическом порядке,
   * день события, это день в котором оно начинается
   *
   * @param {array} events
   * @returns {{date: string, events:*}[]}
   * @private
   */
  _defaultSort(events) {
    const groupedEvents = {};

    events.forEach((event) => {
      const dateString = event.from.toDateString();

      if (!Array.isArray(groupedEvents[dateString])) {
        groupedEvents[dateString] = [];
      }

      groupedEvents[dateString].push(event);
    });

    let groupedDays = Object.keys(groupedEvents).map((date) => {
      const events = groupedEvents[date];

      return {date, events};
    });

    groupedDays.sort((dayA, dayB) => ((new Date(dayA.date)).getTime() - (new Date(dayB.date)).getTime()));

    return groupedDays;
  }

  /**
   * Сортировка по цене
   *
   * @param {array} events
   * @returns {{date: null, events: *}[]}
   * @private
   */
  _sortByPrice(events) {
    events.sort((eventA, eventB) => calculateEventCost(eventB) - calculateEventCost(eventA));

    return [{
      date: null,
      events
    }];
  }

  /**
   * Сортировка по длительности события
   *
   * @param {array} events
   * @returns {{date: null, events: *}[]}
   * @private
   */
  _sortByTime(events) {
    events.sort((eventA, eventB) => (eventB.to - eventB.from) - (eventA.to - eventA.from));

    return [{
      date: null,
      events
    }];
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

    this._renderEvents();
  }

  _onViewChange() {
    this._subscriptions.forEach((subscription) => subscription());
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
      options: [],
    };

    this._creatingEvent = new Point(
        this._dayList.getElement(),
        defaultEvent,
        Mode.CREATING,
        this._onDataChange.bind(this),
        this._onViewChange.bind(this)
      );
  }
}
