import { tryExecuteAsync } from "#/common/utils";
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from "express";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/entities/user.entity";
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PasswordResetDto } from "./dto/password-reset-token.dto";
import { JwtAuthGuard } from "./guards/jwt.guards";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return tryExecuteAsync(this.authService.register, createUserDto);
  }


  @Post("login")
  login(@Body() LoginDto: LoginDto) {
    return tryExecuteAsync(this.authService.login, LoginDto);
  }


  @UseGuards(JwtAuthGuard)
  @Get('status')
  async status(@Req() req: Request) {
    return tryExecuteAsync(this.authService.status, (req.user as User));
  }

  @Get('verify-email/:code')
  verifyEmail(@Param('code') code: string) {
    return tryExecuteAsync(this.authService.verifyEmail, code);
  }

  @Get("reset-password-token/:email")
  getResetPasswordToken(@Param("email") email: string) {
    return tryExecuteAsync(this.authService.generatePasswordResetToken, email);
  }


  @Post("reset-password")
  resetPasswordToken(@Body() resetPasswordDto: PasswordResetDto) {

    return tryExecuteAsync(this.authService.resetPassword, resetPasswordDto);
  }

}
