import { AppModule } from '#/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { EnvSchema } from "./common/env.schema";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<EnvSchema>>(ConfigService);

  app.enableCors({
    origin: configService.get("FRONTEND_URL"),
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());


  await app.listen(configService.get("PORT"));
}
bootstrap();
