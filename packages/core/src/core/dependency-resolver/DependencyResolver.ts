import { Bean } from '../bean/Bean';
import { Dependency } from '../dependency/Dependency';
import { Application } from '../application/Application';
import { Context } from '../../compilation-context/Context';
import {
  MaybeResolvedDependency,
  ResolvedDependency,
  ResolvedDependencyKind
} from './ResolvedDependency';
import { BaseTypesRepository } from '../type-system/BaseTypesRepository';
import { Configuration } from '../configuration/Configuration';
import { CType } from '../type-system/CType';

type ResolutionResult = {
  resolved: Bean | null;
  candidates: Bean[];
};

export class DependencyResolver {
  static resolveDependency(
    bean: Bean,
    dependency: Dependency,
    beansToSearch: Bean[],
    application: Application
  ): MaybeResolvedDependency {
    const baseTypes = BaseTypesRepository.getBaseTypes();

    switch (true) {
    case dependency.cType.isNever(): {
      return {
        kind: ResolvedDependencyKind.Unresolved,
        relatedDependency: dependency,
        injectionCandidates: [],
      };
    }
    case dependency.cType.isAny(): {
      const resolutionResult = this.resolve(
        dependency,
        dependency.cType,
        beansToSearch
      );

      if (resolutionResult.resolved) {
        return {
          kind: ResolvedDependencyKind.Bean,
          target: resolutionResult.resolved,
        };
      }

      return {
        kind: ResolvedDependencyKind.Unresolved,
        relatedDependency: dependency,
        injectionCandidates: resolutionResult.candidates,
      };
    }

    case dependency.cType.isArray():
    case dependency.cType.isSet():
    case dependency.cType.isMapStringToAny(): {
      let kind:
          | ResolvedDependencyKind.Array
          | ResolvedDependencyKind.Map
          | ResolvedDependencyKind.Set = ResolvedDependencyKind.Array;
      if (dependency.cType.isSet()) {
        kind = ResolvedDependencyKind.Set;
      } else if (dependency.cType.isMapStringToAny()) {
        kind = ResolvedDependencyKind.Map;
      }

      const matchedByTypeAndName = beansToSearch.filter((it) => {
        const byType = dependency.cType.isCompatibleToPossiblePromise(
          it.cType
        );
        const byName = it.fullName === dependency.parameterName;

        return byType && byName;
      });

      if (matchedByTypeAndName.length === 1) {
        return {
          kind: ResolvedDependencyKind.Bean,
          target: matchedByTypeAndName[0],
        };
      }

      const typeArguments = dependency.cType.getTypeArguments();

      if (!typeArguments || typeArguments.length === 0) {
        return {
          kind: ResolvedDependencyKind.Unresolved,
          relatedDependency: dependency,
          injectionCandidates: [],
        };
      }

      const dependenciesType =
          kind === ResolvedDependencyKind.Map
            ? typeArguments[1]
            : typeArguments[0];
      if (!dependenciesType) {
        return {
          kind: ResolvedDependencyKind.Unresolved,
          relatedDependency: dependency,
          injectionCandidates: [],
        };
      }

      const matchedByType = beansToSearch.filter((it) =>
        dependenciesType.isCompatible(it.cType)
      );

      return { kind, target: matchedByType };
    }
    case baseTypes.CApplicationRef.isCompatible(dependency.cType): {
      return { kind: ResolvedDependencyKind.ApplicationRef };
    }

    case baseTypes.CConfigurationRef.isCompatible(dependency.cType): {
      const dependencyTypeArguments =
          dependency.cType.getTypeArguments() ?? [];
      if (dependencyTypeArguments.length !== 1) {
        return {
          kind: ResolvedDependencyKind.Unresolved,
          relatedDependency: dependency,
          injectionCandidates: [],
        };
      }
      const typeArgument = dependencyTypeArguments[0];
      if (typeArgument.isAnyOrUnknown()) {
        return {
          kind: ResolvedDependencyKind.ConfigurationRef,
          target: dependency.parentBean.parentConfiguration,
        };
      }

      const matchedConfigurations: Configuration[] =
          application.configurationsArray.filter((it) => {
            const configurationType = new CType(
              Context.typeChecker.getTypeAtLocation(it.node)
            );
            //TODO compare by class symbol declarations (nominally-like)?
            return typeArgument.isCompatible(configurationType);
          });

      if (matchedConfigurations.length !== 1) {
        //TODO handle better
        return {
          kind: ResolvedDependencyKind.Unresolved,
          relatedDependency: dependency,
          injectionCandidates: [],
        };
      }

      return {
        kind: ResolvedDependencyKind.ConfigurationRef,
        target: matchedConfigurations[0],
      };
    }

    case baseTypes.CLazyConfigurationLoader.isCompatible(dependency.cType): {
      const dependencyTypeArguments =
          dependency.cType.getTypeArguments() ?? [];
      if (dependencyTypeArguments.length !== 1) {
        return {
          kind: ResolvedDependencyKind.Unresolved,
          relatedDependency: dependency,
          injectionCandidates: [],
        };
      }
      const typeArgument = dependencyTypeArguments[0];

      const matchedConfigurations: Configuration[] =
          application.configurationsArray.filter((it) => {
            const configurationType = new CType(
              Context.typeChecker.getTypeAtLocation(it.node)
            );
            //TODO compare by class symbol declarations (nominally-like)?
            return typeArgument.isCompatible(configurationType);
          });

      if (matchedConfigurations.length !== 1) {
        //TODO handle better
        return {
          kind: ResolvedDependencyKind.Unresolved,
          relatedDependency: dependency,
          injectionCandidates: [],
        };
      }

      return {
        kind: ResolvedDependencyKind.LazyConfigurationLoader,
        target: matchedConfigurations[0],
      };
    }

    case baseTypes.CLazy.isCompatible(dependency.cType): {
      const dependencyTypeArguments =
          dependency.cType.getTypeArguments() ?? [];
      if (dependencyTypeArguments.length !== 1) {
        return {
          kind: ResolvedDependencyKind.Unresolved,
          relatedDependency: dependency,
          injectionCandidates: [],
        };
      }
      const typeArgument = dependencyTypeArguments[0];

      const resolutionResult = this.resolve(
        dependency,
        typeArgument,
        beansToSearch
      );

      if (resolutionResult.resolved) {
        return {
          kind: ResolvedDependencyKind.Lazy,
          target: resolutionResult.resolved,
        };
      }

      return {
        kind: ResolvedDependencyKind.Unresolved,
        relatedDependency: dependency,
        injectionCandidates: resolutionResult.candidates,
      };
    }
    default: {
      const resolutionResult = this.resolve(
        dependency,
        dependency.cType,
        beansToSearch
      );

      if (resolutionResult.resolved) {
        return {
          kind: ResolvedDependencyKind.Bean,
          target: resolutionResult.resolved,
        };
      }

      return {
        kind: ResolvedDependencyKind.Unresolved,
        relatedDependency: dependency,
        injectionCandidates: resolutionResult.candidates,
      };
    }
    }
  }

  private static resolve(
    dependency: Dependency,
    dependencyType: CType,
    beansToSearch: Bean[]
  ): ResolutionResult {
    const matchedByType = beansToSearch.filter((it) =>
      dependencyType.isCompatible(it.cType)
    );

    if (matchedByType.length === 1) {
      return {
        resolved: matchedByType[0],
        candidates: matchedByType,
      };
    }

    const matchedByTypeAndName = matchedByType.filter(
      //TODO FUll name replace with names
      (it) => dependency.parameterName === it.fullName
    );

    if (matchedByTypeAndName.length === 1) {
      return {
        resolved: matchedByTypeAndName[0],
        candidates: matchedByType,
      };
    }

    const matchedByTypeAndPrimary = matchedByType.filter(
      (it) => it.definitionMetadata.primary
    );

    if (matchedByTypeAndPrimary.length === 1) {
      return {
        resolved: matchedByTypeAndPrimary[0],
        candidates: matchedByType,
      };
    }

    return {
      resolved: null,
      candidates: matchedByType,
    };
  }
}
