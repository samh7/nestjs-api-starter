import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '#/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import environment from '#/common/environment';
import { LoggerMiddleware } from '#/common/middlewares/logger.middleware';
import { ThrottlerModule } from '@nestjs/throttler';
import { TimeConstants } from '#/common/constants/time.constant';

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
        // 32days
        expiresIn: '768h',
      },
    }),

    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: TimeConstants.SECOND * 3,
        limit: 1,
      },
      {
        name: 'medium',
        ttl: 10 * TimeConstants.SECOND,
        limit: 4,
      },
      {
        name: 'long',
        ttl: TimeConstants.MINUTE,
        limit: 7,
      },
    ]),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
