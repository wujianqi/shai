import JSONValidator, { JsonValidatorInterface } from './jsonvalidator';
import Mock, { MockConfig, MockInterface } from './mock';
export { JSONValidator, JsonValidatorInterface, Mock, MockConfig, MockInterface };
export default class Shai {
    readonly validator: JsonValidatorInterface;
    readonly maker: MockInterface;
    mock(option: MockConfig): MockInterface;
}
