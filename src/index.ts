import Validator, { RuleFunction, OnFaultsFunction, CallbackFunction, ChainInterface } from './validator';
import Maker, { SettingOption, MethodFuction } from './maker';
import { objectPath } from './validator/objectPath';

export { RuleFunction, SettingOption, MethodFuction, OnFaultsFunction, CallbackFunction, ChainInterface }
export default { Validator, Maker, objectPath }