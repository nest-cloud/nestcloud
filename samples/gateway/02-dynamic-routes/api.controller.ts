import { All, Controller, Param, Req, Res } from "@nestjs/common";
import { Gateway, InjectGateway } from "@nestcloud/gateway";
import { Request, Response } from 'express';

@Controller('/api/:service')
export class ApiController {
    constructor(
        @InjectGateway() private readonly gateway: Gateway
    ) {
    }

    @All()
    do(@Req() req: Request, @Res() res: Response, @Param('service') id) {
        this.gateway.forward(req, res, id);
    }
}
