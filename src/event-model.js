import moment from 'moment';

const DATE_FORMAT = `YYYY-MM-DDTHH:mm:ss.SSSZ`;

export default class EventModel {
  constructor(data) {
    const id = parseInt(data[`id`], 10);

    this.id = Number.isInteger(id) ? id : null;
    this.type = data[`type`] || ``;
    this.from = EventModel._parseTime(data[`date_from`]);
    this.to = EventModel._parseTime(data[`date_to`]);
    this.cost = parseInt(data[`base_price`], 10) || 0;
    this.options = EventModel.parseOptions({
      type: this.type,
      offers: data[`offers`] || [],
    });

    this.isFavorite = !!data[`is_favorite`];

    const destination = EventModel.parseDestination(data[`destination`] || {});

    this.destination = destination.destination || ``;
    this.description = destination.description || ``;
    this.photos = destination.photos || [];
  }

  static _parseTime(date) {
    const dateTime = moment(date, [`x`, DATE_FORMAT]);

    return dateTime.isValid() ? dateTime.toDate() : new Date();
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
      eventToSave[`id`] = String(event.id);
    }

    return eventToSave;
  }

  static parseDestination(serverDestination) {
    const destination = {};

    destination.destination = serverDestination.name || ``;
    destination.description = serverDestination.description || ``;

    if (Array.isArray(serverDestination.pictures)) {
      destination.photos = serverDestination.pictures.map(({src}) => src);
    }

    return destination;
  }

  static parseDestinations(destinations) {
    const destinationByName = new Map();


    destinations.forEach((destination) => {
      destinationByName.set(destination.name, EventModel.parseDestination(destination));
    });

    return destinationByName;
  }

  static toRawDestination({destination, description, photos}) {
    return {
      name: destination,
      description,
      pictures: photos.map((src) => ({src})),
    };
  }

  static parseOptionsByType(options) {
    const optionsByType = new Map();

    options.forEach((option) => {
      optionsByType.set(option.type, EventModel.parseOptions(option));
    });

    return optionsByType;
  }

  static parseOptions({type, offers}) {
    let options = [];

    offers.forEach(({title, price, accepted = false}) => {
      options.push({
        title,
        type,
        cost: price,
        isActive: !!accepted,
      });
    });

    return options;
  }

  static toRawOption(type, {title, cost}) {
    return {
      type,
      title,
      price: cost,
    };
  }
}
