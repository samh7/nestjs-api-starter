
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';


import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { z } from 'zod';

expand(config());
const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DB_PORT: z.coerce.number(),
  DATABASE: z.string(),
  DB_HOST: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  NODE_ENV: z.string(),
  JWT_ACCESS_TOKEN_SECRET: z.string(),
  FRONTEND_URL: z.string(),
  EMAIL_USERNAME: z.string(),
  EMAIL_PASSWORD: z.string(),
  VERIFY_EMAIL_URL: z.string(),
  APP_NAME: z.string(),
  JWT_EXPIRES_IN: z.string().default('1d'),
  BACKEND_URL: z.string(),
});

const environment = EnvSchema.parse(process.env);


export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  database: environment.DATABASE,
  host: environment.DB_HOST,
  port: environment.DB_PORT,
  username: environment.DB_USERNAME,
  password: environment.DB_PASSWORD,
  entities: ['src/**/*.entity.ts'],
  synchronize: false,
  migrations: ['src/database/migrations/*-migration.ts'],
  migrationsRun: false,
  logging: true,
  logger: "advanced-console",
  factories: ['src/database/factories/*{.ts,.js}'],
  seeds: ['src/database/seeds/*{.ts,.js}'],
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
