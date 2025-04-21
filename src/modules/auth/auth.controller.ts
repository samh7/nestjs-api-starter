import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from "express";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/entities/user.entity";
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from "./guards/jwt.guards";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }


  @Post("login")
  login(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }


  @UseGuards(JwtAuthGuard)
  @Get('status')
  async status(@Req() req: Request) {
    return this.authService.status(req.user as User);
  }

  // @Get('verify-email/:code')
  // verifyEmail(@Param('code') code: string) {
  // 	return this.authService.verifyEmail(code);
  // }

}
