import EventModel from "./event-model";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const parseJSON = (response) => {
  return response.json();
};

export default class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(parseJSON)
      .then(EventModel.parseDestinations);
  }

  getOptions() {
    return this._load({url: `offers`})
      .then(parseJSON)
      .then(EventModel.parseOptionsByType);
  }

  getEvents() {
    return this._load({url: `points`})
      .then(parseJSON)
      .then(EventModel.parseEvents);
  }

  createEvent({data}) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(parseJSON)
      .then(EventModel.parseEvent);
  }

  updateEvent({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(parseJSON)
      .then(EventModel.parseEvent);
  }

  deleteEvent({id}) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  syncEvents({events}) {
    const rawEvents = events.map((event) => EventModel.toRaw(event));

    return this._load({
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(rawEvents),
      headers: new Headers({'Content-Type': `application/json`})
    });
  }
}
