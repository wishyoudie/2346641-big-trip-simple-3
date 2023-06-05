import { RenderPosition, render, remove } from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyPointListView from '../view/point-list-empty-view.js';
import PointPresenter from './point-presenter.js';
import { SortType, UserAction, UpdateType } from '../const.js';
import { sortPointsByDay, sortPointsByPrice } from '../utils/sort.js';

export default class ListPresenter {
  #container = null;
  #pointsModel = null;

  #pointListComponent = new PointListView();
  #sortComponent = null;
  #noPointsComponent = new EmptyPointListView();
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;

  constructor(container, pointsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderMain();
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.DAY:
        return [...this.#pointsModel.points].sort(sortPointsByDay);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortPointsByPrice);
    }
    return this.#pointsModel.points;
  }

  #renderMain = () => {
    if (this.points.length === 0) {
      render(this.#noPointsComponent, this.#container);
      return;
    }

    this.#renderSort();
    render(this.#pointListComponent, this.#container);
    this.points.forEach((point) => this.#renderListItemComponent(point));
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearAll();
        this.#renderMain();
        break;
      case UpdateType.MAJOR:
        this.#clearAll({resetSortType: true});
        this.#renderMain();
        break;
    }
  };


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearAll();
    this.#renderMain();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  };

  #renderListItemComponent = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #clearAll = ({resetSortType = false} = {}) => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#noPointsComponent);
    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };
}
