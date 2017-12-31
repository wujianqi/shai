/** @module Shai主模块 */
import { config } from './config';
import DataType from './datatype';
import DataMake from './datamake';

var dt, dm;

export default class Shai {
  constructor() {
    dt = new DataType();
    dm = new DataMake();

    this.check = dt.check;
    this.checkItem = dt.checkItem;
    this.checkItems = dt.checkItems;
    this.checkData = dt.checkData;
    this.addRule = dt.addRule;

    this.schema = dm.schema;
    this.make = dm.makeData;
    this.addSchema = dm.addSchema;
  }

  get t() {
    return dt.t;
  }
  set config(option) {
    if (typeof option !== void 0) {
      Object.assign(config, option);
      dm = new DataMake();
    }
  }
};
