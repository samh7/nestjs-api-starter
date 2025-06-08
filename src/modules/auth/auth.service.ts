import { EnvSchema } from "#/common/env.schema";
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { compare } from "bcryptjs";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";
import { WelcomeEmailType } from "../../common/types";
import { EmailService } from "../email/email.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService<EnvSchema>,
  ) { }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const _user = await this.userRepository.findOneBy({ email });
    if (!_user) {
      throw new NotFoundException('User not found');
    }

    if (!(await compare(password, _user.password))) {
      throw new UnauthorizedException('Invalid password');
    }

    await this.userRepository.save(_user);


    const payload = {
      email,
      id: _user.id
    };

    const accessToken = this.jwtService.sign(payload);

    const user = plainToInstance(User, _user);
    return { user, accessToken };
  }



  register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }


  status(user: User) {

    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    const _user = this.userService.findOne(user.id);
    if (!_user) {
      throw new UnauthorizedException("User not found");
    }

    return plainToInstance(User, user);
  }



  async verifyEmail(emailVerifyCode: string) {
    const user = await this.userRepository.findOneBy({ emailVerifyCode });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isVerified = true;
    user.emailVerifyCode = null;
    await this.userRepository.save(user);

    const context: WelcomeEmailType = {
      appName: this.configService.get("APP_NAME"),
      dashboardLink: `${this.configService.get("BACKEND_URL")}`,
      name: user.email,
      year: new Date(),
    };
    await this.emailService.sendEmail(user.email, `Welcome to ${this.configService.get("APP_NAME")}`, "welcome", context);

    return { isVerified: user.isVerified, message: "Email verified successfully" };
  }
}
