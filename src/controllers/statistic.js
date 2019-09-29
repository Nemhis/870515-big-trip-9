import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import Statistic from "../components/statistic";
import {hideVisually, Position, render, showVisually} from "../utils";
import {EventCategories, eventTypes} from "../data";

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
    const eventsByType = new Map();

    [...transferTypes, ...activityTypes].forEach((type) => {
      eventsByType.set(type, []);
    });

    this._events.forEach((event) => {
      const eventsContainer = eventsByType.get(event.type);
      eventsContainer.push(event);
    });

    const groupedData = [];

    eventsByType.forEach((typeEvents, type) => {
      if (typeEvents.length === 0) {
        return;
      }

      const totalCost = typeEvents.reduce((acc, event) => acc + parseInt(event.cost), 0);

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

    this._moneyDiagram = new Chart(this._statistic.getElement().querySelector(`.statistics__chart--money`), {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: `#ffffff`,
        }],
      },
      options
    });
  }

  _initTransportDiagram() {

  }

  _initTimeSpentDiagram() {

  }

  _getCommonOptions() {
    return {
      plugins: {
        datalabels: {
          font: {
            weight: `bold`
          },
          formatter: (value) => `€ ` + value,
          align: `start`,
          anchor: `end`
        }
      },
      scales: {
        xAxes: [{
          display: false,
        }],

        yAxes: [{
          barPercentage: .8,
          categoryPercentage: .7,
          gridLines: {
            drawBorder: false,
            display: false
          },
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
    }
  }
}

