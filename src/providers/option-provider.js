import EventModel from '../event-model';

export default class OptionProvider {
  constructor({api, storage, isOnline}) {
    this._api = api;
    this._storage = storage;
    this._isOnline = isOnline;
  }

  getOptions() {
    if (this._isOnline()) {
      return this._api.getOptions()
        .then((optionsByType) => {
          optionsByType.forEach((options, type) => this._storage.setItem({
              key: type,
              item: options.map((option) => EventModel.toRawOption(type, option)),
            }));

          return optionsByType;
        });
    } else {
      const options = new Map();

      return Promise.resolve(options);
    }
  }
};
