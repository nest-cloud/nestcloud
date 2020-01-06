import { Module } from '@nestjs/common';
import { ConfigModule } from '../../../../packages/config';
import { ConsulModule } from '../../../../packages/consul';
import { TestService } from './test.service';
import { CONSUL } from '../../../../packages/common';
import { CONFIG_NAME } from './constants';

@Module({
    imports: [
        ConsulModule.register({ host: 'localhost', port: '8500' }),
        ConfigModule.register({ name: CONFIG_NAME, inject: [CONSUL] }),
    ],
    providers: [TestService],
})
export class AppModule {
}
