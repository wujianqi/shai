import Validator, { Item } from './validator';
import Maker, { SettingOption } from './maker/Maker';
export { Item, SettingOption };
export default class Shai {
    maker: Maker;
    validator: Validator;
    constructor(opts?: SettingOption);
}
