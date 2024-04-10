export abstract class DecoratorAlias {
  abstract name: string;
  abstract moduleName: string;

  abstract provideArguments(): unknown[];
}
