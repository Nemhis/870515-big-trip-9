import AbstractComponent from "./abstract-component";

export default class DaysList extends AbstractComponent {
  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}
