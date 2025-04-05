import { DataSource, DataSourceOptions } from 'typeorm';
import environment from '#/common/environment';
import { SeederOptions } from 'typeorm-extension';

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
  factories: ['src/database/factories/*{.ts,.js}'],
  seeds: ['src/database/seeds/*{.ts,.js}'],
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
