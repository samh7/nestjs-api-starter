import environment from '#/common/environment';
import { LoggerMiddleware } from '#/common/middlewares/logger.middleware';
import { UsersModule } from '#/modules/users/users.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      database: environment.DATABASE,
      host: environment.DB_HOST,
      port: environment.DB_PORT,
      username: environment.DB_USERNAME,
      password: environment.DB_PASSWORD,
      entities: [__dirname + '**/*.entity{.ts,.js}'],
      synchronize: false,
      autoLoadEntities: true,
    }),
    JwtModule.register({
      global: true,
      secret: environment.JWT_ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: environment.JWT_EXPIRES_IN,
      },
    }),

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
