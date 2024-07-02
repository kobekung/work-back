import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import { User } from 'src/models/user.model';

dotenv.config();
export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      try {
        const sequelize = new Sequelize({
          dialect: process.env.DIALECT as
            | 'mysql'
            | 'postgres'
            | 'sqlite'
            | 'mariadb'
            | 'mssql',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DATABASE,
          // dialectOptions: { connectString: process.env.DB_CONNECTION_STRING },
        });
        sequelize.addModels([User]);
        await sequelize.sync({ alter: false });
        console.log('Database connected');
        return sequelize;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
  },
];
