import DataValidator, { DataValidatorInterface } from './datavalidator';
import Mock, { MockConfig, MockInterface } from './mock';

export { DataValidatorInterface, MockConfig, MockInterface }

export default class Shai {

    get validator(): DataValidatorInterface {
        return new DataValidator();
    }

    get maker(): MockInterface {
        return new Mock();
    }

    mock(option: MockConfig): MockInterface {
        return new Mock(option);
    }

}