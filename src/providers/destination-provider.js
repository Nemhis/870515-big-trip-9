import EventModel from '../event-model';

export default class DestinationProvider {
  constructor({api, storage, isOnline}) {
    this._api = api;
    this._storage = storage;
    this._isOnline = isOnline;
  }

  getDestinations() {
    if (this._isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          destinations.forEach((destination) => {
            return this._storage.setItem({
              key: destination.destination,
              item: EventModel.toRawDestination(destination),
            });
          });

          return destinations;
        });
    } else {
      const destinations = new Map();

      return Promise.resolve(destinations);
    }
  }
}
