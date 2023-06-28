import { GITHUB_REPO_LINK } from './constants';

export class ErrorBuilder {
    static beanNotFoundInContext(contextName: string | null, beanName: string): Error {
        return new Error(`Bean "${beanName}" is missing in context "${this.getContextName(contextName)}"`);
    }

    static classNotInheritorOfCatContext(): Error {
        return new Error('Class that is passed to the Container is not an inheritor of CatContext');
    }

    static noContextByKey(contextName: string | null, contextKey: any): Error {
        return new Error(`Context "${this.getContextName(contextName)}" and key ${this.contextKeyToString(contextKey)} was not initialized`);
    }

    static usageWithoutConfiguredDI(cause: string = 'DI'): Error {
        return new Error(`You are trying to use ${cause} without without proper "clawject" configuration or in wrong place, please check the documentation ${GITHUB_REPO_LINK}`);
    }

    static contextKeyToString(contextKey: any): string {
        if (contextKey === undefined) {
            return '"undefined"';
        }

        if (contextKey === null) {
            return '"null"';
        }

        let stringifiedKey: string;

        try {
            stringifiedKey = JSON.stringify(contextKey);
        } catch (e) {
            try {
                stringifiedKey = `${contextKey}`;
            } catch (e) {
                stringifiedKey = '"NOT_SERIALIZABLE_KEY"';
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (global.Symbol && typeof contextKey === 'symbol') {
                    if ((contextKey as Symbol).description) {
                        stringifiedKey = `"Symbol(${(contextKey as Symbol).description})"`;
                    } else {
                        stringifiedKey = '"SYMBOL_WITHOUT_DESCRIPTION"';
                    }
                }
            }
        }

        return stringifiedKey;
    }

    private static getContextName(contextName: string | null): string {
        return contextName ?? '<anonymous>';
    }
}
