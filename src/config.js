import { data } from './resource';
import { util } from './util';

export var config = {
  'divisionCode': util.getItem(Object.keys(data.shorter)) + '0000',
  'beginTime': new Date('1970/01/01'),
  'endTime': new Date(),
  'baseIncrement': 0
};
