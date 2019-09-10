import EventEditor from './components/event-editor';
import Sorter from './components/sorter';
import DaysList from './components/days-list';
import Day from './components/day';
import Event from './components/event.js';

import {isEscBtn, Position, render} from './utils';

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
    const allDays = groupedDays.map(({date, events}, index) => new Day({day: date, number: (index + 1), events}));

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
   *
   * @param container - day.querySelector('.trip-events__list');
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
   * @param events
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
}
