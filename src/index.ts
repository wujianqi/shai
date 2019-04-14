import Validator, { RuleFunction, OnFaultsFunction, CallbackFunction } from './validator';
import Maker, { SettingOption, MethodFuction } from './maker';
import { objectPath } from './validator/objectPath';

export { RuleFunction, SettingOption, MethodFuction, OnFaultsFunction, CallbackFunction }
export default { Validator, Maker, objectPath }