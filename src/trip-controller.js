import EventEditor from './components/event-editor';
import Sorter from './components/sorter';
import DaysList from './components/days-list';
import Day from './components/day';
import Event from './components/event.js';

import {isEscBtn, Position, render} from './utils';
import {calculateEventCost} from "./data";

export default class TripController {
  constructor(container, events) {
    this._container = container;
    this._events = events;

    this._sorter = new Sorter();
    this._dayList = new DaysList();
  }

  init() {
    if (this._events.length) {
      // Sorter
      render(this._container, this._sorter.getElement(), Position.BEFOREEND);

      // DAY LIST
      render(this._container, this._dayList.getElement(), Position.BEFOREEND);
    }

    const groupedDays = this._groupEventsByDay(this._events);
    this._renderEvents(groupedDays);
    this._sorter.getElement()
      .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  /**
   *
   * @param {HTMLElement} container
   * @param {object} eventMock
   * @param {boolean} renderForm
   *
   * @private
   */
  _renderEvent(container, eventMock, renderForm = false) {
    const eventEditor = new EventEditor(eventMock);
    const event = new Event(eventMock);

    const onEscKeyDown = (evt) => {
      if (isEscBtn(evt.key)) {
        container.replaceChild(event.getElement(), eventEditor.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const saveFormHandler = () => {
      container.replaceChild(event.getElement(), eventEditor.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    event.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        container.replaceChild(eventEditor.getElement(), event.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    eventEditor.getElement()
      .querySelector(`.event__save-btn`)
      .addEventListener(`submit`, saveFormHandler);

    eventEditor.getElement()
      .addEventListener(`submit`, saveFormHandler);

    let objToRender = renderForm ? eventEditor : event;

    render(container, objToRender.getElement(), Position.BEFOREEND);
  };

  /**
   *
   * @param {array} daysRaw
   * @private
   */
  _renderEvents(daysRaw) {
    const allDays = daysRaw.map(({date, events}, index) => new Day({day: date, number: (index + 1), events}));

    if (allDays.length) {
      allDays.forEach((day) => {
        const dayEl = day.getElement();
        const eventList = dayEl.querySelector('.trip-events__list');

        render(this._dayList.getElement(), dayEl, Position.BEFOREEND);
        day.getEvents().forEach((event) => this._renderEvent(eventList, event));
      });
    } else {
      const newEvent = new Event({});
      this._renderEvent(this._container, newEvent, true);
    }
  }

  /**
   * @param {array} events
   * @returns {{date: string, events:*}[]}
   * @private
   */
  _groupEventsByDay(events) {
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

  _sortByPrice(events) {
    events.sort((eventA, eventB) => calculateEventCost(eventB) - calculateEventCost(eventA));

    return [{
      date: null,
      events
    }];
  }

  _sortByTime(events) {
    events.sort((eventA, eventB) => (eventB.to - eventB.from) - (eventA.to - eventA.from));

    return [{
      date: null,
      events
    }];
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

    this._dayList.getElement().innerHTML = ``;
    let days = [];

    switch (evt.target.dataset.sort) {
      case `sort-price`:
        days = this._sortByPrice(this._events);
        break;
      case `sort-time`:
        days = this._sortByTime(this._events);
        break;
      case `sort-default`:
        days = this._groupEventsByDay(this._events);
        break;
    }

    this._renderEvents(days);
  }
}
