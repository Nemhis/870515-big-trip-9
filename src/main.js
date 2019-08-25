import {createEvent} from './data.js';

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

render(document.querySelector(`.trip-info`), getTripInfoTemplate(), 'afterbegin');

// controls
render(document.querySelector(`.trip-controls h2:first-child`), getMenuTemplate(), `afterend`);
render(document.querySelector(`.trip-controls`), getFilterTemplate());
render(document.querySelector(`.trip-events`), getSorterTemplate());

render(document.querySelector(`.trip-events`), getEventEditorTemplate());

// days
render(document.querySelector(`.trip-events`), getDaysListTemplate());
render(document.querySelector(`.trip-days`), getDayTemplate());

// events
render(document.querySelector(`.day`), getEventsListTemplate());

render(document.querySelector(`.trip-events__list`), events.map(getEventTemplate).join(``));
