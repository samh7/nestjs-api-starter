import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { dataSourceOptions } from '../config/typeorm.config';
import * as dotenv from 'dotenv';
dotenv.config();
(async () => {
  const options: DataSourceOptions & SeederOptions = dataSourceOptions;

  const dataSource = new DataSource(options);
  await dataSource.initialize();

  await runSeeders(dataSource).then(() => {
    process.exit(0);
  });
})();
