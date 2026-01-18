import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const isDev = process.env.NODE_ENV !== 'production';
  
  // Use persistent SQLite database for development
  if (isDev) {
    return {
      type: 'sqlite',
      database: path.join(process.cwd(), 'nettoyage-plus.db'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    };
  }

  // Use PostgreSQL for production
  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: false,
    ssl: {
      rejectUnauthorized: false,
    },
  };
};
