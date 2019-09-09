import {createEvent, menuItems, filterItems} from './data.js';
import {render, Position, isEscBtn} from "./utils";

import Menu from './components/menu.js';
import Filter from './components/filter.js';
import TripInfo from './components/trip-info.js';
import Sorter from './components/sorter.js';
import DaysList from './components/days-list.js';
import Day from './components/day.js';
import EventEditor from './components/event-editor.js';
import Event from './components/event.js';

const EVENTS_LIST_LENGTH = 8;

const events = new Array(EVENTS_LIST_LENGTH)
  .fill(``)
  .map(createEvent)
  .map((event) => new Event(event));

const tripInfo = new TripInfo(events);

render(document.querySelector(`.trip-info`), tripInfo.getElement(), Position.AFTERBEGIN);

// controls
const menu = new Menu(menuItems);
render(document.querySelector(`.trip-controls h2:first-child`), menu.getElement(), Position.AFTER);

const filter = new Filter(filterItems);
render(document.querySelector(`.trip-controls`), filter.getElement(), Position.BEFOREEND);

const sorter = new Sorter();
render(document.querySelector(`.trip-events`), sorter.getElement(), Position.BEFOREEND);

const groupedEvents = {};

events.forEach((event) => {
  const dateString = event.getFrom().toDateString();

  if (!Array.isArray(groupedEvents[dateString])) {
    groupedEvents[dateString] = [];
  }

  groupedEvents[dateString].push(event);
});

let dayMocks = Object.keys(groupedEvents).map((date) => {
  const events = groupedEvents[date];

  return {date, events};
});

dayMocks.sort((dayA, dayB) => ((new Date(dayA.date)).getTime() - (new Date(dayB.date)).getTime()));

// days
const dayList = new DaysList();
render(document.querySelector(`.trip-events`), dayList.getElement(), Position.BEFOREEND);
const allDays = dayMocks.map(({date, events}, index) => new Day({day: date, number: (index + 1), events}));

const renderEvent = (container, event) => {
  const eventEditor = new EventEditor({
    type: event.getType(),
    from: event.getFrom(),
    to: event.getTo(),
    cost: event.getCost(),
    city: event.getCity(),
  });

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

  render(container, event.getElement(), Position.BEFOREEND);
};


allDays.forEach((day) => {
  const dayEl = day.getElement();
  const eventList = dayEl.querySelector('.trip-events__list');

  render(dayList.getElement(), dayEl, Position.BEFOREEND);
  day.getEvents().forEach((event) => renderEvent(eventList, event));
});

// Total cost calculating
let totalCost = 0;

events.forEach((event) => {
  let eventCost = Number(event.getCost());

  if (Array.isArray(event.getOptions())) {
    event.getOptions().forEach((option) => eventCost += Number(option.cost))
  }

  totalCost += eventCost;
});

totalCost = Math.round(totalCost);

const costContainer = document.querySelector('.trip-info__cost-value');
costContainer.firstChild.remove();
costContainer.append(totalCost);
