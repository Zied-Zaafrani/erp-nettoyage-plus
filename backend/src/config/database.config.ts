import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const isDev = process.env.NODE_ENV !== 'production';
  
  // Use in-memory database for development (no external dependencies)
  if (isDev) {
    return {
      type: 'sqlite',
      database: ':memory:',
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
