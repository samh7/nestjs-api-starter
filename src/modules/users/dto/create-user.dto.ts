import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;


    @IsNotEmpty()
    @IsString()
    password: string;


    @IsNotEmpty()
    @IsString()
    name: string;


    @IsOptional()
    @IsString()
    phoneNumber: string;


}
