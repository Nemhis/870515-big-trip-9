import EventEditor, {Mode} from "../components/event-editor";
import Event from "../components/event";
import {isEscBtn, Position, render, unrender} from "../utils";

export default class PointController {
  /**
   * @param {HTMLElement} container
   * @param {object} event
   * @param {int} mode
   * @param {function} onDataChange
   * @param {function} onViewChange
   */
  constructor(container, event, mode, onDataChange, onViewChange) {
    this._container = container;
    this._event = event;

    this._mode = mode;
    this._eventEditor = new EventEditor(this._event || {}, this._mode);
    this._eventView = new Event(this._event || {});

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._init();
  }

  setDestinations(destinations) {
    this._eventEditor.renderDestinationList(destinations);
  }

  setOptions(options) {
    this._eventEditor.setAllOptions(options);
  }

  /**
   * @private
   */
  _init() {
    const eventEditEl = this._eventEditor.getElement();
    const eventViewEl = this._eventView.getElement();

    const cancel = () => {
      this._eventEditor.destroyDatePicker();
      this._container.replaceChild(eventViewEl, eventEditEl);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      if (isEscBtn(evt.key)) {
        cancel();
      }
    };

    const saveFormHandler = (event) => {
      event.preventDefault();
      this._onDataChange(this._collectFormData(), this._event.id, this);
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
        this._onDataChange(null, this._event.id, this);
      });

    let objToRender;
    let position;

    if (this._mode === Mode.EDIT) {
      eventEditEl
        .querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, () => {
          cancel();
        });

      objToRender = eventViewEl;
      position = Position.BEFOREEND;
    } else if (this._mode === Mode.CREATING) {
      this._eventEditor.initDatePicker();
      objToRender = eventEditEl;
      position = Position.BEFORE;
    }

    render(this._container, objToRender, position);
  }

  _collectFormData() {
    const formData = new FormData(this._eventEditor.getElement());
    const from = new Date(formData.get(`event-start-time`));
    const to = new Date(formData.get(`event-end-time`));
    const eventType = formData.get(`event-type`);
    const destination = formData.get(`event-destination`);

    const newData = {
      type: formData.get(`event-type`),
      destination,
      from,
      to,
      cost: Number(formData.get(`event-price`)),
      options: this._eventEditor.getOptions().map((option, index) => {
        option.isActive = formData.get(`event-offer-${eventType}-${index}`) === `on`;

        return Object.assign({}, option);
      }),
      description: this._eventEditor.getDescription(),
      photos: this._eventEditor.getPhotos(),
      isFavorite: formData.get(`event-favorite`) === `on`,
    };

    return Object.assign(this._event, newData);
  }

  block() {
    // TODO: Реализовать блок
    console.log(`block`)
  }

  unblock() {
    // TODO: Реализовать разблок
    console.log(`unblock`)
  }

  setDefaultView() {
    if (this._container.contains(this._eventEditor.getElement())) {
      this._container.replaceChild(this._eventView.getElement(), this._eventEditor.getElement());
    }
  }

  unrender() {
    unrender(this._eventEditor.getElement());
    unrender(this._eventView.getElement());

    this._eventEditor.removeElement();
    this._eventView.removeElement();
  }
}
