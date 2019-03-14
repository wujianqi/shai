import Validator, { Item } from './validator';
import Maker, { SettingOption } from './maker/Maker';

export { Item, SettingOption }

export default class Shai {
    maker:Maker;
    validator = new Validator();

    constructor(opts?:SettingOption) {
        this.maker = new Maker(opts);
    }
}