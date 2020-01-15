import { Module } from '@nestjs/common';
import { ServiceModule } from '../../../packages/service';
import { ConsulModule } from '../../../packages/consul';
import { CONSUL } from '../../../packages/common';

@Module({
    imports: [
        ConsulModule.forRoot({ host: 'localhost', port: '8500' }),
        ServiceModule.forRootAsync({
            inject: [CONSUL],
            name: 'test-service',
            port: 3000,
        }),
    ],
})
export class AppModule {
}
