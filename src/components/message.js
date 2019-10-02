import AbstractComponent from "./abstract-component";

export default class Message extends AbstractComponent {
  constructor(message) {
    super();
    this._message = message;
  }

  getTemplate() {
    return `<p style="text-align: center">${this._message}</p>`;
  }
}
