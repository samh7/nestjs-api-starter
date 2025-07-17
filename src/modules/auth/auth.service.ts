import { HOURS_PASSED_BEFORE_SENT_EMAIL } from "#/common/constants";
import { EnvSchema } from "#/common/env.schema";
import { generateEmailVerificationCode, hasPassedHours } from "#/common/utils";
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";
import { WelcomeEmailType } from "../../common/types";
import { EmailService } from "../email/email.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { LoginDto } from './dto/login.dto';
import { PasswordResetDto } from './dto/password-reset-token.dto';

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

    const isUserSaved = await this.userService.login(loginDto);

    const payload = {
      email: isUserSaved.email,
      id: isUserSaved.id
    };

    const accessToken = this.jwtService.sign(payload);

    const user = plainToInstance(User, isUserSaved);
    return { user, accessToken };
  }



  register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }


  async status(user: User) {

    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    const isuUserSaved = this.userService.findOne(user.id);
    if (!isuUserSaved) {
      throw new UnauthorizedException("User not found");
    }

    // dont touch it
    return await plainToInstance(User, user);
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


  async generatePasswordResetToken(email: string) {

    const passwordResetTokenGenerateAt = new Date();

    const isSavedUser = await this.userRepository.findOneBy({
      email: email
    });

    if (isSavedUser.passwordResetToken) {

      throw new BadRequestException("");

    }

    const passwordResetToken = generateEmailVerificationCode(32);

    const userUpdate = Object.assign(isSavedUser, { passwordResetToken, passwordResetTokenGenerateAt });

    return { email: isSavedUser.email, resetToken: userUpdate.passwordResetToken };
  }


  async resetPassword(passwordResetDto: PasswordResetDto) {

    const isSavedUser = await this.userRepository.findOneBy({
      email: passwordResetDto.email
    });

    // hehe
    const canResetPassword = hasPassedHours(new Date(), isSavedUser.lastPasswordReset, HOURS_PASSED_BEFORE_SENT_EMAIL);

    if (!canResetPassword) {
      throw new BadRequestException("Sorry Cannot reset password");
    }

    const userUpdate = Object.assign(isSavedUser, {
      password: passwordResetDto.password
    });

    return plainToInstance(User, this.userRepository.save(userUpdate));

  };
}
