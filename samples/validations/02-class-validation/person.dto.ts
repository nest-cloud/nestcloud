import { IsNotEmpty, IsNumber } from "class-validator";

export class PersonDto {
    @IsNotEmpty({ message: 'name cannot be empty' })
    name: string;
    @IsNumber({}, { message: 'age param is not number' })
    age: number;
}
