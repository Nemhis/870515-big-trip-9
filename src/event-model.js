import moment from 'moment';

const DATE_FORMAT = `YYYY-MM-DDTHH:mm:ss.SSSZ`;

export default class EventModel {
  constructor(data) {
    this.id = parseInt(data[`id`], 10);
    this.type = data[`type`] || ``;
    this.from = this._parseTime(data[`date_from`]);
    this.to = this._parseTime(data[`date_to`]);
    this.cost = parseInt(data[`base_price`], 10) || 0;
    this.options = this._parseOptions(this.type, data[`offers`] || []);
    this.isFavorite = !!data[`is_favorite`];

    const destination = this._parseDestination(data[`destination`] || {});

    this.destination = destination.destination || ``;
    this.description = destination.description || ``;
    this.photos = destination.photos || [];
  }

  static parseEvent(data) {
    return new EventModel(data);
  }

  static parseEvents(data) {
    return data.map(EventModel.parseEvent);
  }

  static toRaw(event) {
    const destination = {
      'name': event.destination,
      'description': event.description,
      'pictures': event.photos.map((photoSrc) => ({src: photoSrc, description: ``})),
    };

    const offers = event.options.map((option) => {
      return {
        'title': option.title,
        'price': option.cost,
        'accepted': option.isActive,
      };
    });

    const eventToSave = {
      'id': String(event.id),
      'base_price': event.cost,
      'date_from': event.from.getTime(),
      'date_to': event.to.getTime(),
      'is_favorite': event.isFavorite,
      'type': event.type,
      'destination': destination,
      'offers': offers,
    };

    if (String(event.id)) {
      eventToSave['id'] = String(event.id);
    }

    return eventToSave;
  }

  _parseTime(date) {
    const dateTime = moment(date, [`x`, DATE_FORMAT]);

    return dateTime.isValid() ? dateTime.toDate() : new Date;
  }

  _parseOptions(type, serverOptions) {
    const options = [];

    if (Array.isArray(serverOptions)) {
      serverOptions.forEach(({title, price, accepted}) => {
        options.push({
          title,
          type,
          cost: price,
          isActive: !!accepted,
        });
      });
    }

    return options;
  }

  _parseDestination(serverDestination) {
    const destination = {};

    destination.destination = serverDestination.name || ``;
    destination.description = serverDestination.description || ``;

    if (Array.isArray(serverDestination.pictures)) {
      destination.photos = serverDestination.pictures.map(({src}) => src);
    }

    return destination;
  }
}
