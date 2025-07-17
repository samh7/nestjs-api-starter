import { Global, Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { EmailService } from './email.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule
  ],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule { }
