import { Module } from '@nestjs/common';
import { ConfigModule } from '../../../../packages/config';
import { EtcdModule } from '../../../../packages/etcd';
import { TestService } from './test.service';
import { ETCD } from '../../../../packages/common';
import { CONFIG_NAME } from './constants';

@Module({
    imports: [
        EtcdModule.forRoot({ hosts: 'http://localhost:2379' }),
        ConfigModule.forRootAsync({ name: CONFIG_NAME, inject: [ETCD] }),
    ],
    providers: [TestService],
})
export class AppModule {
}
