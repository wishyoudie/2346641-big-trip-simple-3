import FilterFormView from './view/filter-view.js';
import ListPresenter from './presenter/list-presenter.js';
import {render} from './framework/render.js';
import PointsModel from './model/point-model.js';
import { generateFilter } from './mock/filter.js';

const tripEventsContainer = document.querySelector('.trip-events');
const filterFormContainer = document.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel();
const listPresenter = new ListPresenter(tripEventsContainer, pointsModel);

const filters = generateFilter(pointsModel.points);

// render new point button
render(new FilterFormView(filters), filterFormContainer);
listPresenter.init();
