import FilterPresenter from './presenter/filter-presenter.js';
import ListPresenter from './presenter/list-presenter.js';
// import {render} from './framework/render.js';
import PointsModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';

const tripEventsContainer = document.querySelector('.trip-events');
const filterFormContainer = document.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const listPresenter = new ListPresenter(tripEventsContainer, filterModel, pointsModel);
const filterPresenter = new FilterPresenter(filterFormContainer, filterModel, pointsModel);
// render new point button
filterPresenter.init();
listPresenter.init();
