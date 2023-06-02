import { FilterType } from '../const.js';
import { isEventBeforeToday } from './util.js';

export const filter = {
  [FilterType.FUTURE]: (points) => points.filter((point) => isEventBeforeToday(point.date_from)),
  [FilterType.EVERYTHING]: (points) => points,
};
