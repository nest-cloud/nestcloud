import { Injectable } from "@nestjs/common";
import { HttpClient } from "./http.client";

@Injectable()
export class TestService {
    constructor(
        private readonly httpClient: HttpClient,
    ) {
    }

    async execute() {
        const data = await this.httpClient.getRemoteData();
    }
}
