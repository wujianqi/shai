import Validator, { Item } from './validator';
import Maker, { MakerConfig } from './Maker';

export { Item, MakerConfig }

export default class Shai {
    maker:Maker;
    validator = Validator;

    constructor(opts?:MakerConfig) {
        this.maker = new Maker(opts);
    }    
}