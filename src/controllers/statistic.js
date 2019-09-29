import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";

import Statistic from "../components/statistic";

import {hideVisually, Position, render, showVisually} from "../utils";
import {EventCategories, eventTypes, getEventCategory, getEventPreposition} from "../data";


export default class StatisticController {
  constructor(container) {
    this._container = container;
    this._events = [];
    this._statistic = new Statistic();

    this._moneyDiagram = null;
    this._transportDiagram = null;
    this._timeSpentDiagram = null;

    this._init();
  }

  _init() {
    render(this._container, this._statistic.getElement(), Position.AFTER);
  }

  show(events) {
    this._events = events;
    showVisually(this._statistic.getElement());
    this._initDiagrams();
  }

  hide() {
    hideVisually(this._statistic.getElement());
    this._destroyDiagrams();
  }

  _initDiagrams() {
    this._initMoneyDiagram();
    this._initTransportDiagram();
    this._initTimeSpentDiagram();
  }

  _destroyDiagrams() {
    this._moneyDiagram.destroy();
    this._transportDiagram.destroy();
    this._timeSpentDiagram.destroy();
  }

  _initMoneyDiagram() {
    const transferTypes = eventTypes[EventCategories.TRANSFER];
    const activityTypes = eventTypes[EventCategories.ACTIVITY];
    const eventsByType = this._groupEventsByTypes([...transferTypes, ...activityTypes]);

    const groupedData = [];

    eventsByType.forEach((typeEvents, type) => {
      if (typeEvents.length === 0) {
        return;
      }

      const totalCost = typeEvents.reduce((acc, event) => acc + parseInt(event.cost, 10), 0);

      groupedData.push({
        type,
        totalCost,
      });
    });

    groupedData.sort((groupA, groupB) => groupB.totalCost - groupA.totalCost);

    const labels = [];
    const data = [];

    groupedData.forEach((group) => {
      labels.push(group.type.toUpperCase());
      data.push(group.totalCost);
    });

    const options = this._getCommonOptions();
    options.title.text = `MONEY`;
    options.plugins.datalabels.formatter = (value) => `€ ${value}`;

    this._transportDiagram = new Chart(this._statistic.getElement().querySelector(`.statistics__chart--money`), {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: `#ffffff`,
        }],
      },
      options
    });
  }

  _initTransportDiagram() {
    const eventsByType = this._groupEventsByTypes(eventTypes[EventCategories.TRANSFER]);
    const groupedData = [];

    eventsByType.forEach((typeEvents, type) => {
      if (typeEvents.length === 0) {
        return;
      }

      groupedData.push({
        type,
        count: typeEvents.length,
      });
    });

    groupedData.sort((groupA, groupB) => groupB.count - groupA.count);

    const labels = [];
    const data = [];

    groupedData.forEach((group) => {
      labels.push(group.type.toUpperCase());
      data.push(group.count);
    });

    const options = this._getCommonOptions();
    options.title.text = `TRANSPORT`;
    options.plugins.datalabels.formatter = (value) => `${value}x`;

    this._moneyDiagram = new Chart(this._statistic.getElement().querySelector(`.statistics__chart--transport`), {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: `#ffffff`,
        }],
      },
      options
    });
  }

  _initTimeSpentDiagram() {
    const eventsByDestination = new Map();

    this._events.forEach((event) => {
      if (!eventsByDestination.get(event.destination)) {
        eventsByDestination.set(event.destination, []);
      }

      eventsByDestination.get(event.destination).push(event);
    });

    const gropedData = [];

    eventsByDestination.forEach((events, destination) => {
      const [firstEvent] = events;
      let label = destination;

      if (getEventCategory(firstEvent.type) === EventCategories.TRANSFER) {
        label = `${getEventPreposition(firstEvent.type)} ${label}`;
      }

      const totalHours = events.reduce((acc, event) => {
        return acc + moment(event.to).diff(moment(event.form), `hours`);
      }, 0);

      gropedData.push({
        label,
        totalHours,
      });
    });

    gropedData.sort((groupA, groupB) => groupB.totalHours - groupA.totalHours);

    const labels = [];
    const data = [];

    gropedData.forEach((group) => {
      labels.push(group.label.toUpperCase());
      data.push(group.totalHours);
    });

    const options = this._getCommonOptions();
    options.title.text = `TIME SPENT`;
    options.plugins.datalabels.formatter = (value) => `${value}H`;

    this._timeSpentDiagram = new Chart(this._statistic.getElement().querySelector(`.statistics__chart--time`), {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: `#ffffff`,
        }],
      },
      options
    });
  }

  _getCommonOptions() {
    return {
      plugins: {
        datalabels: {
          font: {
            weight: `bold`
          },
          align: `start`,
          anchor: `end`
        }
      },
      layout: {
        padding: {
          left: 100,
          right: 0,
          top: 0,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          display: false,
        }],

        yAxes: [{
          barPercentage: 0.8,
          categoryPercentage: 0.7,
          gridLines: {
            drawBorder: false,
            display: false,
            zeroLineWidth: 10
          },
          ticks: {
            fontStyle: `bold`,
            minRotation: 1,
          }
        }],
      },
      title: {
        display: true,
        text: ``,
        position: `left`,
        fontSize: 26,
        fontColor: `#000000`
      },
      tooltips: {
        enabled: false,
      },
      legend: {
        display: false,
      }
    };
  }

  _groupEventsByTypes(types) {
    const eventsByType = new Map();

    types.forEach((type) => {
      eventsByType.set(type, []);
    });

    this._events.forEach((event) => {
      const eventsContainer = eventsByType.get(event.type);

      if (Array.isArray(eventsContainer)) {
        eventsContainer.push(event);
      }
    });

    return eventsByType;
  }
}

