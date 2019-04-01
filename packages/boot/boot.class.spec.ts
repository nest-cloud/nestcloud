import { Boot } from './boot.class';
import { writeFileSync, unlinkSync } from 'fs';
import { resolve } from 'path';
import { expect } from 'chai';

describe('Boot Class', () => {
    process.env.SERVICE = 'your-service-name';
    const filename = 'config-test.yaml';
    const config = `
web:
  service: \${{ SERVICE }}
  port: 3000    
  address: http://\${{ web.service }}:\${{ web.port }}
    `;
    let boot: Boot;
    before(async () => {
        writeFileSync(resolve(__dirname, filename), config);
        boot = new Boot(__dirname, filename);
    });

    it(`boot.get()`, () => {
        expect(boot.get<number>('web.port')).equal(3000);
    });

    it(`boot.get() env value`, () => {
        expect(boot.get<number>('web.service')).equal(process.env.SERVICE);
    });

    it(`boot.get() multi expressions`, () => {
        expect(boot.get<number>('web.address')).equal('http://your-service-name:3000');
    });

    after(async () => {
        unlinkSync(resolve(__dirname, filename));
    });
});
