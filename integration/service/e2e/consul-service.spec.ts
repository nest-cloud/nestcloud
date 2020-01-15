import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { exec } from 'child_process';
import { AppModule } from '../src/app.module';
import { SERVICE, IService, CONFIG } from '../../../packages/common';
import { promisify } from 'util';
import { TestService } from '../../config/consul/src/test.service';
import { ConsulConfig } from '../../../packages/config/config.consul';
import { INestApplication } from '@nestjs/common';

const execute = promisify(exec);

describe('Service Module', () => {
    let testingModule: TestingModule;
    let app: INestApplication;

    before(async () => {
        const builder = Test.createTestingModule({
            imports: [AppModule],
        });
        testingModule = await builder.compile();
        app = testingModule.createNestApplication();
    });

    it('should get self service as service module', async () => {
        await app.init();
        const result = await execute('consul catalog services');
        expect(result.stdout.includes('test-service')).to.be.eq(true);
    });

    it('should not get self service when shutdown service as service module', async () => {
        await app.init();
        await app.close();
        const result = await execute('consul catalog services');
        expect(result.stdout.includes('test-service')).to.be.eq(false);
    });
});
