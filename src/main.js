import {createEvent, menuItems, filterItems} from './data.js';

import Menu from './components/menu.js';
import Filter from './components/filter.js';
import TripInfo from './components/trip-info.js';
import Sorter from './components/sorter.js';
import DaysList from './components/days-list.js';
import Day from './components/day.js';
import EventEditor from './components/event-editor.js';
import Event from './components/event.js';

const EVENTS_LIST_LENGTH = 4;

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

render(document.querySelector(`.trip-events`), getEventEditorTemplate(events[0]));

// days
render(document.querySelector(`.trip-events`), getDaysListTemplate());

const groupedEvents = {};

events.forEach((event) => {
  const dateString = event.from.toDateString();

  if (!Array.isArray(groupedEvents[dateString])) {
    groupedEvents[dateString] = [];
  }

  groupedEvents[dateString].push(event);
});


let allDays = Object.keys(groupedEvents).map((day, index) => {
  const events = groupedEvents[day];
  const number = index + 1;

  return new Day({day, number, events})
});

allDays = allDays.sort((dayA, dayB) => dayA.getDate().getTime() - dayB.getDate().getTime());

console.log(allDays);

allDays.forEach((day, index) => {
  let dayEvents = groupedEvents[day].map(getEventTemplate).join(``);
  render(document.querySelector(`.trip-days`), getDayTemplate(day, index, (dayEvents)));
});

/*
// Total cost calculating
let totalCost = 0;

events.forEach((event) => {
  let eventCost = Number(event.cost);

  if (Array.isArray(event.options)) {
    event.options.forEach((option) => eventCost += Number(option.cost))
  }

  totalCost += eventCost;
});

totalCost = Math.round(totalCost);

const costContainer = document.querySelector('.trip-info__cost-value');
costContainer.firstChild.remove();
costContainer.append(totalCost);
*/
