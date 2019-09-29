import Statistic from "../components/statistic";
import {hideVisually, Position, render, showVisually} from "../utils";

export default class StatisticController {
  constructor(container) {
    this._container = container;
    this._events = [];
    this._statistic = new Statistic();

    this._init();
  }

  _init() {
    render(this._container, this._statistic.getElement(), Position.AFTER);
  }

  show(events) {
    this._events = events;
    showVisually(this._statistic.getElement());
  }

  hide() {
    hideVisually(this._statistic.getElement());
  }
}
