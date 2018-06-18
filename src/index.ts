import JSONValidator, { JsonValidatorInterface } from './jsonvalidator';
import Mock, { MockConfig, MockInterface } from './mock';

export { JSONValidator, JsonValidatorInterface, Mock, MockConfig, MockInterface }

export default class Shai {

    get validator(): JsonValidatorInterface {
        return new JSONValidator();
    }

    get maker(): MockInterface {
        return new Mock();
    }

    mock(option: MockConfig): MockInterface {
        return new Mock(option);
    }

}