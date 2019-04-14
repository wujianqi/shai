import Validator, { RuleFunction, OnFaultsFunction, CallbackFunction } from './validator';
import Maker, { SettingOption, MethodFuction } from './maker';
import { objectPath } from './validator/objectPath';
export { RuleFunction, SettingOption, MethodFuction, OnFaultsFunction, CallbackFunction };
declare const _default: {
    Validator: typeof Validator;
    Maker: typeof Maker;
    objectPath: typeof objectPath;
};
export default _default;
