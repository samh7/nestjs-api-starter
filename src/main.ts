import { NestFactory } from '@nestjs/core';
import { AppModule } from '#/app.module';
import { AllExceptionsFilter } from '#/common/filters/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import environment from './common/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: environment.FRONTEND_URL,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(environment.PORT);
}
bootstrap();
