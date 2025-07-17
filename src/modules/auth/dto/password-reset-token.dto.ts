import { IsEmail, IsString } from "class-validator";

export class PasswordResetDto {

	@IsEmail()
	email: string;
	@IsString()

	passwordResetToken: string;

	@IsString()
	password: string;
};
