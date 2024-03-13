import ts from 'typescript';
import { TypeComparator } from './TypeComparator';
import { BaseTypesRepository } from './BaseTypesRepository';
import { getCompilationContext } from '../../../transformer/getCompilationContext';

export class CType {
  private static EMPTY_SET = new Set<string>();
  private tsTypeRef: WeakRef<ts.Type>;
  private _relatedFileNames: Set<string> | null = null;

  get relatedFileNames(): Set<string> {
    // If we are not in language service mode,
    // we don't need to calculate related files because tsc watch mode handling all file graph this for us.
    if (!getCompilationContext().languageServiceMode) {
      return CType.EMPTY_SET;
    }

    if (this._relatedFileNames === null) {
      const relatedFileNames = new Set<string>();
      this.fillRelatedFiles(this.tsType, relatedFileNames);
      this._relatedFileNames = relatedFileNames;
    }

    return this._relatedFileNames;
  }

  constructor(
    tsType: ts.Type
  ) {
    this.tsTypeRef = new WeakRef(tsType);
  }

  private fillRelatedFiles(type: ts.Type, relatedFileNames: Set<string>): void {
    if (TypeComparator.checkFlag(type, ts.TypeFlags.UnionOrIntersection)) {
      const unionOrIntersectionType = type as ts.UnionOrIntersectionType;
      unionOrIntersectionType.types.forEach(it => this.fillRelatedFiles(it, relatedFileNames));
    }

    if (TypeComparator.checkFlag(type, ts.TypeFlags.Object)) {
      const expandedObjectTypes = TypeComparator.getExpandedObjectType(type as ts.ObjectType);

      expandedObjectTypes.forEach(it => {
        const symbolDeclarations = it.typeSymbol?.declarations ?? [];

        symbolDeclarations.forEach(declaration => {
          relatedFileNames.add(declaration.getSourceFile().fileName);
        });

        it.typeArguments.forEach(it => this.fillRelatedFiles(it, relatedFileNames));
      });
    }
  }

  get tsType(): ts.Type {
    const tsType = this.tsTypeRef.deref();

    if (!tsType) {
      throw new Error('Type has been GC or not assigned.');
    }

    return tsType;
  }

  isEmptyValue(): boolean {
    return this.getUnionOrIntersectionTypes()?.every(it => it.isEmptyValue()) ?? (this.isVoidLike() || this.isNull());
  }

  getUnionOrIntersectionTypes(): CType[] | null {
    if (!this.isUnionOrIntersection()) {
      return null;
    }

    const thisUnionOrIntersectionTSType = this.tsType as ts.UnionOrIntersectionType;

    return thisUnionOrIntersectionTSType.types.map(it => new CType(it));
  }

  getTypeArguments(): CType[] | null {
    if (TypeComparator.isReferenceType(this.tsType)) {
      return getCompilationContext().typeChecker.getTypeArguments(this.tsType).map(it => new CType(it));
    }

    return null;
  }

  isUnionOrIntersection(): boolean {
    return TypeComparator.checkFlag(this.tsType, ts.TypeFlags.UnionOrIntersection);
  }

  isUnion(): boolean {
    return TypeComparator.checkFlag(this.tsType, ts.TypeFlags.Union);
  }

  isBoolean(): boolean {
    return TypeComparator.checkFlag(this.tsType, ts.TypeFlags.Boolean);
  }

  isVoidLike(): boolean {
    return TypeComparator.checkFlag(this.tsType, ts.TypeFlags.VoidLike);
  }

  isUndefined(): boolean {
    return TypeComparator.checkFlag(this.tsType, ts.TypeFlags.Undefined);
  }

  isVoid(): boolean {
    return TypeComparator.checkFlag(this.tsType, ts.TypeFlags.Null);
  }

  isNull(): boolean {
    return TypeComparator.checkFlag(this.tsType, ts.TypeFlags.Null);
  }

  isNever(): boolean {
    return TypeComparator.checkFlag(this.tsType, ts.TypeFlags.Never);
  }

  isSymbol(): boolean {
    return TypeComparator.checkFlag(this.tsType, ts.TypeFlags.ESSymbol);
  }

  isArray(): boolean {
    return BaseTypesRepository.getBaseTypes().CArray.isCompatible(this);
  }

  isSet(): boolean {
    return BaseTypesRepository.getBaseTypes().CSet.isCompatible(this);
  }

  isMap(): boolean {
    return BaseTypesRepository.getBaseTypes().CMap.isCompatible(this);
  }

  isMapStringToAny(): boolean {
    return BaseTypesRepository.getBaseTypes().CMapStringToAny.isCompatible(this);
  }

  isPromise(): boolean {
    return BaseTypesRepository.getBaseTypes().CPromise.isCompatible(this);
  }

  getPromisedType(): CType | null {
    const typeChecker = getCompilationContext().typeChecker;
    const promisedType = typeChecker.getPromisedTypeOfPromise(this.tsType);

    if (!promisedType) {
      return null;
    }

    return new CType(promisedType);
  }

  isOptionalUndefined(): boolean {
    return this.isUnion() && (this.getUnionOrIntersectionTypes()?.some(it => it.isVoidLike()) ?? false);
  }

  isOptionalNull(): boolean {
    return this.isUnion() && (this.getUnionOrIntersectionTypes()?.some(it => it.isNull()) ?? false);
  }

  isOptional(): boolean {
    return this.isOptionalUndefined() || this.isOptionalNull();
  }

  isCompatibleToPossiblePromise(to: CType): boolean {
    if (to.isPromise()) {
      const promisedType = to.getPromisedType() ?? this;

      return this.isCompatible(promisedType);
    }

    return this.isCompatible(to);
  }

  isCompatible(to: CType): boolean {
    return TypeComparator.compareType(to.tsType, this.tsType);
  }
}
