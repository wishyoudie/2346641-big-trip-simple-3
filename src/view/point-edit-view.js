import AbstractStatefulView from '../framework/view/abstract-view.js';
import { POINT_TYPES } from '../const.js';
import { destinationsStorage, offersStorage } from '../mock/point.js';
import { getFormattedDate } from '../utils/util.js';

const createPointIconTemplate = (id, type) => (`
    <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">`
);

const mapPointTypes = (id) => POINT_TYPES.map((pointType) => `
  <div class="event__type-item">
    <input id="event-type-taxi-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}">
    <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-${id}">${pointType.charAt(0).toUpperCase()}${pointType.slice(1)}</label>
  </div>`).join('');

const createPointTypeListTemplate = (id) => (`
  <div class="event__type-list">
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>
    ${mapPointTypes(id)}
  </fieldset>
  </div>
`);

const createDestinationListTemplate = () => {
  const markup = [];
  for (const destination of Object.values(destinationsStorage)) {
    markup.push(`
    <option value="${destination.name}"></option>
    `);
  }
  return markup.join('');
};

const createPointDestinationTemplate = (id, type, destination) => (`
  <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-${id}">
      ${type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}">
    <datalist id="destination-list-${id}">
      ${createDestinationListTemplate()}
    </datalist>
  </div>
`);

const createPointTimeTemplate = (id, dateFrom, dateTo) => (`
  <div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-${id}}">From</label>
    <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${getFormattedDate(dateFrom, 'DD/MM/YY HH:mm')}">
    &mdash;
    <label class="visually-hidden" for="event-end-time-${id}">To</label>
    <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${getFormattedDate(dateTo, 'DD/MM/YY HH:mm')}">
  </div>
`);

const createPointPriceTemplate = (id, price) => (`
  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-${id}">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${price}">
  </div>
`);

const mapOffers = (stateOffers) => {
  const markup = [];
  for (const offer of stateOffers) {
    markup.push(`
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${offer.isChecked ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
  `);
  }
  return markup.join('');
};

const createPointOffersTemplate = (stateOffers) => (`
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${mapOffers(stateOffers)}
    </div>
  </section>
`);

const getDestinationPicturesMarkup = (destination) => destination.pictures.map((pic) => `
  <img class="event__photo" src="${pic.src}.jpg" alt="${pic.description}">
`);

const createPointDestDetailsTemplate = (destination) => (`
  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${getDestinationPicturesMarkup(destination)}
      </div>
    </div>
  </section>
`);

const createPointEditTemplate = (data) => {
  const dataDestination = destinationsStorage[data.destination];
  const pointIconTemplate = createPointIconTemplate(data.id, data.type);
  const pointTypeListTemplate = createPointTypeListTemplate(data.id);
  const pointDestinationTemplate = createPointDestinationTemplate(data.id, data.type, dataDestination);
  const pointTimeTemplate = createPointTimeTemplate(data.id, data.date_from, data.date_to);
  const pointPriceTemplate = createPointPriceTemplate(data.id, data.base_price);
  const pointOffersTemplate = createPointOffersTemplate(data.state_offers);
  const pointDestDetailsTemplate = createPointDestDetailsTemplate(dataDestination);

  return `
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      ${pointIconTemplate}
      ${pointTypeListTemplate}
    </div>

    ${pointDestinationTemplate}
    ${pointTimeTemplate}
    ${pointPriceTemplate}

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    ${pointOffersTemplate}
    ${pointDestDetailsTemplate}
  </section>
  </form>`;
};

export default class PointEditView extends AbstractStatefulView {
  constructor(point) {
    super();
    this._state = PointEditView.parsePointToState(point);
  }

  get template() {
    return createPointEditTemplate(this._state);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#formSubmitHandler);
    // this.element.addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(PointEditView.parseStateToPoint(this._state));
  };

  setFormResetHandler = (callback) => {
    this._callback.formReset = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formResetHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formResetHandler);
  };

  #formResetHandler = (evt) => {
    evt.preventDefault();
    this._callback.formReset();
  };

  static parsePointToState = (point) => {
    const offs = [];
    for (const off of Object.values(offersStorage)) {
      offs.push({...off, 'isChecked': point.offers.includes(off.id)});
    }
    return {...point, 'state_offers': offs};
  };

  static parseStateToPoint = (state) => {
    // stOff: {id, title, price, isChecked}
    // stOffs = [{}, {}, ...]
    const point = {...state};
    const noffers = [];
    point.state_offers.map((stoff) => {
      if (stoff.isChecked) {
        noffers.push(stoff.id);
      }
    });
    point.offers = noffers;
    delete point.state_offers;
    return point;
  };
}
