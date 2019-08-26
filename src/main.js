import {createEvent, menuItems, filterItems} from './data.js';

import {getMenuTemplate} from './components/menu.js';
import {getFilterTemplate} from './components/filter.js';
import {getTripInfoTemplate} from './components/trip-info.js';
import {getSorterTemplate} from './components/sorter.js';
import {getDaysListTemplate} from './components/days-list.js';
import {getDayTemplate} from './components/day.js';
import {getEventEditorTemplate} from './components/event-editor.js';
import {getEventsListTemplate} from './components/events-list.js';
import {getEventTemplate} from './components/event.js';

const EVENTS_LIST_LENGTH = 3;

const events = new Array(EVENTS_LIST_LENGTH)
  .fill(``)
  .map(createEvent);

function render(container, template, position = `beforeend`) {
  container.insertAdjacentHTML(position, template);
}

render(document.querySelector(`.trip-info`), getTripInfoTemplate(events), 'afterbegin');

// controls
render(document.querySelector(`.trip-controls h2:first-child`), getMenuTemplate(menuItems), `afterend`);
render(document.querySelector(`.trip-controls`), getFilterTemplate(filterItems));
render(document.querySelector(`.trip-events`), getSorterTemplate());

render(document.querySelector(`.trip-events`), getEventEditorTemplate());

// days
render(document.querySelector(`.trip-events`), getDaysListTemplate());

const groupedEvents = {};

events.forEach((event) => {
  const dateString = (new Date(event.from)).toDateString();

  if (!Array.isArray(groupedEvents[dateString])) {
    groupedEvents[dateString] = [];
  }

  groupedEvents[dateString].push(event);
});

const allDays = Object.keys(groupedEvents).sort((dayA, dayB) => (new Date(dayA)).getTime() - (new Date(dayB)).getTime());

// TODO: пока непонятно как корректно организовать рендер вложенных компонентов

allDays.forEach((day, index) => {
  let dayEvents = groupedEvents[day].map(getEventTemplate).join(``);
  render(document.querySelector(`.trip-days`), getDayTemplate(day, index, getEventsListTemplate(dayEvents)));
});
