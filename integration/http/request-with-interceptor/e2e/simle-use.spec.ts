import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { TestClient } from '../src/test.client';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('Http Module Simple Use', () => {
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

    it('should response body with @Get decorator', async () => {
        const body = await testClient.requestForBodyTest();
        expect(body.status).to.be.eq('101');
    });

    it('should response header with @Get decorator', async () => {
        const header = await testClient.requestForHeaderTest();
        expect(header.connection).to.be.eq('close');
    });

    it('should response full with @Get decorator', async () => {
        const response = await testClient.requestForResponseTest();
        expect(response.data.status).to.be.eq('101');
    });
});
