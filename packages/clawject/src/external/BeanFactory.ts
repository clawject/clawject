//TODO
export interface BeanFactory {
    getBean<T = any>(name: string): T;
    containsBean(name: string): boolean;
    isSingleton(name: string): boolean;
    isPrototype(name: string): boolean;
    isTypeMatch<T>(name: string): boolean;
    getBeanNamesForType<T>(names: string[]): string[];
    getBeansOfType<T>(names: string[]): Map<string, T>;
    getBeansCount(): number;
}
