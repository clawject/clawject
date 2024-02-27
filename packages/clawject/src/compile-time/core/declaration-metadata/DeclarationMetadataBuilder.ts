import ts, { factory } from 'typescript';
import { DeclarationMetadataKind } from './DeclarationMetadata';
import { CompileTimeElement } from './CompileTimeElement';
import { Configuration } from '../configuration/Configuration';
import { Application } from '../application/Application';
import { ApplicationDeclarationMetadata } from './ApplicationDeclarationMetadata';
import { ConfigurationDeclarationMetadata } from './ConfigurationDeclarationMetadata';
import { valueToASTType } from '../ts/utils/valueToASTType';
import { addDoNotEditComment, DoNotEditElement } from '../application-mode/transformers/addDoNotEditComment';
import { mapSetToArray } from '../utils/mapSetToArray';

export class DeclarationMetadataBuilder {
  private static METADATA_VERSION = 1;

  static buildForConfiguration(configuration: Configuration): ts.PropertyDeclaration {
    return this.buildForConfigurationOrApplication(DeclarationMetadataKind.CONFIGURATION, configuration);
  }

  static buildForApplication(application: Application): ts.PropertyDeclaration {
    return this.buildForConfigurationOrApplication(DeclarationMetadataKind.APPLICATION, application.rootConfiguration);
  }

  private static buildForConfigurationOrApplication(metadataKind: DeclarationMetadataKind, configuration: Configuration): ts.PropertyDeclaration {
    const metadata: ConfigurationDeclarationMetadata | ApplicationDeclarationMetadata = {
      kind: metadataKind,
      version: this.METADATA_VERSION,
      external: configuration.external,
      beans: mapSetToArray(configuration.beanRegister.elements, bean => ({
        kind: bean.kind,
        primary: bean.primary,
        external: bean.external,
        qualifier: bean.qualifier,
        nestedProperty: bean.nestedProperty,
        classPropertyName: bean.classMemberName
      })),
      imports : mapSetToArray(configuration.importRegister.elements, imp => ({
        classPropertyName: imp.classMemberName,
        external: imp.external
      })),
    };

    const property = factory.createPropertyDeclaration(
      undefined,
      factory.createPrivateIdentifier(CompileTimeElement.COMPILE_TIME_METADATA),
      undefined,
      valueToASTType(metadata),
      undefined
    );

    return addDoNotEditComment(property, DoNotEditElement.FIELD);
  }
}
