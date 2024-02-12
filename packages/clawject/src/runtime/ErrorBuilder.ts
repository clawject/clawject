import { RuntimeErrors } from './api/RuntimeErrors';
import { GITHUB_REPO_LINK } from './constants';

export class ErrorBuilder {
  static usageWithoutConfiguredDI(cause: string = 'DI'): RuntimeErrors.UsageWithoutConfiguredDIError {
    return new RuntimeErrors.UsageWithoutConfiguredDIError(`You are trying to use ${cause} without without proper 'clawject' configuration or in wrong place, please check the documentation ${GITHUB_REPO_LINK}`);
  }
}
