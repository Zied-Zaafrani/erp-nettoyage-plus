import { DataSource } from 'typeorm';

// Parse DATABASE_URL if provided
const getDatabaseConfig = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    // Use TypeORM URL parsing
    return {
      type: 'postgres' as const,
      url: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };
  }

  // Fallback to individual env variables
  return {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'nettoyageplus',
    ssl: process.env.DB_SSL !== 'false',
  };
};

const AppDataSource = new DataSource({
  ...getDatabaseConfig(),
  entities: [
    process.env.NODE_ENV === 'production'
      ? 'dist/modules/**/entities/*.js'
      : 'src/modules/**/entities/*.ts'
  ],
  migrations: [
    process.env.NODE_ENV === 'production'
      ? 'dist/migrations/*.js'
      : 'src/migrations/*.ts'
  ],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
});

export default AppDataSource;
