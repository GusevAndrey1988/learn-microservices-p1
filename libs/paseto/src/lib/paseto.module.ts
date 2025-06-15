import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { PasetoService } from './paseto.service';
import { PASETO_MODULE_OPTION } from './paseto.constants';

export interface PublicKey {
  privateKey: string;
  publicKey: string;
}

export interface LocalKey {
  key: string;
};

export interface PasetoModuleOptions {
  key: LocalKey | PublicKey;
}

export interface PasetoModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory: (...args: any[]) => Promise<PasetoModuleOptions> | PasetoModuleOptions;
    inject?: any[];
}

@Module({
  controllers: [],
  providers: [PasetoService],
  exports: [PasetoService],
})
export class PasetoModule {
  static forRootAsync(options: PasetoModuleAsyncOptions): DynamicModule {
    return {
      module: PasetoModule,
      imports: options.imports,
      providers: [
        {
          provide: PASETO_MODULE_OPTION,
          useFactory: options.useFactory,
          inject: options.inject || []
        }
      ]
    }
  }

  static forRoot(options: PasetoModuleOptions): DynamicModule {
    return {
      module: PasetoModule,
      providers: [
        {
          provide: PASETO_MODULE_OPTION,
          useValue: options,
        }
      ]
    }
  }
}
