import EventEditor from "./components/event-editor";
import Event from "./components/event";
import {isEscBtn, Position, render} from "./utils";
import {parseSlashDate} from "./date";

export default class PointController {
  /**
   * @param {HTMLElement} container
   * @param {object} event
   * @param {function} onDataChange
   * @param {function} onViewChange
   */
  constructor(container, event, onDataChange, onViewChange) {
    this._container = container;
    this._event = event;

    this._eventEditor = new EventEditor(this._event || {});
    this._eventView = new Event(this._event || {});

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this.init();
  }

  /**
   * @private
   */
  init() {
    const eventEditEl = this._eventEditor.getElement();
    const eventViewEl = this._eventView.getElement();

    const onEscKeyDown = (evt) => {
      if (isEscBtn(evt.key)) {
        this._onViewChange();
        this._container.replaceChild(eventViewEl, eventEditEl);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const saveFormHandler = (event) => {
      event.preventDefault();
      this._onDataChange(this._collectFormData(), this._event.id);
      this._container.replaceChild(eventViewEl, eventEditEl);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    eventViewEl
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._onViewChange();
        this._container.replaceChild(eventEditEl, eventViewEl);
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    eventEditEl
      .addEventListener(`submit`, saveFormHandler);

    let objToRender = this._event ? eventViewEl : eventEditEl;

    render(this._container, objToRender, Position.BEFOREEND);
  }

  _collectFormData() {
    const formData = new FormData(this._eventEditor.getElement());
    const from = parseSlashDate(formData.get(`event-start-time`));
    const to = parseSlashDate(formData.get(`event-end-time`));

    const newData = {
      type: formData.get(`event-type`),
      destination: formData.get(`event-destination`),
      from: from,
      to: to,
      cost: Number(formData.get(`event-price`)),
    };

    return Object.assign(this._event, newData);
  }

  setDefaultView() {
    if (this._container.contains(this._eventEditor.getElement())) {
      this._container.replaceChild(this._eventView.getElement(), this._eventEditor.getElement());
    }
  }
}
