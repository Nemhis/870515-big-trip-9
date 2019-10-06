import EventModel from '../event-model';

const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

export default class EventProvider {
  constructor({api, storage, isOnline}) {
    this._api = api;
    this._storage = storage;
    this._isOnline = isOnline;
  }

  updateEvent({id, data}) {
    if (this._isOnline()) {
      return this._api.updateEvent({id, data})
        .then((event) => {
          this._storage.setItem({key: event.id, item: EventModel.toRaw(event)});
          return event;
        });
    } else {
      const event = data;
      this._storage.setItem({key: event.id, item: event});

      return Promise.resolve(EventModel.parseEvent(event));
    }
  }

  createEvent({data}) {
    if (this._isOnline()) {
      return this._api.createEvent({data})
        .then((event) => {
          this._storage.setItem({key: event.id, item: EventModel.toRaw(event)});
          return event;
        });
    } else {
      data.id = EventProvider._generateId();
      this._storage.setItem({key: data.id, item: data});

      return Promise.resolve(EventModel.parseEvent(data));
    }
  }

  deleteEvent({id}) {
    if (this._isOnline()) {
      return this._api.deleteEvent({id})
        .then(() => {
          this._storage.removeItem({key: id});
        });
    } else {
      this._storage.removeItem({key: id});

      return Promise.resolve(true);
    }
  }

  getEvents() {
    if (this._isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          events.map((event) => this._storage.setItem({key: event.id, item: EventModel.toRaw(event)}));
          return events;
        });
    } else {
      const rawEventsMap = this._storage.getAll();
      const rawEvents = objectToArray(rawEventsMap);
      const events = EventModel.parseEvents(rawEvents);

      return Promise.resolve(events);
    }
  }

  syncEvents() {
    // return this._api.syncTasks({tasks: objectToArray(this._storage.getAll())});
  }

  static _generateId() {
    return Date.now() + Math.random();
  }
};
