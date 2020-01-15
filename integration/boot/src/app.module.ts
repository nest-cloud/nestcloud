import { Module } from '@nestjs/common';
import { resolve } from 'path';
import { BootModule } from '../../../packages/boot';

@Module({
    imports: [
        BootModule.forRoot({
            filePath: resolve(__dirname, '../config.yaml'),
        }),
    ],
})
export class AppModule {
}
