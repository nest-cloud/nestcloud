import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { AppModule } from '../src/app.module';
import { CONFIG } from '../../../../packages/common';
import { TestService } from '../src/test.service';
import { ConsulConfig } from '../../../../packages/config/config.consul';
import { INestApplication } from '@nestjs/common';

describe('Config Module With Consul', () => {
    let testingModule: TestingModule;
    let testService: TestService;
    let config: ConsulConfig;
    let app: INestApplication;

    before(async () => {
        const builder = Test.createTestingModule({
            imports: [AppModule],
        });
        testingModule = await builder.compile();
        app = testingModule.createNestApplication();
        testService = testingModule.get<TestService>(TestService);
        config = testingModule.get<ConsulConfig>(CONFIG);
        await testService.setConfigToConsul();
        await config.onModuleInit();
    });

    after(async () => {
        await testService.removeConfig();
        await app.close();
    });

    it('should get config with given path as config module', async () => {
        expect(config.get<number>('web.port', 3333)).to.be.eq(3000);
        expect(config.get<number>('web.extra', 3333)).to.be.eq(3333);
    });

    it('should watch config with given path as config module', async () => {
        await app.init();
        config.watch('test.test', data => {
            expect(data).to.be.eq('nest-cloud');
        });
        await config.set('test.test', 'nest-cloud');
    });
});
