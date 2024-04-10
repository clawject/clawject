import type ts from 'typescript';
import { DecoratorEntity } from './DecoratorEntity';
import { Context } from '../../compilation-context/Context';
import { getNodeSourceDescriptor } from '../ts/utils/getNodeSourceDescriptor';
import { BaseDecorators } from './BaseDecorators';
import { BaseTypesRepository } from '../type-system/BaseTypesRepository';
import { CType } from '../type-system/CType';
import { TypeComparator } from '../type-system/TypeComparator';
import { getDecorators } from '../ts/utils/getDecorators';
import { getStaticallyKnownValue } from '../ts/utils/getStaticallyKnownValue';
import { Decorator } from '../../api/decorators/Decorator';

export class DecoratorProcessor {
  static storage: Decorator[] = [];
  static nameToDecorators = new Map<string, Decorator[]>();

  static decoratorToAliasedDecorators = new Map<Decorator, Decorator[]>();
  static aliasedDecoratorToDecorators = new Map<Decorator, Decorator[]>();

  static decoratorDeclarationToDecorator = new WeakMap<ts.Node, Decorator | null>();
  static modifierNodeToDecorator = new WeakMap<ts.ModifierLike, Decorator | null>();

  static {
    Object.values(BaseDecorators).forEach(it => {
      this.registerDecorator(it);
    });
  }

  static registerDecorator(decorator: Decorator): void {
    this.storage.push(decorator);

    const decoratorsByName = this.nameToDecorators.get(decorator.name);

    if (!decoratorsByName) {
      this.nameToDecorators.set(decorator.name, [decorator]);
    } else {
      decoratorsByName.push(decorator);
    }
  }

  // TODO It's not used right now
  static initAliases(): void {
    this.storage.forEach(it => {
      const aliasTo = it.aliasTo;

      aliasTo.forEach(alias => {
        const aliasToDecorator = this.storage
          .find(it => it.name === alias.name && it.moduleName === alias.moduleName);

        if (!aliasToDecorator) {
          throw new Error(`Can not register alias for decorator @${it.name} from ${it.moduleName}. Alias @${alias.name} from ${alias.moduleName} is not registered.`);
        }

        const aliasToDecorators = this.decoratorToAliasedDecorators.get(it) ?? [];
        aliasToDecorators.push(aliasToDecorator);
        this.decoratorToAliasedDecorators.set(it, aliasToDecorators);

        const decorators = this.aliasedDecoratorToDecorators.get(aliasToDecorator) ?? [];
        decorators.push(it);
        this.aliasedDecoratorToDecorators.set(aliasToDecorator, decorators);
      });
    });
  }

  static isDecorator(node: ts.ModifierLike, decorator: Decorator): boolean {
    return this.getDecoratorByModifier(node) === decorator;
  }

  static getDecoratorByModifier(node: ts.ModifierLike): Decorator | null {
    const cached = this.modifierNodeToDecorator.get(node);

    if (cached !== undefined) {
      return cached;
    }

    const decorator = this._getDecoratorByModifier(node);

    this.modifierNodeToDecorator.set(node, decorator);

    return decorator;
  }

  private static _getDecoratorByModifier(node: ts.ModifierLike): Decorator | null {
    if (!Context.ts.isDecorator(node)) {
      return null;
    }

    let identifier: ts.Identifier | null = null;

    if (Context.ts.isIdentifier(node.expression)) {
      identifier = node.expression;
    } else if (Context.ts.isCallExpression(node.expression)) {
      identifier = node.expression.expression as ts.Identifier;
    }

    if (identifier === null) {
      return null;
    }

    const nodeSourceDescriptors = getNodeSourceDescriptor(identifier);

    if (nodeSourceDescriptors === null) {
      return null;
    }

    for (const nodeSourceDescriptor of nodeSourceDescriptors) {
      const decorator = this.getRegisteredDecoratorByItsDeclaration(nodeSourceDescriptor.originalNode);

      if (decorator !== null) {
        return decorator;
      }
    }

    return null;
  }

  static getRegisteredDecoratorByItsDeclaration(decoratorDeclarationNode: ts.Node): Decorator | null {
    const decorator = this.decoratorDeclarationToDecorator.get(decoratorDeclarationNode);

    if (decorator !== undefined) {
      return decorator;
    }

    const nodeType = new CType(Context.typeChecker.getTypeAtLocation(decoratorDeclarationNode));

    if (!BaseTypesRepository.getBaseTypes().CClawjectDecorator.isCompatibleNominally(nodeType)) {
      return null;
    }

    const types = nodeType.getUnionOrIntersectionTypes() ?? [nodeType];
    const type = types.find(it => BaseTypesRepository.getBaseTypes().CClawjectDecorator.isCompatibleNominally(it));

    if (!type) {
      this.decoratorDeclarationToDecorator.set(decoratorDeclarationNode, null);
      return null;
    }

    const typeArguments = type.getTypeArguments() ?? [];

    if (typeArguments.length !== 1) {
      this.decoratorDeclarationToDecorator.set(decoratorDeclarationNode, null);
      return null;
    }

    const name = typeArguments[0].tsType;

    if (!TypeComparator.checkFlag(name, Context.ts.TypeFlags.StringLiteral)) {
      this.decoratorDeclarationToDecorator.set(decoratorDeclarationNode, null);
      return null;
    }

    const registeredDecorator = this.storage.find(it => {
      return (name as ts.StringLiteralType).value === it.name && it.predicate(decoratorDeclarationNode.getSourceFile().fileName);
    }) ?? null;
    this.decoratorDeclarationToDecorator.set(decoratorDeclarationNode, registeredDecorator);

    return registeredDecorator;
  }

  static isRegisteredDecorator(node: ts.ModifierLike): boolean {
    return this.storage.some(it => this.isDecorator(node, it));
  }

  static extractDecoratorEntities(node: ts.Node, decorator: Decorator): DecoratorEntity[] {
    const decorators = getDecorators(node)
      .filter(it => this.isDecorator(it, decorator));

    if (decorators.length === 0) {
      return [];
    }

    return decorators.map(it => {
      let args: ts.Expression[] = [];

      if (Context.ts.isCallExpression(it.expression)) {
        args = Array.from(it.expression.arguments);
      }

      const staticallyKnownArgs = args.map(it => {
        const notStaticallyKnownToken = Symbol();
        const value = getStaticallyKnownValue(it, notStaticallyKnownToken);

        return value === notStaticallyKnownToken ? undefined : value;
      });

      return new DecoratorEntity(decorator, args, staticallyKnownArgs, it);
    });
  }

  static extractAllDecoratorEntities(node: ts.Node): DecoratorEntity[] {
    return this.storage.map(it => {
      return this.extractDecoratorEntities(node, it);
    }).flat();
  }

  static extractFirstDecoratorEntity(node: ts.Node, decorator: Decorator): DecoratorEntity | null {
    const entities = this.extractDecoratorEntities(node, decorator);

    if (entities.length === 0) {
      return null;
    }

    return entities[0];
  }
}
