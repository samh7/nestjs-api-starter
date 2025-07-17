import {
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsPhoneNumber,
    IsString
} from 'class-validator';

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    adminName: string;

    @IsNotEmpty()
    @IsString()
    maxStorage: string;

    @IsNotEmpty()
    @IsDateString()
    billingStartDate: Date;

    @IsNotEmpty()
    @IsDateString()
    billingEndDate: Date;

    @IsNotEmpty()
    @IsNumber()
    billingAmount: number;

    @IsNotEmpty()
    @IsString()
    motto: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

}
