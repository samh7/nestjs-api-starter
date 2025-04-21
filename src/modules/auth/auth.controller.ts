import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

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


  @Get()
  findOne() {
    return this.authService.status();
  }

}
