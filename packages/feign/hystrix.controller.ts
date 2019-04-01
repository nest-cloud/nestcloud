import { Controller, Get, Res } from '@nestjs/common';
import * as Brakes from 'brakes';

@Controller('/hystrix')
export class HystrixController {
    private readonly globalStats = Brakes.getGlobalStats();

    @Get()
    async check(@Res() res) {
        this.globalStats.getHystrixStream().pipe(res);
    }
}
