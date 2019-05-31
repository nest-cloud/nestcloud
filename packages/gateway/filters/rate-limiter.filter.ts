import { IFilter } from "../interfaces/filter.interface";
import { get } from 'lodash';
import { Redis } from "ioredis";
import { InjectRedis } from "@nestcloud/redis";
import { BadRequestException, Injectable } from "@nestjs/common";
import { IResponse } from "../interfaces/response.interface";
import { IRequest } from "../interfaces/request.interface";
import * as Limiter from 'ratelimiter';

@Injectable()
export class RateLimiterFilter implements IFilter {
    constructor(
        @InjectRedis() private readonly redis: Redis,
    ) {
    }

    getName(): string {
        return "RateLimiterFilter";
    }

    async before(request: IRequest, response: IResponse): Promise<boolean> {
        const service = get(request.gateway, 'service');
        const limit = new Limiter({ id: service, db: this.redis as any });
        try {
            await new Promise((resolve, reject) => {
                limit.get(function (err, limit) {
                    if (err) return reject(err);

                    response.setHeader('X-RateLimit-Limit', limit.total);
                    response.setHeader('X-RateLimit-Remaining', limit.remaining - 1);
                    response.setHeader('X-RateLimit-Reset', limit.reset);

                    // all good
                    if (limit.remaining) return resolve();

                    // not good
                    const delta = (limit.reset * 1000) - Date.now() | 0;
                    const after = limit.reset - (Date.now() / 1000) | 0;
                    response.setHeader('Retry-After', after);
                    response.setHeader('Content-Type', 'application/json');
                    response.statusCode = 429;
                    response.end(JSON.stringify({ message: `Rate limit exceeded, retry in ${ delta }` }));
                    reject();
                });
            });
        } catch (e) {
            if (e) {
                throw new BadRequestException(e.message);
            }
            return false;
        }

        return true;
    }
}
