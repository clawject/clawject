import ts, { factory } from 'typescript';
import { DeclarationMetadataKind } from './DeclarationMetadata';
import { CompileTimeElement } from './CompileTimeElement';
import { Configuration } from '../configuration/Configuration';
import { Application } from '../application/Application';
import { ApplicationDeclarationMetadata } from './ApplicationDeclarationMetadata';
import { ConfigurationDeclarationMetadata } from './ConfigurationDeclarationMetadata';
import { valueToASTType } from '../ts/utils/valueToASTType';

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
      beans: Array.from(configuration.beanRegister.elements).map(bean => ({
        kind: bean.kind,
        primary: bean.primary,
        external: bean.external,
        qualifier: bean.qualifier,
        nestedProperty: bean.nestedProperty,
        classPropertyName: bean.classMemberName
      })),
      imports : Array.from(configuration.importRegister.elements).map(imp => ({
        classPropertyName: imp.classMemberName
      })),
    };

    return factory.createPropertyDeclaration(
      [],
      factory.createPrivateIdentifier(CompileTimeElement.COMPILE_TIME_METADATA),
      undefined,
      valueToASTType(metadata),
      undefined
    );
  }
}
