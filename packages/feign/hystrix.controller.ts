import { Controller, Get, OnModuleInit, Res } from '@nestjs/common';

@Controller('/hystrix')
export class HystrixController implements OnModuleInit {
    private globalStats = null;

    onModuleInit(): any {
        const Brakes = require('brakes');
        this.globalStats = Brakes.getGlobalStats();
    }

    @Get()
    async check(@Res() res) {
        this.globalStats.getHystrixStream().pipe(res);
    }
}
