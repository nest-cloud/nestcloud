import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { TestClient } from '../src/test.client';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('Http Module Use Interceptor', () => {
    let testingModule: TestingModule;
    let testClient: TestClient;
    let app: INestApplication;

    beforeEach(async () => {
        const builder = Test.createTestingModule({
            imports: [AppModule],
        });
        testingModule = await builder.compile();
        app = testingModule.createNestApplication();
        await app.init();
        testClient = app.get<TestClient>(TestClient);
    });

    afterEach(async () => {
        await app.close();
    });

    it('should modify headers use interceptor', async () => {
        const response = await testClient.requestForInterceptorTest();
        expect(response.config.headers['test-request-header']).to.be.eq('test-request-header');
        expect(response.headers['test-response-header']).to.be.eq('test-response-header');
    });
});
