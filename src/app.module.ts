import { UsersModule } from '#/modules/users/users.module';
import {
  Module
} from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvSchema } from "./common/env.schema";
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService<EnvSchema>) => ({
          type: 'mysql',
          database: configService.get("DATABASE"),
          host: configService.get("DB_HOST"),
          port: configService.get("DB_PORT"),
          username: configService.get("DB_USERNAME"),
          password: configService.get("DB_PASSWORD"),
          logging: true,
          logger: "advanced-console",
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get("NODE_ENV") === "development" ? true : false
        })
      }
    ),
    JwtModule.registerAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService<EnvSchema>) => ({
          global: true,
          secret: configService.get("JWT_ACCESS_TOKEN_SECRET"),
          signOptions: {
            expiresIn: configService.get("JWT_EXPIRES_IN"),
          },
        })
      }
    ),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 600,
      },
    ]),
    UsersModule,
    AuthModule,
    EmailModule,
  ],
  controllers: [],
  providers: [

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
  ],
})
export class AppModule { }
