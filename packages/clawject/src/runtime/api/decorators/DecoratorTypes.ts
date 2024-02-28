/**
 * @internalApi Type declaration for a decorator without arguments.
 *
 * @public
 */
export type DecoratorWithoutArguments<T> = T & ((this: void) => T);

/**
 * @internalApi Type declaration for a modern class decorator.
 *
 * @public
 */
export type ModernClassDecorator = (target: any, context: ClassDecoratorContext) => void;
/**
 * @internalApi Type declaration for a modern class getter decorator.
 *
 * @public
 */
export type ModernClassGetterDecorator = (target: any, context: ClassGetterDecoratorContext) => void;
/**
 * @internalApi Type declaration for a modern class field.
 *
 * @public
 */
export type ModernClassFieldDecorator = (target: any, context: ClassFieldDecoratorContext) => void;
/**
 * @internalApi Type declaration for a modern class field that holding arrow function decorator.
 *
 * @public
 */
export type ModernClassFieldArrowFunctionDecorator = (target: (...args: any[]) => any, context: ClassFieldDecoratorContext) => void;
/**
 * @internalApi Type declaration for a modern class method decorator.
 *
 * @public
 */
export type ModernClassMethodDecorator = (target: any, context: ClassMethodDecoratorContext) => void;
