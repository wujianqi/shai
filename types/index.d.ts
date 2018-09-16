import { DataValidatorInterface } from './datavalidator';
import { MockConfig, MockInterface } from './mock';
export { DataValidatorInterface, MockConfig, MockInterface };
export default class Shai {
    readonly validator: DataValidatorInterface;
    readonly maker: MockInterface;
    mock(option: MockConfig): MockInterface;
}
