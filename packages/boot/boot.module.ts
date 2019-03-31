import { Module, DynamicModule, Global } from '@nestjs/common';
import { Boot } from './boot.class';
import { NEST_BOOT_PROVIDER } from '@nestcloud/common';

@Global()
@Module({})
export class BootModule {
  static register(
    configPath: string,
    name?: string | ((env: string) => string),
  ): DynamicModule {
    const bootProvider = {
      provide: NEST_BOOT_PROVIDER,
      useFactory: (): Boot => new Boot(configPath, name),
    };
    return {
      module: BootModule,
      providers: [bootProvider],
      exports: [bootProvider],
    };
  }
}
