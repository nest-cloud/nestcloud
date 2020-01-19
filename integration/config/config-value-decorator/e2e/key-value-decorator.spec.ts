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
        testService = app.get<TestService>(TestService);
        config = app.get<ConsulConfig>(CONFIG);
        await testService.setConfigToConsul();
        await config.onModuleInit();
    });

    after(async () => {
        await testService.removeConfig();
        await app.close();
    });

    it('should get config value by decorator as config module', async () => {
        await app.init();
        expect(testService.getPort()).to.be.eq(3000);
    });
});
