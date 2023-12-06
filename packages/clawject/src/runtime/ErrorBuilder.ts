import { ClassConstructor } from './ClassConstructor';
import { RuntimeErrors } from './errors';
import { GITHUB_REPO_LINK } from './constants';

export class ErrorBuilder {
  static beanNotFound(contextName: string | null, beanName: string): RuntimeErrors.BeanNotFoundError {
    return new RuntimeErrors.BeanNotFoundError(`Bean '${beanName}' is not found in context '${this.getContextName(contextName)}'`);
  }

  static noClassMetadataFoundError(clazz: ClassConstructor<any>): RuntimeErrors.NoClassMetadataFoundError {
    const error = new RuntimeErrors.NoClassMetadataFoundError('No class metadata found, most likely this class was not transformed because of misconfiguration of \'clawject\'');
    Object.defineProperty(error, 'class', clazz);

    return error;
  }

  static noInitializedContextFoundError(contextName: string | null, contextKey: any): RuntimeErrors.NoInitializedContextFoundError {
    return new RuntimeErrors.NoInitializedContextFoundError(`Context '${this.getContextName(contextName)}' was not initialized, initialization key is attached to this error object`, contextKey);
  }

  static usageWithoutConfiguredDI(cause: string = 'DI'): RuntimeErrors.UsageWithoutConfiguredDIError {
    return new RuntimeErrors.UsageWithoutConfiguredDIError(`You are trying to use ${cause} without without proper 'clawject' configuration or in wrong place, please check the documentation ${GITHUB_REPO_LINK}`);
  }

  static illegalAccess(cause: string): RuntimeErrors.IllegalAccessError {
    return new RuntimeErrors.IllegalAccessError(`Illegal access to ${cause}, please check the documentation ${GITHUB_REPO_LINK}`);
  }

  static noContextMemberFactoryFound(contextName: string | null, name: string): Error {
    return new RuntimeErrors.NoContextMemberFactoryFoundError(`No context member factory found for member '${name}' in context '${this.getContextName(contextName)}'`);
  }

  private static getContextName(contextName: string | null): string {
    return contextName ?? '<anonymous>';
  }
}
