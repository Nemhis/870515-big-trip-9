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
   * @param {function} [onDestroy]
   */
  constructor(container, event, mode, onDataChange, onViewChange, onDestroy) {
    this._container = container;
    this._event = event;

    this._mode = mode;
    this._eventEditor = new EventEditor(this._event || {}, this._mode);
    this._eventView = new Event(this._event || {});

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onDestroy = onDestroy;
    this._bindedOnEscKeyDown = this._onEscKeyDown.bind(this);

    this._init();
  }

  setDestinations(destinations) {
    this._eventEditor.renderDestinationList(destinations);
  }

  setOptions(options) {
    this._eventEditor.setAllOptions(options);
  }

  _onEscKeyDown(evt) {
    if (isEscBtn(evt.key)) {
      if (this._mode === Mode.CREATING) {
        this.unrender();
        document.removeEventListener(`keydown`, this._bindedOnEscKeyDown);
      } else {
        this.closeEdit();
      }
    }
  }

  closeEdit() {
    this._eventEditor.destroyDatePicker();
    this._container.replaceChild(this._eventView.getElement(), this._eventEditor.getElement());
    document.removeEventListener(`keydown`, this._bindedOnEscKeyDown);
  }

  /**
   * @private
   */
  _init() {
    const eventEditEl = this._eventEditor.getElement();
    const eventViewEl = this._eventView.getElement();

    const saveFormHandler = (event) => {
      event.preventDefault();
      this.removeInvalidState();
      this._onDataChange(this._collectFormData(), this._event.id, this);
    };

    eventViewEl
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._onViewChange();
        this._container.replaceChild(eventEditEl, eventViewEl);
        this._eventEditor.initDatePicker();
        document.addEventListener(`keydown`, this._bindedOnEscKeyDown);
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
          this.closeEdit();
        });

      objToRender = eventViewEl;
      position = Position.BEFOREEND;
    } else if (this._mode === Mode.CREATING) {
      this._eventEditor.initDatePicker();
      objToRender = eventEditEl;
      position = Position.BEFORE;
      document.addEventListener(`keydown`, this._bindedOnEscKeyDown);
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
    this
      ._collectControls()
      .forEach((control) => {
        control.disabled = true;
      });
  }

  unblock() {
    this
      ._collectControls()
      .forEach((control) => {
        control.disabled = false;
      });
  }

  toLoadState() {
    this._eventEditor.getElement().querySelector(`.event__save-btn`).innerText = `Saving...`;
  }

  toDeleteState() {
    this._eventEditor.getElement().querySelector(`.event__reset-btn`).innerText = `Deleting...`;
  }

  resetBtns() {
    this._eventEditor.getElement().querySelector(`.event__reset-btn`).innerText = `Delete`;
    this._eventEditor.getElement().querySelector(`.event__save-btn`).innerText = `Save`;
  }

  setInvalidState() {
    const eventEditorEl = this._eventEditor.getElement();
    eventEditorEl.classList.remove(`shake`);
    void eventEditorEl.offsetWidth;
    eventEditorEl.classList.add(`shake`);
    eventEditorEl.style.border = `2px solid #e53e3e`;
  }

  removeInvalidState() {
    const eventEditorEl = this._eventEditor.getElement();
    eventEditorEl.classList.remove(`shake`);
    void eventEditorEl.offsetWidth;
    eventEditorEl.style.border = ``;
  }

  _collectControls() {
    const eventEditorEl = this._eventEditor.getElement();
    let controls = [
      eventEditorEl.querySelector(`.event__input--price`),
      eventEditorEl.querySelector(`.event__input--destination`),
      eventEditorEl.querySelector(`.event__type-toggle`),
      eventEditorEl.querySelector(`.event__save-btn`),
      eventEditorEl.querySelector(`.event__reset-btn`),
    ];

    const rollupBtn = eventEditorEl.querySelector(`.event__rollup-btn`);

    if (rollupBtn) {
      controls.push(rollupBtn);
    }

    const favoriteCheckbox = eventEditorEl.querySelector(`.event__favorite-checkbox`);

    if (favoriteCheckbox) {
      controls.push(favoriteCheckbox);
    }

    const optionsCheckboxes = eventEditorEl.querySelectorAll(`.event__offer-checkbox`);

    if (optionsCheckboxes) {
      controls = [...controls, ...Array.from(optionsCheckboxes)];
    }

    return controls;
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

    if (typeof this._onDestroy === `function`) {
      this._onDestroy();
    }
  }
}
