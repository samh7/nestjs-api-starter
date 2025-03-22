import { config } from 'dotenv';
import { z } from 'zod';
import { expand } from 'dotenv-expand';

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
  JWT_REFRESH_TOKEN_SECRET: z.string(),
  LOG_LEVEL: z.string(),
});

const environment = EnvSchema.parse(process.env);

export default environment;
