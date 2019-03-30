import { Body, Controller, Put } from "@nestjs/common";
import { IsNotEmpty, Default } from "@nestcloud/validations";

@Controller()
export class AppController {
    @Put('/')
    put(
        @Body('name', new IsNotEmpty('name cannot be empty')) name: string,
        @Body('age', new Default(13)) age: number) {
    }
}
