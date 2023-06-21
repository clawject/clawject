import { ClassConstructor } from '../ClassConstructor';

export enum FactoryElementType {
    BEAN,
    CONFIGURATION,
    COMPONENT,
    AUTOWIRED,
}

interface FactoryElement {
    id: string;
    type: FactoryElementType;
}

interface BeanFactoryElement extends FactoryElement {
    type: FactoryElementType.BEAN;
}

interface ComponentFactoryElement extends FactoryElement {
    type: FactoryElementType.COMPONENT;
    resolvedConstructorDependencies: Set<string>;
    resolvedAutowired: Set<string>;
}

interface ConfigurationFactoryElement extends FactoryElement {
    type: FactoryElementType.CONFIGURATION;
    resolvedAutowired: Set<string>;
}

interface AutowiredFactoryElement extends FactoryElement {
    type: FactoryElementType.AUTOWIRED;
}

export class InternalApplicationFactory {
    static idToBean: Map<string, BeanFactoryElement> = new Map();
    static idToConfiguration: Map<string, ConfigurationFactoryElement> = new Map();
    static idToComponent: Map<string, ComponentFactoryElement> = new Map();
    static idToAutowired: Map<string, AutowiredFactoryElement> = new Map();
    static store: Map<string, FactoryElement> = new Map();

    static register(factoryElement: FactoryElement): void {
        switch (factoryElement.type) {
        case FactoryElementType.BEAN:
            this.idToBean.set(factoryElement.id, factoryElement as BeanFactoryElement);
            break;
        case FactoryElementType.CONFIGURATION:
            this.idToConfiguration.set(factoryElement.id, factoryElement as ConfigurationFactoryElement);
            break;
        case FactoryElementType.COMPONENT:
            this.idToComponent.set(factoryElement.id, factoryElement as ComponentFactoryElement);
            break;
        case FactoryElementType.AUTOWIRED:
            this.idToAutowired.set(factoryElement.id, factoryElement as AutowiredFactoryElement);
            break;
        }
    }

    static run() {
        console.log('Application ran');
    }
}
