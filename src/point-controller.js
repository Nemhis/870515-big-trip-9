import EventEditor from "./components/event-editor";
import Event from "./components/event";
import {isEscBtn, Position, render} from "./utils";
import {getDestinationDescription, getDestionationPhotos, getOptionsByEventType} from "./data";

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

    const cancel = () => {
      this._eventEditor.destroyDatePicker();
      this._container.replaceChild(eventViewEl, eventEditEl);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      if (isEscBtn(evt.key)) {
        cancel()
      }
    };

    const saveFormHandler = (event) => {
      event.preventDefault();
      this._onDataChange(this._collectFormData(), this._event.id);
      cancel();
    };

    eventViewEl
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._onViewChange();
        this._container.replaceChild(eventEditEl, eventViewEl);
        this._eventEditor.initDatePicker();
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    eventEditEl
      .addEventListener(`submit`, saveFormHandler);

    eventEditEl
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, () => {
        this._onDataChange(null, this._event.id);
      });


    let objToRender = this._event ? eventViewEl : eventEditEl;

    render(this._container, objToRender, Position.BEFOREEND);
  }

  _collectFormData() {
    const formData = new FormData(this._eventEditor.getElement());
    const from = new Date(formData.get(`event-start-time`));
    const to = new Date(formData.get(`event-end-time`));
    const eventType = formData.get(`event-type`);
    const allOptions = getOptionsByEventType(eventType);
    const destination = formData.get(`event-destination`);

    const newData = {
      type: formData.get(`event-type`),
      destination: destination,
      from: from,
      to: to,
      cost: Number(formData.get(`event-price`)),
      options: allOptions.map((option) => {
        option.isActive = !!formData.get(`event-offer-${option.type}`);

        return Object.assign({}, option)
      }),
      description: getDestinationDescription(destination),
      photos: getDestionationPhotos(destination),
    };

    return Object.assign(this._event, newData);
  }

  setDefaultView() {
    if (this._container.contains(this._eventEditor.getElement())) {
      this._container.replaceChild(this._eventView.getElement(), this._eventEditor.getElement());
    }
  }
}
