import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailService } from "../email/email.service";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController, UsersService, EmailService, JwtStrategy],
  providers: [AuthService],
})
export class AuthModule { }
